import { Tooltip } from '@mui/material';
import { alpha, darken, lighten, useTheme } from '@mui/material/styles';
import type { Orientation, ProductInput, Size2D } from '../types';
import { getEffectiveProductSize } from '../geometry/inventory';
import { SQUARE_SURFACE_RADIUS } from '../styles/surfaces';

export const DEFAULT_PRODUCT_SURFACE_COLOR = '#dfccb0';

interface ProductVisualProps {
  product: ProductInput;
  orientation: Orientation;
  scale: number;
  categoryColor?: string;
  selected?: boolean;
  invalid?: boolean;
  dense?: boolean;
  enforceMinimumFootprint?: boolean;
  metadataTooltipDisabled?: boolean;
}

export function ProductVisual({
  product,
  orientation,
  scale,
  categoryColor,
  selected = false,
  invalid = false,
  dense = false,
  enforceMinimumFootprint = true,
  metadataTooltipDisabled = false,
}: ProductVisualProps) {
  const theme = useTheme();
  const size = getEffectiveProductSize(product, orientation);
  const scaledWidth = size.width * scale;
  const scaledHeight = size.height * scale;
  const width = enforceMinimumFootprint
    ? Math.max(scaledWidth, dense ? 54 : 80)
    : scaledWidth;
  const height = enforceMinimumFootprint
    ? Math.max(scaledHeight, dense ? 42 : 64)
    : scaledHeight;
  const baseColor = categoryColor ?? DEFAULT_PRODUCT_SURFACE_COLOR;
  const surfaceLayers = [
    selected
      ? `linear-gradient(140deg, ${alpha(lighten(theme.palette.secondary.main, 0.28), 0.22)}, ${alpha(
          theme.palette.secondary.main,
          0.1
        )})`
      : null,
    invalid
      ? `linear-gradient(140deg, ${alpha(lighten(theme.palette.error.main, 0.2), 0.24)}, ${alpha(
          theme.palette.error.main,
          0.12
        )})`
      : null,
    `linear-gradient(140deg, ${lighten(baseColor, 0.08)}, ${darken(baseColor, 0.08)})`,
  ]
    .filter(Boolean)
    .join(', ');
  const metadataTooltip = (
    <div
      style={{
        display: 'grid',
        gap: 2,
      }}
    >
      {product.sku ? (
        <span data-testid={`product-tooltip-sku-${product.id}`}>SKU: {product.sku}</span>
      ) : null}
      <span data-testid={`product-tooltip-size-${product.id}`}>Size: {formatSize(size)}</span>
    </div>
  );

  return (
    <Tooltip
      arrow
      disableInteractive
      placement="top"
      title={metadataTooltipDisabled ? '' : metadataTooltip}
    >
      <div
        data-testid={`product-${product.id}`}
        style={{
          width,
          height,
          minWidth: width,
          minHeight: height,
          boxSizing: 'border-box',
          borderRadius: SQUARE_SURFACE_RADIUS,
          borderStyle: 'solid',
          borderWidth: 2,
          borderColor: invalid
            ? theme.palette.error.main
            : selected
              ? theme.palette.secondary.main
              : alpha(darken(baseColor, 0.46), 0.28),
          backgroundColor: baseColor,
          backgroundImage: surfaceLayers,
          padding: dense ? '4px 6px' : '6px 8px',
          overflow: 'hidden',
          fontFamily: theme.typography.fontFamily,
        }}
      >
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              fontWeight: 700,
              color: invalid ? theme.palette.error.dark : theme.palette.primary.main,
              lineHeight: 1.1,
              display: '-webkit-box',
              WebkitLineClamp: dense ? 2 : 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontSize: dense ? 12 : 14,
            }}
          >
            {product.label}
          </div>
        </div>
      </div>
    </Tooltip>
  );
}

function formatSize(size: Size2D): string {
  return `${size.width}" × ${size.height}"`;
}
