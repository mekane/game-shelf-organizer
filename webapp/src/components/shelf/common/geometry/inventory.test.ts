import type { PlacementOutput, ProductInput, ShelfInput } from '../types';
import {
  ensurePlacementOutput,
  getCellRectInShelf,
  getCellRectInWorkspace,
  getEffectiveProductSize,
  getInvalidPlacementProductIds,
  reconcilePlacementOutput,
  snapPointWithinCell,
  validatePlacement,
} from './inventory';

const shelf: ShelfInput = {
  id: 1,
  label: 'Shelf 1',
  position: { x: 0, y: 0 },
  grid: { rows: 1, columns: 1 },
  cellSize: { width: 12, height: 12 },
};

const products: ProductInput[] = [
  {
    id: 'a',
    label: 'Alpha',
    size: { width: 4, height: 6 },
    categoryId: 1,
  },
  {
    id: 'b',
    label: 'Beta',
    size: { width: 4, height: 4 },
    categoryId: 2,
  },
];

describe('inventory geometry', () => {
  it('swaps width and height for vertical orientation', () => {
    expect(getEffectiveProductSize(products[0], 'vertical')).toEqual({
      width: 6,
      height: 4,
    });
  });

  it('normalizes placements for every product', () => {
    expect(ensurePlacementOutput(products, {})).toEqual({
      a: {
        orientation: 'horizontal',
        address: null,
        cellPosition: null,
      },
      b: {
        orientation: 'horizontal',
        address: null,
        cellPosition: null,
      },
    });
  });

  it('offsets cell rectangles by the fixed shelf borders', () => {
    expect(getCellRectInShelf(shelf, { row: 0, column: 0 })).toEqual({
      x: 1.5,
      y: 1.5,
      width: 12,
      height: 12,
    });
    expect(
      getCellRectInWorkspace(
        {
          ...shelf,
          position: { x: 10, y: 5 },
          grid: { rows: 2, columns: 2 },
        },
        { row: 1, column: 1 }
      )
    ).toEqual({
      x: 24.25,
      y: 19.25,
      width: 12,
      height: 12,
    });
  });

  it('allows edge-touching placements inside a cell', () => {
    expect(
      validatePlacement(
        products[1],
        'horizontal',
        shelf.cellSize,
        { x: 4, y: 0 },
        [{ x: 0, y: 0, width: 4, height: 4 }]
      )
    ).toEqual([]);
  });

  it('rejects overlapping placements inside a cell', () => {
    expect(
      validatePlacement(
        products[1],
        'horizontal',
        shelf.cellSize,
        { x: 3, y: 0 },
        [{ x: 0, y: 0, width: 4, height: 4 }]
      )
    ).toContain('Box overlaps another product.');
  });

  it('snaps products to other product edges inside a cell', () => {
    expect(
      snapPointWithinCell(
        { x: 4.4, y: 0.2 },
        { width: 4, height: 4 },
        shelf.cellSize,
        [{ x: 0, y: 0, width: 4, height: 4 }],
        1
      )
    ).toEqual({ x: 4, y: 0 });
  });

  it('applies gravity so a dragged product settles at the lowest legal y for its x position', () => {
    expect(
      snapPointWithinCell(
        { x: 1.2, y: 4.8 },
        { width: 4, height: 6 },
        shelf.cellSize,
        [{ x: 0, y: 0, width: 5, height: 5 }],
        1
      )
    ).toEqual({ x: 1, y: 5 });
  });

  it('reports invalid product placements', () => {
    const placements: PlacementOutput = {
      a: {
        orientation: 'horizontal',
        address: { shelfId: 1, row: 0, column: 0 },
        cellPosition: { x: 0, y: 0 },
      },
      b: {
        orientation: 'horizontal',
        address: { shelfId: 1, row: 0, column: 0 },
        cellPosition: { x: 2, y: 0 },
      },
    };

    expect(getInvalidPlacementProductIds([shelf], products, placements)).toEqual(
      new Set(['a', 'b'])
    );
  });

  it('returns resized products to inventory when they no longer fit', () => {
    const previousProducts = products;
    const resizedProducts: ProductInput[] = [
      {
        ...products[0],
        size: { width: 20, height: 6 },
      },
      products[1],
    ];
    const placements: PlacementOutput = {
      a: {
        orientation: 'horizontal',
        address: { shelfId: 1, row: 0, column: 0 },
        cellPosition: { x: 0, y: 0 },
      },
      b: {
        orientation: 'horizontal',
        address: null,
        cellPosition: null,
      },
    };

    expect(
      reconcilePlacementOutput({
        products: resizedProducts,
        shelves: [shelf],
        placements,
        previousProducts,
      })
    ).toEqual({
      a: {
        orientation: 'horizontal',
        address: null,
        cellPosition: null,
      },
      b: {
        orientation: 'horizontal',
        address: null,
        cellPosition: null,
      },
    });
  });
});
