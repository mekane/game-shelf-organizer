import type { SxProps, Theme } from '@mui/material/styles';

export type Inches = number;
export type ShelfId = number;
export type ProductId = string;

export type Orientation = 'horizontal' | 'vertical';

export interface Point2D {
  x: Inches;
  y: Inches;
}

export interface Size2D {
  width: Inches;
  height: Inches;
}

export interface Rect2D extends Point2D, Size2D {}

export interface LayoutWorkspaceInput {
  size: Size2D;
  snapIncrement: Inches;
}

export interface ShelfBorders {
  outer: Inches;
  inner: Inches;
}

export interface ShelfInput {
  id: ShelfId;
  label?: string;
  position: Point2D;
  grid: {
    rows: number;
    columns: number;
  };
  cellSize: Size2D;
  borders?: ShelfBorders;
}

export interface ProductInput {
  id: ProductId;
  label: string;
  sku?: string;
  size: Size2D;
  categoryId: number;
}

export interface Category {
  id: number;
  name: string;
  color: string;
}

export type CategoryMap = Record<number, Category>;

export interface CellAddress {
  shelfId: ShelfId;
  row: number;
  column: number;
}

export interface ProductPlacement {
  orientation: Orientation;
  address: CellAddress | null;
  cellPosition: Point2D | null;
}

export type PlacementOutput = Record<ProductId, ProductPlacement>;

export type LayoutChangeReason =
  | 'add-shelf'
  | 'update-layout'
  | 'update-shelf'
  | 'move-shelf'
  | 'remove-shelf';

export interface LayoutChangeMeta {
  reason: LayoutChangeReason;
  name: string;
  size: Size2D;
  shelfId?: ShelfId;
}

export type InventoryChangeReason =
  | 'place-product'
  | 'move-product'
  | 'rotate-product'
  | 'return-to-inventory'
  | 'sync-products';

export interface InventoryChangeMeta {
  reason: InventoryChangeReason;
  productId?: ProductId;
}

export interface InventoryModeCopy {
  holdingAreaTitle?: string;
  holdingAreaDescription?: string;
  productDetailsTitle?: string;
}

export type OnShelvesChange = (
  nextShelves: ShelfInput[],
  meta: LayoutChangeMeta
) => void;

export type OnPlacementsChange = (
  nextPlacements: PlacementOutput,
  meta: InventoryChangeMeta
) => void;

export interface LayoutModeProps {
  name: string;
  sx?: SxProps<Theme>;
  workspace: LayoutWorkspaceInput;
  shelves: ShelfInput[];
  onShelvesChange: OnShelvesChange;
}

export interface InventoryModeProps {
  name: string;
  sx?: SxProps<Theme>;
  copy?: InventoryModeCopy;
  shelves: ShelfInput[];
  categories: CategoryMap;
  products: ProductInput[];
  placements: PlacementOutput;
  onPlacementsChange: OnPlacementsChange;
}

export interface PlacementIssue {
  productId: ProductId;
  reason: string;
}
