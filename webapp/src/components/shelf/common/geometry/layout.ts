import type { LayoutWorkspaceInput, Point2D, Rect2D, ShelfId, ShelfInput, Size2D } from '../types';
import { clamp, rectsOverlap, roundInches } from './rect';
import {
  DEFAULT_SHELF_INNER_BORDER_INCHES,
  DEFAULT_SHELF_OUTER_BORDER_INCHES,
} from './constants';

function getDividerSpan(count: number, dividerThickness: number): number {
  return Math.max(0, count - 1) * dividerThickness;
}

export function getShelfOuterBorderInches(shelf: ShelfInput): number {
  return shelf.borders?.outer ?? DEFAULT_SHELF_OUTER_BORDER_INCHES;
}

export function getShelfInnerBorderInches(shelf: ShelfInput): number {
  return shelf.borders?.inner ?? DEFAULT_SHELF_INNER_BORDER_INCHES;
}

export function getShelfGridSize(shelf: ShelfInput): Size2D {
  const innerBorder = getShelfInnerBorderInches(shelf);

  return {
    width:
      shelf.grid.columns * shelf.cellSize.width +
      getDividerSpan(shelf.grid.columns, innerBorder),
    height:
      shelf.grid.rows * shelf.cellSize.height +
      getDividerSpan(shelf.grid.rows, innerBorder),
  };
}

export function getShelfGridRect(shelf: ShelfInput): Rect2D {
  const size = getShelfGridSize(shelf);
  const outerBorder = getShelfOuterBorderInches(shelf);

  return {
    x: outerBorder,
    y: outerBorder,
    width: size.width,
    height: size.height,
  };
}

export function getShelfSize(shelf: ShelfInput): Size2D {
  const gridSize = getShelfGridSize(shelf);
  const outerBorder = getShelfOuterBorderInches(shelf);

  return {
    width: gridSize.width + outerBorder * 2,
    height: gridSize.height + outerBorder * 2,
  };
}

export function getShelfRect(shelf: ShelfInput): Rect2D {
  const size = getShelfSize(shelf);

  return {
    x: shelf.position.x,
    y: shelf.position.y,
    width: size.width,
    height: size.height,
  };
}

export function isShelfWithinWorkspace(
  shelf: ShelfInput,
  workspace: LayoutWorkspaceInput
): boolean {
  const rect = getShelfRect(shelf);

  return (
    rect.x >= 0 &&
    rect.y >= 0 &&
    rect.x + rect.width <= workspace.size.width &&
    rect.y + rect.height <= workspace.size.height
  );
}

export function getOverlappingShelfIds(shelves: ShelfInput[]): Set<ShelfId> {
  const overlaps = new Set<ShelfId>();

  for (let index = 0; index < shelves.length; index += 1) {
    for (let innerIndex = index + 1; innerIndex < shelves.length; innerIndex += 1) {
      if (rectsOverlap(getShelfRect(shelves[index]), getShelfRect(shelves[innerIndex]))) {
        overlaps.add(shelves[index].id);
        overlaps.add(shelves[innerIndex].id);
      }
    }
  }

  return overlaps;
}

export function getInvalidShelfIds(
  shelves: ShelfInput[],
  workspace: LayoutWorkspaceInput
): Set<ShelfId> {
  const invalid = getOverlappingShelfIds(shelves);

  for (const shelf of shelves) {
    if (!isShelfWithinWorkspace(shelf, workspace)) {
      invalid.add(shelf.id);
    }
  }

  return invalid;
}

export function getShelfPositionBounds(
  shelf: ShelfInput,
  workspace: LayoutWorkspaceInput
): { minX: number; maxX: number; minY: number; maxY: number } {
  const size = getShelfSize(shelf);

  return {
    minX: 0,
    maxX: Math.max(0, Math.floor(workspace.size.width - size.width)),
    minY: 0,
    maxY: Math.max(0, Math.floor(workspace.size.height - size.height)),
  };
}

export function snapValueToIncrement(value: number, increment: number): number {
  if (increment <= 0) {
    return roundInches(value);
  }

  return roundInches(Math.round(value / increment) * increment);
}

function collectShelfSnapCandidates(
  currentShelfId: ShelfId,
  shelves: ShelfInput[],
  candidateSize: Size2D
): { xValues: number[]; yValues: number[] } {
  const xValues: number[] = [];
  const yValues: number[] = [0];

  for (const shelf of shelves) {
    if (shelf.id === currentShelfId) {
      continue;
    }

    const rect = getShelfRect(shelf);

    xValues.push(roundInches(rect.x));
    xValues.push(Math.ceil(rect.x + rect.width));
    xValues.push(Math.floor(rect.x - candidateSize.width));
    xValues.push(roundInches(rect.x + rect.width - candidateSize.width));

    yValues.push(roundInches(rect.y));
    yValues.push(Math.ceil(rect.y + rect.height));
    yValues.push(Math.floor(rect.y - candidateSize.height));
    yValues.push(roundInches(rect.y + rect.height - candidateSize.height));
  }

  return { xValues, yValues };
}

function findClosestCandidate(
  value: number,
  candidates: number[],
): { value: number; distance: number } | null {
  let closest: { value: number; distance: number } | null = null;

  for (const candidate of candidates) {
    const distance = Math.abs(candidate - value);

    if (!closest || distance < closest.distance) {
      closest = {
        value: candidate,
        distance,
      };
    }
  }

  return closest;
}

function matchesCandidateValue(value: number, candidates: number[]): boolean {
  return candidates.some((candidate) => Math.abs(candidate - value) < 0.001);
}

function snapToCandidates(
  rawValue: number,
  gridSnappedValue: number,
  candidates: number[],
  thresholdInches: number,
  previousValue?: number,
  releaseThresholdInches = thresholdInches
): number {
  const closestCandidate = findClosestCandidate(rawValue, candidates);

  if (closestCandidate && closestCandidate.distance <= thresholdInches) {
    return closestCandidate.value;
  }

  if (
    previousValue !== undefined &&
    matchesCandidateValue(previousValue, candidates) &&
    Math.abs(previousValue - rawValue) <= releaseThresholdInches
  ) {
    return previousValue;
  }

  return gridSnappedValue;
}

interface SnapShelfPositionOptions {
  previousPosition?: Point2D | null;
  releaseThresholdInches?: number;
}

export function snapShelfPosition(
  rawPosition: Point2D,
  shelf: ShelfInput,
  shelves: ShelfInput[],
  workspace: LayoutWorkspaceInput,
  thresholdInches: number,
  options: SnapShelfPositionOptions = {}
): Point2D {
  const { previousPosition, releaseThresholdInches = thresholdInches } = options;
  const size = getShelfSize(shelf);
  const bounds = getShelfPositionBounds(shelf, workspace);
  const gridSnapped = {
    x: snapValueToIncrement(rawPosition.x, workspace.snapIncrement),
    y: snapValueToIncrement(rawPosition.y, workspace.snapIncrement),
  };
  const candidates = collectShelfSnapCandidates(shelf.id, shelves, size);
  const x = snapToCandidates(
    rawPosition.x,
    gridSnapped.x,
    candidates.xValues,
    thresholdInches,
    previousPosition?.x,
    releaseThresholdInches
  );
  const y = snapToCandidates(
    rawPosition.y,
    gridSnapped.y,
    candidates.yValues,
    thresholdInches,
    previousPosition?.y,
    releaseThresholdInches
  );

  return {
    x: clamp(x, bounds.minX, bounds.maxX),
    y: clamp(y, bounds.minY, bounds.maxY),
  };
}

export function buildDefaultShelf(existingShelves: ShelfInput[]): ShelfInput {
  const nextId =
    existingShelves.length === 0
      ? 1
      : Math.max(...existingShelves.map((shelf) => shelf.id)) + 1;

  return {
    id: nextId,
    label: `Shelf ${nextId}`,
    position: { x: 0, y: 0 },
    grid: {
      rows: 4,
      columns: 1,
    },
    cellSize: {
      width: 13,
      height: 13,
    },
    borders: {
      outer: DEFAULT_SHELF_OUTER_BORDER_INCHES,
      inner: DEFAULT_SHELF_INNER_BORDER_INCHES,
    },
  };
}

export function updateShelf(
  shelves: ShelfInput[],
  shelfId: ShelfId,
  updater: (shelf: ShelfInput) => ShelfInput
): ShelfInput[] {
  return shelves.map((shelf) => (shelf.id === shelfId ? updater(shelf) : shelf));
}
