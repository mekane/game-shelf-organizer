import type { Point2D, Rect2D } from '../types';

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function roundInches(value: number): number {
  return Math.round(value);
}

export function toRect(rect: Rect2D): Rect2D {
  return rect;
}

export function rectsOverlap(a: Rect2D, b: Rect2D): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

export function pointToTopLeft(
  point: Point2D,
  itemHeight: number,
  containerHeight: number
): Point2D {
  return {
    x: point.x,
    y: containerHeight - point.y - itemHeight,
  };
}

export function toDomStyleRect(
  rect: Rect2D,
  containerHeightInches: number,
  scale: number
): Rect2D {
  return {
    x: rect.x * scale,
    y: (containerHeightInches - rect.y - rect.height) * scale,
    width: rect.width * scale,
    height: rect.height * scale,
  };
}
