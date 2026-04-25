import { ThemeProvider } from '@mui/material/styles';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductVisual } from './';
import { demoTheme } from '../../demo/theme';
import type { ProductInput } from '../types';

const product: ProductInput = {
  id: 'a',
  label: 'Alpha Box',
  sku: 'A-1',
  size: { width: 4, height: 6 },
  categoryId: 1,
};

function renderProductVisual(
  overrides: Partial<React.ComponentProps<typeof ProductVisual>> = {}
) {
  return render(
    <ThemeProvider theme={demoTheme}>
      <ProductVisual
        product={product}
        orientation="horizontal"
        scale={12}
        {...overrides}
      />
    </ThemeProvider>
  );
}

describe('ProductVisual', () => {
  it('renders without a box shadow', () => {
    renderProductVisual();

    expect(screen.getByTestId('product-a').style.boxShadow).toBe('');
    expect(screen.getByTestId('product-a')).toHaveStyle({
      borderWidth: '2px',
      boxSizing: 'border-box',
    });
  });

  it('uses the compact dense minimum footprint when enforcement is enabled', () => {
    renderProductVisual({ dense: true });

    expect(screen.getByTestId('product-a')).toHaveStyle({
      width: '54px',
      minWidth: '54px',
      height: '72px',
      minHeight: '72px',
      padding: '4px 6px',
    });
  });

  it('can render the true scaled footprint when minimum enforcement is disabled', () => {
    renderProductVisual({
      dense: true,
      orientation: 'vertical',
      product: {
        ...product,
        size: { width: 3, height: 4 },
      },
      enforceMinimumFootprint: false,
    });

    expect(screen.getByTestId('product-a')).toHaveStyle({
      width: '48px',
      minWidth: '48px',
      height: '36px',
      minHeight: '36px',
    });
  });

  it('shows sku and size in a hover tooltip instead of inline metadata', async () => {
    const user = userEvent.setup();

    renderProductVisual();

    const productVisual = screen.getByTestId('product-a');

    expect(productVisual).not.toHaveTextContent('A-1');
    expect(productVisual).not.toHaveTextContent('4" × 6"');

    await user.hover(productVisual);

    const tooltip = await screen.findByRole('tooltip');

    expect(tooltip).toHaveTextContent('SKU: A-1');
    expect(tooltip).toHaveTextContent('Size: 4" × 6"');
  });

  it('does not show the metadata tooltip when disabled', async () => {
    const user = userEvent.setup();

    renderProductVisual({ metadataTooltipDisabled: true });

    await user.hover(screen.getByTestId('product-a'));

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });
});
