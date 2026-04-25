import {
  DndContext,
  DragOverlay,
  MouseSensor,
  rectIntersection,
  type Active,
  type DragEndEvent,
  type DragMoveEvent,
  type DragOverEvent,
  type DragStartEvent,
  type Over,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Alert, Box, Stack } from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ProductVisual, ScreenLayout } from '../common/components';
import { useModifierKey, usePreviousValue } from '../common/hooks';
import {
  CELL_SNAP_THRESHOLD_PX,
  WORKSPACE_SCALE,
  ensurePlacementOutput,
  flipOrientation,
  getDefaultPlacement,
  getEffectiveProductSize,
  getExistingRectsForCell,
  getInvalidPlacementProductIds,
  placeProduct,
  reconcilePlacementOutput,
  snapPointWithinCell,
  validatePlacement,
  moveProductToInventory,
} from '../common/geometry';
import type {
  Category,
  CellAddress,
  InventoryModeProps,
  Orientation,
  PlacementOutput,
  Point2D,
  ProductId,
  ProductInput,
  ProductPlacement,
  ShelfInput,
} from '../common/types';
import { InventoryPanel } from './components/InventoryPanel';
import { InventorySidebar } from './components/InventorySidebar';
import { ShelfInventoryView } from './components/ShelfInventoryView';

interface PlacementPreviewState {
  productId: ProductId;
  address: CellAddress | null;
  cellPosition: Point2D | null;
  orientation: Orientation;
  valid: boolean;
  overInventory: boolean;
}

export function InventoryModeScreen({
  name,
  shelves,
  categories,
  products,
  placements,
  onPlacementsChange,
}: InventoryModeProps) {
  const sensors = useSensors(useSensor(MouseSensor, { activationConstraint: { distance: 4 } }));
  const isShiftPressed = useModifierKey('Shift');
  const previousProducts = usePreviousValue(products);
  const [selectedProductId, setSelectedProductId] = useState<ProductId | null>(
    products[0]?.id ?? null
  );
  const [activeProductId, setActiveProductId] = useState<ProductId | null>(null);
  const [preview, setPreview] = useState<PlacementPreviewState | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const previewRef = useRef<PlacementPreviewState | null>(null);

  useEffect(() => {
    setSelectedProductId((current) => {
      if (current && products.some((product) => product.id === current)) {
        return current;
      }

      return products[0]?.id ?? null;
    });
  }, [products]);

  const normalizedPlacements = useMemo(
    () => ensurePlacementOutput(products, placements),
    [placements, products]
  );
  const productById = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products]
  );
  const orientationByProductId = useMemo(
    () =>
      products.reduce<Record<string, Orientation>>((accumulator, product) => {
        accumulator[product.id] = normalizedPlacements[product.id]?.orientation ?? 'horizontal';
        return accumulator;
      }, {}),
    [normalizedPlacements, products]
  );
  const categoryColorByProductId = useMemo(
    () =>
      products.reduce<Record<string, string | undefined>>((accumulator, product) => {
        accumulator[product.id] = categories[product.categoryId]?.color;
        return accumulator;
      }, {}),
    [categories, products]
  );
  const orderedCategories = useMemo(
    () => Object.values(categories).sort((left: Category, right: Category) => left.id - right.id),
    [categories]
  );
  const invalidProductIds = useMemo(
    () => getInvalidPlacementProductIds(shelves, products, normalizedPlacements),
    [normalizedPlacements, products, shelves]
  );
  const selectedProduct = selectedProductId ? productById.get(selectedProductId) : undefined;
  const selectedPlacement = selectedProductId
    ? normalizedPlacements[selectedProductId]
    : undefined;
  const unplacedProducts = products.filter(
    (product) => !normalizedPlacements[product.id]?.address
  );

  useEffect(() => {
    const reconciled = reconcilePlacementOutput({
      products,
      shelves,
      placements: normalizedPlacements,
      previousProducts,
    });

    if (JSON.stringify(reconciled) !== JSON.stringify(normalizedPlacements)) {
      onPlacementsChange(reconciled, {
        reason: 'sync-products',
      });
    }
  }, [normalizedPlacements, onPlacementsChange, previousProducts, products, shelves]);

  function getProduct(productId: ProductId): ProductInput | undefined {
    return productById.get(productId);
  }

  function getDragOrientation(productId: ProductId): Orientation {
    const baseOrientation = normalizedPlacements[productId]?.orientation ?? 'horizontal';
    return isShiftPressed ? flipOrientation(baseOrientation) : baseOrientation;
  }

  function clearPreviewState() {
    previewRef.current = null;
    setPreview(null);
    setActiveProductId(null);
  }

  function setPreviewState(nextPreview: PlacementPreviewState | null) {
    previewRef.current = nextPreview;
    setPreview(nextPreview);
  }

  function handleDragStart(event: DragStartEvent) {
    const productId = event.active.data.current?.productId as ProductId | undefined;

    if (!productId) {
      return;
    }

    setSelectedProductId(productId);
    setActiveProductId(productId);
    setWarningMessage(null);
    setPreviewState({
      productId,
      address: normalizedPlacements[productId]?.address ?? null,
      cellPosition: normalizedPlacements[productId]?.cellPosition ?? null,
      orientation: getDragOrientation(productId),
      valid: false,
      overInventory: false,
    });
  }

  function updatePreviewFromDrag(active: Active, over: Over | null, delta: { x: number; y: number }) {
    const productId = active.data.current?.productId as ProductId | undefined;

    if (!productId) {
      return;
    }

    const product = getProduct(productId);

    if (!product) {
      return;
    }

    const orientation = getDragOrientation(productId);

    if (!over) {
      setPreviewState({
        productId,
        address: null,
        cellPosition: null,
        orientation,
        valid: false,
        overInventory: false,
      });
      return;
    }

    if (over.data.current?.type === 'inventory-dropzone') {
      setPreviewState({
        productId,
        address: null,
        cellPosition: null,
        orientation,
        valid: true,
        overInventory: true,
      });
      return;
    }

    if (over.data.current?.type !== 'cell') {
      return;
    }

    const address = over.data.current.address as CellAddress;
    const shelf = shelves.find((entry) => entry.id === address.shelfId);
    const initialRect = active.rect.current.initial;

    if (!shelf || !initialRect) {
      return;
    }

    const translated = active.rect.current.translated ?? {
      left: initialRect.left + delta.x,
      top: initialRect.top + delta.y,
      width: initialRect.width,
      height: initialRect.height,
    };
    const size = getEffectiveProductSize(product, orientation);
    const rawPoint = {
      x: (translated.left - over.rect.left) / WORKSPACE_SCALE,
      y: (over.rect.top + over.rect.height - translated.top) / WORKSPACE_SCALE - size.height,
    };
    const existingRects = getExistingRectsForCell(
      products,
      normalizedPlacements,
      address,
      productId
    ).map(({ rect }) => rect);
    const snappedPoint = snapPointWithinCell(
      rawPoint,
      size,
      shelf.cellSize,
      existingRects,
      CELL_SNAP_THRESHOLD_PX / WORKSPACE_SCALE
    );
    const issues = validatePlacement(
      product,
      orientation,
      shelf.cellSize,
      snappedPoint,
      existingRects
    );

    setPreviewState({
      productId,
      address,
      cellPosition: snappedPoint,
      orientation,
      valid: issues.length === 0,
      overInventory: false,
    });
  }

  function handleDragMove(event: DragMoveEvent) {
    updatePreviewFromDrag(event.active, event.over, event.delta);
  }

  function handleDragOver(event: DragOverEvent) {
    updatePreviewFromDrag(event.active, event.over, event.delta);
  }

  function handleDragEnd(event: DragEndEvent) {
    const productId = event.active.data.current?.productId as ProductId | undefined;
    const currentPreview = previewRef.current;

    if (!productId) {
      clearPreviewState();
      return;
    }

    if (!currentPreview || !currentPreview.valid) {
      clearPreviewState();
      return;
    }

    if (currentPreview.overInventory) {
      onPlacementsChange(moveProductToInventory(normalizedPlacements, productId), {
        reason: 'return-to-inventory',
        productId,
      });
      clearPreviewState();
      return;
    }

    if (!currentPreview.address || !currentPreview.cellPosition) {
      clearPreviewState();
      return;
    }

    const previousPlacement = normalizedPlacements[productId];
    const reason =
      previousPlacement?.address === null ? 'place-product' : 'move-product';

    onPlacementsChange(
      placeProduct(normalizedPlacements, productId, {
        orientation: currentPreview.orientation,
        address: currentPreview.address,
        cellPosition: currentPreview.cellPosition,
      }),
      {
        reason,
        productId,
      }
    );
    clearPreviewState();
  }

  function handleOrientationChange(nextOrientation: Orientation) {
    if (!selectedProductId || !selectedProduct) {
      return;
    }

    const currentPlacement = normalizedPlacements[selectedProductId] ?? getDefaultPlacement();

    if (currentPlacement.address && currentPlacement.cellPosition) {
      const shelf = shelves.find(
        (entry) => entry.id === currentPlacement.address?.shelfId
      );

      if (!shelf) {
        return;
      }

      const existingRects = getExistingRectsForCell(
        products,
        normalizedPlacements,
        currentPlacement.address,
        selectedProductId
      ).map(({ rect }) => rect);
      const issues = validatePlacement(
        selectedProduct,
        nextOrientation,
        shelf.cellSize,
        currentPlacement.cellPosition,
        existingRects
      );

      if (issues.length > 0) {
        setWarningMessage(issues[0]);
        return;
      }
    }

    setWarningMessage(null);
    onPlacementsChange(
      placeProduct(normalizedPlacements, selectedProductId, {
        ...currentPlacement,
        orientation: nextOrientation,
      }),
      {
        reason: 'rotate-product',
        productId: selectedProductId,
      }
    );
  }

  function handleReturnToInventory() {
    if (!selectedProductId) {
      return;
    }

    setWarningMessage(null);
    onPlacementsChange(moveProductToInventory(normalizedPlacements, selectedProductId), {
      reason: 'return-to-inventory',
      productId: selectedProductId,
    });
  }

  function handleClearSelection() {
    setSelectedProductId(null);
    setWarningMessage(null);
  }

  const selectedInvalid = selectedProductId
    ? invalidProductIds.has(selectedProductId)
    : false;

  return (
    <ScreenLayout
      eyebrow="Inventory Mode"
      title={name}
      subtitle="Drag boxes into shelf cells, snap them against cell or product edges, and persist the committed orientation and coordinates for each placement."
      sidebar={
        <InventorySidebar
          selectedProduct={selectedProduct}
          selectedPlacement={selectedPlacement}
          invalid={selectedInvalid}
          warningMessage={warningMessage}
          onOrientationChange={handleOrientationChange}
          onReturnToInventory={handleReturnToInventory}
        />
      }
    >
      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={clearPreviewState}
      >
        <Stack spacing={2}>
          {invalidProductIds.size > 0 ? (
            <Alert variant="filled" severity="warning">
              Some products no longer fit their current cells. They remain visible in warning
              state until the layout or placements are corrected.
            </Alert>
          ) : null}

          <InventoryPanel
            categories={orderedCategories}
            products={unplacedProducts}
            orientationByProductId={orientationByProductId}
            categoryColorByProductId={categoryColorByProductId}
            selectedProductId={selectedProductId}
            activeProductId={activeProductId}
            invalidProductIds={invalidProductIds}
            scale={WORKSPACE_SCALE}
            onSelectProduct={setSelectedProductId}
          />

          <Box>
            <ShelfInventoryView
              shelves={shelves}
              products={products}
              placements={normalizedPlacements}
              categoryColorByProductId={categoryColorByProductId}
              selectedProductId={selectedProductId}
              activeProductId={activeProductId}
              invalidProductIds={invalidProductIds}
              preview={preview}
              scale={WORKSPACE_SCALE}
              onSelectProduct={setSelectedProductId}
              onClearSelection={handleClearSelection}
            />
          </Box>
        </Stack>

        <DragOverlay>
          {activeProductId ? (
            <div data-testid={`drag-overlay-${activeProductId}`}>
              <ProductVisual
                product={getProduct(activeProductId)!}
                orientation={getDragOrientation(activeProductId)}
                scale={WORKSPACE_SCALE}
                categoryColor={categoryColorByProductId[activeProductId]}
                selected={false}
                invalid={false}
                dense
                enforceMinimumFootprint={false}
                metadataTooltipDisabled
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </ScreenLayout>
  );
}
