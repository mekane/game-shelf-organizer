import { demoTheme } from '../../demo/theme';
import {
  APP_THEME_RADIUS,
  BUTTON_SURFACE_RADIUS,
  SQUARE_SURFACE_RADIUS,
  getLayoutWorkspaceGridStyles,
} from './surfaces';

describe('surface tokens', () => {
  it('keeps the global theme radii tightened down', () => {
    expect(demoTheme.shape.borderRadius).toBe(APP_THEME_RADIUS);
    expect(demoTheme.components?.MuiButton?.styleOverrides?.root).toMatchObject({
      borderRadius: BUTTON_SURFACE_RADIUS,
    });
  });

  it('anchors the layout workspace dots to the snap origin', () => {
    expect(
      getLayoutWorkspaceGridStyles(
        {
          size: { width: 60, height: 48 },
          snapIncrement: 2,
        },
        12
      )
    ).toMatchObject({
      borderRadius: SQUARE_SURFACE_RADIUS,
      backgroundPosition: 'left bottom',
      backgroundRepeat: 'repeat',
      backgroundSize: '24px 24px',
    });
  });
});
