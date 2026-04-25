import type { LayoutWorkspaceInput, ShelfInput } from '../types';
import {
  buildDefaultShelf,
  getInvalidShelfIds,
  getShelfGridRect,
  getShelfPositionBounds,
  getShelfSize,
  snapShelfPosition,
} from './layout';

const workspace: LayoutWorkspaceInput = {
  size: {
    width: 60,
    height: 60,
  },
  snapIncrement: 2,
};

function buildShelf(partial: Partial<ShelfInput>): ShelfInput {
  return {
    id: partial.id ?? 1,
    label: partial.label ?? 'Shelf',
    position: partial.position ?? { x: 0, y: 0 },
    grid: partial.grid ?? { rows: 4, columns: 1 },
    cellSize: partial.cellSize ?? { width: 12, height: 12 },
    borders: partial.borders,
  };
}

describe('layout geometry', () => {
  it('derives shelf size from cell size plus the default borders', () => {
    const shelf = buildShelf({
      grid: { rows: 5, columns: 2 },
      cellSize: { width: 8, height: 6 },
    });

    expect(getShelfGridRect(shelf)).toEqual({
      x: 1.5,
      y: 1.5,
      width: 16.75,
      height: 33,
    });
    expect(getShelfSize(shelf)).toEqual({
      width: 19.75,
      height: 36,
    });
  });

  it('derives shelf size from configurable border thicknesses', () => {
    const shelf = buildShelf({
      grid: { rows: 5, columns: 2 },
      cellSize: { width: 8, height: 6 },
      borders: { outer: 2.25, inner: 1.25 },
    });

    expect(getShelfGridRect(shelf)).toEqual({
      x: 2.25,
      y: 2.25,
      width: 17.25,
      height: 35,
    });
    expect(getShelfSize(shelf)).toEqual({
      width: 21.75,
      height: 39.5,
    });
  });

  it('flags overlapping shelves as invalid', () => {
    const invalid = getInvalidShelfIds(
      [
        buildShelf({ id: 1, position: { x: 0, y: 0 } }),
        buildShelf({ id: 2, position: { x: 6, y: 0 } }),
      ],
      workspace
    );

    expect(invalid).toEqual(new Set([1, 2]));
  });

  it('flags out-of-bounds shelves as invalid', () => {
    const invalid = getInvalidShelfIds(
      [buildShelf({ id: 3, position: { x: 50, y: 40 } })],
      workspace
    );

    expect(invalid).toEqual(new Set([3]));
  });

  it('uses shelf-edge snapping over grid snapping when within threshold', () => {
    const shelves = [
      buildShelf({ id: 1, position: { x: 0, y: 0 } }),
      buildShelf({ id: 2, position: { x: 18, y: 0 } }),
    ];
    const snapped = snapShelfPosition(
      { x: 14.4, y: 0.6 },
      shelves[1],
      shelves,
      workspace,
      1
    );

    expect(snapped).toEqual({ x: 15, y: 0 });
  });

  it('keeps a whole-inch shelf-edge snap sticky until the pointer moves clearly away from it', () => {
    const shelves = [
      buildShelf({ id: 1, position: { x: 0, y: 0 } }),
      buildShelf({ id: 2, position: { x: 15, y: 0 } }),
    ];
    const snapped = snapShelfPosition(
      { x: 13.6, y: 0 },
      shelves[1],
      shelves,
      workspace,
      1,
      {
        previousPosition: { x: 15, y: 0 },
        releaseThresholdInches: 2,
      }
    );

    expect(snapped).toEqual({ x: 15, y: 0 });
  });

  it('releases a sticky shelf-edge snap once the pointer moves far enough away', () => {
    const shelves = [
      buildShelf({ id: 1, position: { x: 0, y: 0 } }),
      buildShelf({ id: 2, position: { x: 15, y: 0 } }),
    ];
    const snapped = snapShelfPosition(
      { x: 12.8, y: 0 },
      shelves[1],
      shelves,
      workspace,
      1,
      {
        previousPosition: { x: 15, y: 0 },
        releaseThresholdInches: 2,
      }
    );

    expect(snapped).toEqual({ x: 12, y: 0 });
  });

  it('clamps shelf positions to the highest whole-inch value that still fits', () => {
    const shelf = buildShelf({});

    expect(getShelfPositionBounds(shelf, workspace)).toEqual({
      minX: 0,
      maxX: 45,
      minY: 0,
      maxY: 6,
    });
  });

  it('builds the documented default shelf', () => {
    expect(buildDefaultShelf([buildShelf({ id: 5 })])).toEqual({
      id: 6,
      label: 'Shelf 6',
      position: { x: 0, y: 0 },
      grid: { rows: 4, columns: 1 },
      cellSize: { width: 13, height: 13 },
      borders: { outer: 1.5, inner: 0.75 },
    });
  });
});
