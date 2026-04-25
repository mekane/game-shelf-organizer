import { LayoutWorkspaceInput, ShelfInput } from "@components/shelf";

const kallaxCells = { width: 13, height: 13 };

const kallaxSingle = {
  grid: { rows: 4, columns: 1 },
  cellSize: kallaxCells,
};

const kallaxDouble = {
  grid: { rows: 4, columns: 2 },
  cellSize: kallaxCells,
};

const noBorders = { borders: { outer: 0, inner: 0 } };
const topperBorders = { borders: { inner: 0, outer: 0.75 } };

export const defaultShelves: ShelfInput[] = [
  {
    id: 1,
    label: "K1",
    position: { x: 0, y: 0 },
    ...kallaxSingle,
  },
  {
    id: 2,
    label: "K2",
    position: { x: 16, y: 0 },
    ...kallaxDouble,
  },
  {
    id: 3,
    label: "K3",
    position: { x: 16 + 30, y: 0 },
    ...kallaxDouble,
  },
  {
    id: 4,
    label: "K4",
    position: { x: 16 + 30 + 30, y: 0 },
    ...kallaxSingle,
  },
  {
    id: 5,
    label: "K5",
    position: { x: 16 + 30 + 30 + 16, y: 0 },
    ...kallaxDouble,
  },
  {
    id: 6,
    label: "K6",
    position: { x: 16 + 30 + 30 + 16 + 30, y: 0 },
    ...kallaxDouble,
  },
  {
    id: 7,
    label: "K7",
    position: { x: 16 + 30 + 30 + 16 + 30 + 30, y: 0 },
    ...kallaxSingle,
  },
  {
    id: 8,
    label: "Above L",
    position: { x: 0, y: 57.5 },
    grid: { columns: 1, rows: 1 },
    cellSize: { width: 28, height: 18 },
    ...noBorders,
  },
  {
    id: 9,
    label: "Topper L",
    position: { x: 28, y: 57.5 },
    grid: { columns: 1, rows: 1 },
    cellSize: { width: 54.5, height: 16 },
    ...topperBorders,
  },
  {
    id: 10,
    label: "Topper R",
    position: { x: 84, y: 57.5 },
    grid: { columns: 1, rows: 1 },
    cellSize: { width: 54.5, height: 16 },
    ...topperBorders,
  },
  {
    id: 11,
    label: "Above R",
    position: { x: 140, y: 57.5 },
    grid: { columns: 1, rows: 1 },
    cellSize: { width: 28, height: 18 },
    ...noBorders,
  },
  {
    id: 12,
    label: "Above Center",
    position: { x: 28, y: 75 },
    grid: { columns: 1, rows: 1 },
    cellSize: { width: 112, height: 15 },
    ...noBorders,
  },
];

export const defaultRoom: LayoutWorkspaceInput = {
  size: {
    width: 176,
    height: 90,
  },
  snapIncrement: 2,
};
