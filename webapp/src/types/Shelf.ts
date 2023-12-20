export type ShelfId = string;

export interface Shelf {
  id: ShelfId;
  name?: string;
  width?: number; //inches
  height?: number; //inches
  rows?: number;
  columns?: number;
}

export interface Cube {
  id: string; // `${shelf.id}.${row.id}.${column.id}`
}
