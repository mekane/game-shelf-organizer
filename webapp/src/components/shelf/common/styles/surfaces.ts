import type { LayoutWorkspaceInput } from '../types';

export const APP_THEME_RADIUS = 2;
export const BUTTON_SURFACE_RADIUS = 6;
export const SQUARE_SURFACE_RADIUS = 0;

export function getLayoutWorkspaceGridStyles(
  workspace: LayoutWorkspaceInput,
  scale: number
) {
  const snapGridSize = workspace.snapIncrement * scale;

  return {
    borderRadius: SQUARE_SURFACE_RADIUS,
    backgroundImage:
      'radial-gradient(circle at left bottom, currentColor 1.2px, transparent 1.7px)',
    backgroundPosition: 'left bottom',
    backgroundRepeat: 'repeat',
    backgroundSize: `${snapGridSize}px ${snapGridSize}px`,
  } as const;
}
