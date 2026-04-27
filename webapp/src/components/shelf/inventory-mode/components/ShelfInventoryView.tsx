import { useDroppable } from '@dnd-kit/core';
import { Box } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { ProductVisual } from '../../common/components';
import {
  getCellRectInShelf,
  getShelfRect,
  getShelfSize,
  toDomStyleRect,
} from '../../common/geometry';
import { SQUARE_SURFACE_RADIUS } from '../../common/styles/surfaces';
import type {
  CellAddress,
  Orientation,
  PlacementOutput,
  Point2D,
  ProductInput,
  ShelfId,
  ShelfInput,
} from '../../common/types';
import { PlacedProductBox } from './PlacedProductBox';
import type { MouseEvent as ReactMouseEvent, ReactNode } from 'react';
const SHELF_FRAME_BACKGROUND =
  'linear-gradient(145deg, rgba(126, 95, 63, 0.98), rgba(88, 61, 37, 0.98))';

interface PlacementPreviewState {
  productId: string;
  address: CellAddress | null;
  cellPosition: Point2D | null;
  orientation: Orientation;
  valid: boolean;
  overInventory: boolean;
}

interface ShelfInventoryViewProps {
  shelves: ShelfInput[];
  products: ProductInput[];
  placements: PlacementOutput;
  categoryColorByProductId: Record<string, string | undefined>;
  selectedProductId: string | null;
  activeProductId: string | null;
  invalidProductIds: Set<string>;
  preview: PlacementPreviewState | null;
  scale: number;
  onSelectProduct: (productId: string) => void;
  onClearSelection: () => void;
}

export function ShelfInventoryView({
  shelves,
  products,
  placements,
  categoryColorByProductId,
  selectedProductId,
  activeProductId,
  invalidProductIds,
  preview,
  scale,
  onSelectProduct,
  onClearSelection,
}: ShelfInventoryViewProps) {
  const theme = useTheme();
  const workspaceBounds = getInventoryBounds(shelves);
  const productMap = new Map(products.map((product) => [product.id, product]));
  const cellBackground = theme.palette.background.paper;
  const cellOutline = `inset 0 0 0 1px ${theme.palette.divider}`;
  const previewCellBackground = alpha(
    theme.palette.warning.main,
    theme.palette.mode === 'dark' ? 0.24 : 0.18
  );
  const hoverCellBackground = alpha(
    theme.palette.success.main,
    theme.palette.mode === 'dark' ? 0.22 : 0.16
  );
  const workspaceStyle = {
    position: 'relative',
    width: workspaceBounds.width * scale,
    height: workspaceBounds.height * scale + 2,
    minWidth: '100%',
    minHeight: 320,
    borderRadius: 5,
    backgroundColor: theme.palette.background.default,
  } as const;

  function handleWorkspaceMouseDown(event: ReactMouseEvent<HTMLDivElement>) {
    const target = event.target;

    if (
      target instanceof HTMLElement &&
      target.closest('[data-testid^="placed-product-"]')
    ) {
      return;
    }

    onClearSelection();
  }

  return (
    <Box
      sx={{
        overflow: 'auto',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        p: 1.5,
      }}
    >
      <div
        data-testid="inventory-workspace"
        onMouseDown={handleWorkspaceMouseDown}
        style={workspaceStyle}
      >
        {shelves.map((shelf) => {
          const shelfSize = getShelfSize(shelf);
          const domRect = toDomStyleRect(
            getShelfRect(shelf),
            workspaceBounds.height,
            scale
          );

          return (
            <div
              key={shelf.id}
              data-testid={`inventory-shelf-${shelf.id}`}
              style={{
                position: 'absolute',
                left: domRect.x,
                top: domRect.y,
                width: domRect.width,
                height: domRect.height,
                borderRadius: SQUARE_SURFACE_RADIUS,
                overflow: 'hidden',
                boxShadow: '0 18px 28px rgba(84, 61, 40, 0.12)',
                background: SHELF_FRAME_BACKGROUND,
              }}
            >
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                {Array.from({ length: shelf.grid.rows }).map((_, rowIndex) =>
                  Array.from({ length: shelf.grid.columns }).map((__, columnIndex) => {
                    const row = rowIndex;
                    const column = columnIndex;
                    const address: CellAddress = {
                      shelfId: shelf.id,
                      row,
                      column,
                    };

                    const cellRect = getCellRectInShelf(shelf, { row, column });
                    const cellDomRect = toDomStyleRect(
                      cellRect,
                      shelfSize.height,
                      scale
                    );

                    const placedProducts = products.filter((product) => {
                      const placement = placements[product.id];

                      return (
                        placement?.address?.shelfId === address.shelfId &&
                        placement.address.row === address.row &&
                        placement.address.column === address.column &&
                        placement.cellPosition
                      );
                    });

                    return (
                      <DroppableCell
                        key={`${shelf.id}-${row}-${column}`}
                        shelf={shelf}
                        address={address}
                        domRect={{
                          left: cellDomRect.x,
                          top: cellDomRect.y,
                          width: cellDomRect.width,
                          height: cellDomRect.height,
                        }}
                        preview={preview}
                        activeProductId={activeProductId}
                        cellBackground={cellBackground}
                        cellOutline={cellOutline}
                        hoverCellBackground={hoverCellBackground}
                        previewCellBackground={previewCellBackground}
                      >
                        {placedProducts.map((product) => {
                          const placement = placements[product.id];

                          if (!placement?.cellPosition) {
                            return null;
                          }

                          return (
                            <PlacedProductBox
                              key={product.id}
                              product={product}
                              orientation={placement.orientation}
                              cellPosition={placement.cellPosition}
                              scale={scale}
                              categoryColor={categoryColorByProductId[product.id]}
                              selected={selectedProductId === product.id}
                              invalid={invalidProductIds.has(product.id)}
                              active={activeProductId === product.id}
                              onSelect={onSelectProduct}
                            />
                          );
                        })}

                        {preview &&
                        preview.valid &&
                        preview.address &&
                        preview.cellPosition &&
                        preview.address.shelfId === address.shelfId &&
                        preview.address.row === address.row &&
                        preview.address.column === address.column ? (
                          <div
                            data-testid={`preview-product-${preview.productId}`}
                            style={{
                              position: 'absolute',
                              left: preview.cellPosition.x * scale,
                              bottom: preview.cellPosition.y * scale,
                              pointerEvents: 'none',
                            }}
                          >
                            <ProductVisual
                              product={productMap.get(preview.productId)!}
                              orientation={preview.orientation}
                              scale={scale}
                              categoryColor={categoryColorByProductId[preview.productId]}
                              selected={false}
                              invalid={false}
                              dense
                              enforceMinimumFootprint={false}
                              metadataTooltipDisabled
                            />
                          </div>
                        ) : null}
                      </DroppableCell>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}

        {shelves.length === 0 ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <div
              style={{
                color: theme.palette.text.secondary,
                fontSize: 16,
                lineHeight: 1.5,
              }}
            >
              Add shelves in layout mode to begin placing inventory.
            </div>
          </div>
        ) : null}
      </div>
    </Box>
  );
}

interface DroppableCellProps {
  shelf: ShelfInput;
  address: CellAddress;
  domRect: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  preview: PlacementPreviewState | null;
  activeProductId: string | null;
  cellBackground: string;
  cellOutline: string;
  hoverCellBackground: string;
  previewCellBackground: string;
  children: ReactNode;
}

function DroppableCell({
  shelf,
  address,
  domRect,
  preview,
  activeProductId,
  cellBackground,
  cellOutline,
  hoverCellBackground,
  previewCellBackground,
  children,
}: DroppableCellProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `cell-${address.shelfId}-${address.row}-${address.column}`,
    data: {
      type: 'cell',
      address,
      cellSize: shelf.cellSize,
    },
  });
  const isPreviewTarget =
    preview?.address?.shelfId === address.shelfId &&
    preview.address.row === address.row &&
    preview.address.column === address.column;

  return (
    <div
      ref={setNodeRef}
      data-testid={`cell-${address.shelfId}-${address.row}-${address.column}`}
      style={{
        position: 'absolute',
        left: domRect.left,
        top: domRect.top,
        width: domRect.width,
        height: domRect.height,
        background:
          preview && isPreviewTarget && preview.valid
            ? previewCellBackground
            : isOver && activeProductId
              ? hoverCellBackground
              : cellBackground,
        boxShadow: cellOutline,
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
}

function getInventoryBounds(shelves: ShelfInput[]): { width: number; height: number } {
  if (shelves.length === 0) {
    return { width: 48, height: 32 };
  }

  const shelfRects = shelves.map((shelf) => getShelfRect(shelf));

  return {
    width: Math.max(...shelfRects.map((rect) => rect.x + rect.width), 48),
    height: Math.max(...shelfRects.map((rect) => rect.y + rect.height), 32),
  };
}
