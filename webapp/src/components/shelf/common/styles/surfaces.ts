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
    backgroundImage: `
      radial-gradient(circle at left bottom, rgba(117, 92, 68, 0.28) 1.2px, transparent 1.7px),
      linear-gradient(180deg, rgba(255,255,255,0.52), rgba(245,237,227,0.65))
    `,
    backgroundPosition: 'left bottom, center center',
    backgroundRepeat: 'repeat, no-repeat',
    backgroundSize: `${snapGridSize}px ${snapGridSize}px, auto`,
  } as const;
}
