import { DndContext } from '@dnd-kit/core';
import { ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import type { PlacementOutput, ProductInput, ShelfInput } from '../../common/types';
import { demoTheme } from '../../demo/theme';
import { ShelfInventoryView } from './ShelfInventoryView';

const shelves: ShelfInput[] = [
  {
    id: 1,
    label: 'Shelf 1',
    position: { x: 0, y: 0 },
    grid: { rows: 2, columns: 1 },
    cellSize: { width: 12, height: 12 },
  },
];

const products: ProductInput[] = [
  {
    id: 'a',
    label: 'Alpha Box',
    sku: 'A-1',
    size: { width: 4, height: 6 },
    categoryId: 1,
  },
  {
    id: 'b',
    label: 'Beta Box',
    sku: 'B-1',
    size: { width: 4, height: 6 },
    categoryId: 1,
  },
];

const placements: PlacementOutput = {
  a: {
    orientation: 'horizontal',
    address: null,
    cellPosition: null,
  },
  b: {
    orientation: 'horizontal',
    address: {
      shelfId: 1,
      row: 0,
      column: 0,
    },
    cellPosition: {
      x: 0,
      y: 0,
    },
  },
};

describe('ShelfInventoryView', () => {
  it('renders drag previews with the same flat dense styling as placed shelf boxes', () => {
    render(
      <ThemeProvider theme={demoTheme}>
        <DndContext>
          <ShelfInventoryView
            shelves={shelves}
            products={products}
            placements={placements}
            categoryColorByProductId={{
              a: 'rgb(215, 232, 177)',
              b: 'rgb(215, 232, 177)',
            }}
            selectedProductId={null}
            activeProductId="a"
            invalidProductIds={new Set()}
            preview={{
              productId: 'a',
              address: {
                shelfId: 1,
                row: 1,
                column: 0,
              },
              cellPosition: {
                x: 0,
                y: 0,
              },
              orientation: 'horizontal',
              valid: true,
              overInventory: false,
            }}
            scale={12}
            onSelectProduct={vi.fn()}
            onClearSelection={vi.fn()}
          />
        </DndContext>
      </ThemeProvider>
    );

    const preview = screen.getByTestId('preview-product-a');
    const previewProduct = screen.getByTestId('product-a');
    const placedProduct = screen.getByTestId('product-b');
    const placedWrapper = screen.getByTestId('placed-product-b');

    expect(preview.style.opacity).toBe('');
    expect(preview.style.bottom).toBe('0px');
    expect(previewProduct.style.boxShadow).toBe('');
    expect(placedWrapper.style.bottom).toBe('0px');
    expect(previewProduct.style.width).toBe(placedProduct.style.width);
    expect(previewProduct.style.minWidth).toBe(placedProduct.style.minWidth);
    expect(previewProduct.style.height).toBe(placedProduct.style.height);
    expect(previewProduct.style.minHeight).toBe(placedProduct.style.minHeight);
    expect(previewProduct.style.padding).toBe(placedProduct.style.padding);
    expect(previewProduct.style.backgroundColor).toBe(placedProduct.style.backgroundColor);
  });

  it('renders small vertical shelf placements at their true scaled size inside the cell', () => {
    render(
      <ThemeProvider theme={demoTheme}>
        <DndContext>
          <ShelfInventoryView
            shelves={shelves}
            products={[
              {
                id: 'v',
                label: 'Vertical Box',
                sku: 'V-1',
                size: { width: 3, height: 4 },
                categoryId: 1,
              },
            ]}
            placements={{
              v: {
                orientation: 'vertical',
                address: {
                  shelfId: 1,
                  row: 0,
                  column: 0,
                },
                cellPosition: {
                  x: 0,
                  y: 0,
                },
              },
            }}
            categoryColorByProductId={{
              v: 'rgb(215, 232, 177)',
            }}
            selectedProductId={null}
            activeProductId={null}
            invalidProductIds={new Set()}
            preview={null}
            scale={12}
            onSelectProduct={vi.fn()}
            onClearSelection={vi.fn()}
          />
        </DndContext>
      </ThemeProvider>
    );

    const placedWrapper = screen.getByTestId('placed-product-v');
    const placedProduct = screen.getByTestId('product-v');

    expect(placedWrapper.style.width).toBe('48px');
    expect(placedWrapper.style.height).toBe('36px');
    expect(placedWrapper.style.bottom).toBe('0px');
    expect(placedProduct.style.width).toBe('48px');
    expect(placedProduct.style.minWidth).toBe('48px');
    expect(placedProduct.style.height).toBe('36px');
    expect(placedProduct.style.minHeight).toBe('36px');
  });
});
