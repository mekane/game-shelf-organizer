import type {
  CellAddress,
  Orientation,
  PlacementIssue,
  PlacementOutput,
  Point2D,
  ProductId,
  ProductInput,
  ProductPlacement,
  Rect2D,
  ShelfId,
  ShelfInput,
  Size2D,
} from '../types';
import { clamp, rectsOverlap, roundInches } from './rect';
import { getShelfGridRect, getShelfInnerBorderInches, getShelfRect } from './layout';

export function flipOrientation(orientation: Orientation): Orientation {
  return orientation === 'horizontal' ? 'vertical' : 'horizontal';
}

export function getEffectiveProductSize(
  product: ProductInput,
  orientation: Orientation
): Size2D {
  if (orientation === 'horizontal') {
    return {
      width: product.size.width,
      height: product.size.height,
    };
  }

  return {
    width: product.size.height,
    height: product.size.width,
  };
}

export function getDefaultPlacement(placement?: ProductPlacement): ProductPlacement {
  return (
    placement ?? {
      orientation: 'horizontal',
      address: null,
      cellPosition: null,
    }
  );
}

export function ensurePlacementOutput(
  products: ProductInput[],
  placements: PlacementOutput
): PlacementOutput {
  const normalized: PlacementOutput = {};

  for (const product of products) {
    normalized[product.id] = getDefaultPlacement(placements[product.id]);
  }

  return normalized;
}

export function getShelfById(
  shelves: ShelfInput[],
  shelfId: ShelfId
): ShelfInput | undefined {
  return shelves.find((shelf) => shelf.id === shelfId);
}

export function isCellAddressValid(
  shelves: ShelfInput[],
  address: CellAddress
): boolean {
  const shelf = getShelfById(shelves, address.shelfId);

  if (!shelf) {
    return false;
  }

  return (
    address.row >= 0 &&
    address.column >= 0 &&
    address.row < shelf.grid.rows &&
    address.column < shelf.grid.columns
  );
}

export function getCellRectInShelf(
  shelf: ShelfInput,
  address: Omit<CellAddress, 'shelfId'>
): Rect2D {
  const gridRect = getShelfGridRect(shelf);
  const innerBorder = getShelfInnerBorderInches(shelf);

  return {
    x:
      gridRect.x +
      address.column * shelf.cellSize.width +
      address.column * innerBorder,
    y:
      gridRect.y +
      address.row * shelf.cellSize.height +
      address.row * innerBorder,
    width: shelf.cellSize.width,
    height: shelf.cellSize.height,
  };
}

export function getCellRectInWorkspace(
  shelf: ShelfInput,
  address: Omit<CellAddress, 'shelfId'>
): Rect2D {
  const shelfRect = getShelfRect(shelf);
  const cellRect = getCellRectInShelf(shelf, address);

  return {
    x: shelfRect.x + cellRect.x,
    y: shelfRect.y + cellRect.y,
    width: cellRect.width,
    height: cellRect.height,
  };
}

export function getPlacedProductRectInCell(
  product: ProductInput,
  placement: ProductPlacement
): Rect2D | null {
  if (!placement.address || !placement.cellPosition) {
    return null;
  }

  const size = getEffectiveProductSize(product, placement.orientation);

  return {
    x: placement.cellPosition.x,
    y: placement.cellPosition.y,
    width: size.width,
    height: size.height,
  };
}

function getCellProductIds(
  placements: PlacementOutput,
  address: CellAddress
): ProductId[] {
  return Object.entries(placements)
    .filter(([, placement]) => {
      if (!placement.address) {
        return false;
      }

      return (
        placement.address.shelfId === address.shelfId &&
        placement.address.row === address.row &&
        placement.address.column === address.column
      );
    })
    .map(([productId]) => productId);
}

export function getExistingRectsForCell(
  products: ProductInput[],
  placements: PlacementOutput,
  address: CellAddress,
  ignoreProductId?: ProductId
): Array<{ productId: ProductId; rect: Rect2D }> {
  const productMap = new Map(products.map((product) => [product.id, product]));
  const productIds = getCellProductIds(placements, address);

  return productIds
    .filter((productId) => productId !== ignoreProductId)
    .flatMap((productId) => {
      const product = productMap.get(productId);
      const placement = placements[productId];

      if (!product || !placement) {
        return [];
      }

      const rect = getPlacedProductRectInCell(product, placement);

      return rect ? [{ productId, rect }] : [];
    });
}

export function snapPointWithinCell(
  rawPoint: Point2D,
  productSize: Size2D,
  cellSize: Size2D,
  existingRects: Rect2D[],
  thresholdInches: number
): Point2D {
  const maxX = Math.max(0, cellSize.width - productSize.width);
  const maxY = Math.max(0, cellSize.height - productSize.height);

  const basePoint = {
    x: clamp(rawPoint.x, 0, maxX),
    y: clamp(rawPoint.y, 0, maxY),
  };

  const xCandidates = [0, maxX];

  for (const rect of existingRects) {
    xCandidates.push(rect.x - productSize.width);
    xCandidates.push(rect.x + rect.width);
  }

  const snappedX = xCandidates.reduce((bestValue, candidate) => {
    if (candidate < 0 || candidate > maxX) {
      return bestValue;
    }

    const currentDistance = Math.abs(bestValue - basePoint.x);
    const candidateDistance = Math.abs(candidate - basePoint.x);

    if (candidateDistance <= thresholdInches && candidateDistance < currentDistance) {
      return candidate;
    }

    return bestValue;
  }, basePoint.x);
  const roundedX = roundInches(snappedX);
  const gravityY = findLowestLegalY(roundedX, productSize, cellSize, existingRects);

  return {
    x: roundedX,
    y: gravityY === null ? roundInches(basePoint.y) : roundInches(gravityY),
  };
}

function findLowestLegalY(
  x: number,
  productSize: Size2D,
  cellSize: Size2D,
  existingRects: Rect2D[]
): number | null {
  const maxY = Math.max(0, cellSize.height - productSize.height);
  let candidateY = 0;

  while (candidateY <= maxY) {
    const candidateRect: Rect2D = {
      x,
      y: candidateY,
      width: productSize.width,
      height: productSize.height,
    };
    const overlappingRects = existingRects.filter((rect) => rectsOverlap(candidateRect, rect));

    if (overlappingRects.length === 0) {
      return candidateY;
    }

    // Raise the box above whichever blockers intersect its current resting span.
    candidateY = Math.max(...overlappingRects.map((rect) => rect.y + rect.height));
  }

  return null;
}

export function validatePlacement(
  product: ProductInput,
  orientation: Orientation,
  cellSize: Size2D,
  cellPosition: Point2D,
  existingRects: Rect2D[]
): string[] {
  const effectiveSize = getEffectiveProductSize(product, orientation);
  const candidateRect: Rect2D = {
    x: cellPosition.x,
    y: cellPosition.y,
    width: effectiveSize.width,
    height: effectiveSize.height,
  };

  const issues: string[] = [];

  if (candidateRect.x < 0 || candidateRect.y < 0) {
    issues.push('Position cannot be negative.');
  }

  if (candidateRect.x + candidateRect.width > cellSize.width) {
    issues.push('Box exceeds the cell width.');
  }

  if (candidateRect.y + candidateRect.height > cellSize.height) {
    issues.push('Box exceeds the cell height.');
  }

  if (existingRects.some((rect) => rectsOverlap(candidateRect, rect))) {
    issues.push('Box overlaps another product.');
  }

  return issues;
}

export function getPlacementIssues(
  shelves: ShelfInput[],
  products: ProductInput[],
  placements: PlacementOutput
): PlacementIssue[] {
  const productMap = new Map(products.map((product) => [product.id, product]));
  const issues: PlacementIssue[] = [];

  for (const [productId, placement] of Object.entries(placements)) {
    if (!placement.address || !placement.cellPosition) {
      continue;
    }

    const product = productMap.get(productId);
    const shelf = getShelfById(shelves, placement.address.shelfId);

    if (!product || !shelf) {
      issues.push({
        productId,
        reason: 'Placement references a missing product or shelf.',
      });
      continue;
    }

    if (!isCellAddressValid(shelves, placement.address)) {
      issues.push({
        productId,
        reason: 'Placement references an invalid cell.',
      });
      continue;
    }

    const existingRects = getExistingRectsForCell(
      products,
      placements,
      placement.address,
      productId
    ).map(({ rect }) => rect);
    const validationIssues = validatePlacement(
      product,
      placement.orientation,
      shelf.cellSize,
      placement.cellPosition,
      existingRects
    );

    for (const reason of validationIssues) {
      issues.push({ productId, reason });
    }
  }

  return issues;
}

export function getInvalidPlacementProductIds(
  shelves: ShelfInput[],
  products: ProductInput[],
  placements: PlacementOutput
): Set<ProductId> {
  return new Set(getPlacementIssues(shelves, products, placements).map((issue) => issue.productId));
}

export function moveProductToInventory(
  placements: PlacementOutput,
  productId: ProductId
): PlacementOutput {
  return {
    ...placements,
    [productId]: {
      ...getDefaultPlacement(placements[productId]),
      address: null,
      cellPosition: null,
    },
  };
}

export function placeProduct(
  placements: PlacementOutput,
  productId: ProductId,
  nextPlacement: ProductPlacement
): PlacementOutput {
  return {
    ...placements,
    [productId]: nextPlacement,
  };
}

export function reconcilePlacementOutput(params: {
  products: ProductInput[];
  shelves: ShelfInput[];
  placements: PlacementOutput;
  previousProducts?: ProductInput[];
}): PlacementOutput {
  const { products, shelves, placements, previousProducts = [] } = params;
  const normalized = ensurePlacementOutput(products, placements);
  const previousProductMap = new Map(previousProducts.map((product) => [product.id, product]));
  let nextPlacements = normalized;

  for (const product of products) {
    const placement = normalized[product.id];

    if (!placement.address || !placement.cellPosition) {
      continue;
    }

    if (!isCellAddressValid(shelves, placement.address)) {
      nextPlacements = moveProductToInventory(nextPlacements, product.id);
      continue;
    }

    const shelf = getShelfById(shelves, placement.address.shelfId);

    if (!shelf) {
      nextPlacements = moveProductToInventory(nextPlacements, product.id);
      continue;
    }

    const previousProduct = previousProductMap.get(product.id);
    const productChangedSize =
      previousProduct &&
      (previousProduct.size.width !== product.size.width ||
        previousProduct.size.height !== product.size.height);

    if (!productChangedSize) {
      continue;
    }

    const existingRects = getExistingRectsForCell(
      products,
      nextPlacements,
      placement.address,
      product.id
    ).map(({ rect }) => rect);
    const issues = validatePlacement(
      product,
      placement.orientation,
      shelf.cellSize,
      placement.cellPosition,
      existingRects
    );

    if (issues.length > 0) {
      nextPlacements = moveProductToInventory(nextPlacements, product.id);
    }
  }

  return nextPlacements;
}
