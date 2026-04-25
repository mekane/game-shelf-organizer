import { ThemeProvider } from '@mui/material/styles';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DEFAULT_PRODUCT_SURFACE_COLOR } from '../common/components';
import { InventoryModeScreen } from './InventoryModeScreen';
import type {
  CategoryMap,
  PlacementOutput,
  ProductInput,
  ShelfInput,
} from '../common/types';
import { demoTheme } from '../demo/theme';

const shelves: ShelfInput[] = [
  {
    id: 1,
    label: 'Shelf 1',
    position: { x: 0, y: 0 },
    grid: { rows: 1, columns: 1 },
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
    size: { width: 5, height: 5 },
    categoryId: 2,
  },
];

const categories: CategoryMap = {
  1: {
    id: 1,
    name: 'Produce',
    color: 'rgb(215, 232, 177)',
  },
  2: {
    id: 2,
    name: 'Glassware',
    color: 'rgb(198, 216, 234)',
  },
};

const placements: PlacementOutput = {
  a: {
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
  b: {
    orientation: 'horizontal',
    address: null,
    cellPosition: null,
  },
};

function renderInventoryScreen(
  nextProducts = products,
  nextPlacements = placements,
  onPlacementsChange = vi.fn(),
  nextCategories = categories
) {
  return render(
    <ThemeProvider theme={demoTheme}>
      <InventoryModeScreen
        shelves={shelves}
        categories={nextCategories}
        products={nextProducts}
        placements={nextPlacements}
        onPlacementsChange={onPlacementsChange}
      />
    </ThemeProvider>
  );
}

function hexToRgbString(hex: string): string {
  const normalized = hex.replace('#', '');
  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgb(${red}, ${green}, ${blue})`;
}

describe('InventoryModeScreen', () => {
  it('does not render shelf labels inside inventory shelves', () => {
    renderInventoryScreen();

    expect(screen.queryByText('Shelf 1')).not.toBeInTheDocument();
  });

  it('shows the selected product in the sidebar', async () => {
    const user = userEvent.setup();

    renderInventoryScreen();

    await user.click(screen.getByTestId('inventory-product-b'));

    expect(screen.getByText(/SKU: B-1/i)).toBeInTheDocument();
    expect(screen.getByText(/Address: null/i)).toBeInTheDocument();
  });

  it('clears selection when clicking empty inventory workspace space', async () => {
    const user = userEvent.setup();

    renderInventoryScreen();

    await user.click(screen.getByTestId('placed-product-a'));
    expect(screen.getByLabelText('Orientation')).toBeInTheDocument();

    await user.click(screen.getByTestId('cell-1-0-0'));

    expect(
      screen.getByText(/Select a product from the inventory or a shelf cell to inspect its placement\./i)
    ).toBeInTheDocument();
    expect(screen.queryByLabelText('Orientation')).not.toBeInTheDocument();
  });

  it('renders a category key in the inventory header', () => {
    renderInventoryScreen();

    expect(screen.getByTestId('inventory-category-key')).toBeInTheDocument();
    expect(screen.getByText('Category Key')).toBeInTheDocument();
    expect(screen.getByTestId('inventory-category-row-1')).toHaveTextContent('Produce');
    expect(screen.getByTestId('inventory-category-row-2')).toHaveTextContent('Glassware');
    expect(getComputedStyle(screen.getByTestId('inventory-category-chip-1')).backgroundColor).toBe(
      categories[1].color
    );
    expect(getComputedStyle(screen.getByTestId('inventory-category-chip-2')).backgroundColor).toBe(
      categories[2].color
    );
  });

  it('uses category colors for inventory and placed products, including selected state', async () => {
    const user = userEvent.setup();

    renderInventoryScreen();

    expect(getComputedStyle(screen.getByTestId('product-a')).backgroundColor).toBe(
      categories[1].color
    );
    expect(getComputedStyle(screen.getByTestId('product-b')).backgroundColor).toBe(
      categories[2].color
    );

    await user.click(screen.getByTestId('inventory-product-b'));

    expect(getComputedStyle(screen.getByTestId('product-b')).backgroundColor).toBe(
      categories[2].color
    );
  });

  it('keeps inventory cards readable without inflating placed shelf footprints', () => {
    const equalSizeProducts: ProductInput[] = [
      products[0],
      {
        ...products[0],
        id: 'c',
        label: 'Gamma Box',
        sku: 'C-1',
      },
    ];
    const equalSizePlacements: PlacementOutput = {
      a: placements.a,
      c: {
        orientation: 'horizontal',
        address: null,
        cellPosition: null,
      },
    };

    renderInventoryScreen(equalSizeProducts, equalSizePlacements);

    const placedProduct = screen.getByTestId('product-a');
    const inventoryProduct = screen.getByTestId('product-c');

    expect(placedProduct.style.width).toBe('48px');
    expect(placedProduct.style.minWidth).toBe('48px');
    expect(inventoryProduct.style.width).toBe('54px');
    expect(inventoryProduct.style.minWidth).toBe('54px');
    expect(inventoryProduct.style.height).toBe(placedProduct.style.height);
    expect(inventoryProduct.style.minHeight).toBe(placedProduct.style.minHeight);
    expect(inventoryProduct.style.padding).toBe(placedProduct.style.padding);
  });

  it('falls back to the neutral product color when a category is missing', () => {
    renderInventoryScreen(products, placements, vi.fn(), {
      1: categories[1],
    });

    expect(getComputedStyle(screen.getByTestId('product-b')).backgroundColor).toBe(
      hexToRgbString(DEFAULT_PRODUCT_SURFACE_COLOR)
    );
  });

  it('returns a placed product to inventory from the sidebar', async () => {
    const user = userEvent.setup();
    const onPlacementsChange = vi.fn();

    renderInventoryScreen(products, placements, onPlacementsChange);

    await user.click(screen.getByTestId('placed-product-a'));
    await user.click(screen.getByRole('button', { name: /return to inventory/i }));

    expect(onPlacementsChange).toHaveBeenCalledWith(
      {
        ...placements,
        a: {
          orientation: 'horizontal',
          address: null,
          cellPosition: null,
        },
      },
      {
        reason: 'return-to-inventory',
        productId: 'a',
      }
    );
  });

  it('updates orientation from the sidebar', async () => {
    const user = userEvent.setup();
    const onPlacementsChange = vi.fn();

    renderInventoryScreen(products, placements, onPlacementsChange);

    await user.click(screen.getByTestId('inventory-product-b'));
    await user.click(screen.getByLabelText('Orientation'));
    await user.click(screen.getByRole('option', { name: 'Vertical' }));

    expect(onPlacementsChange).toHaveBeenCalledWith(
      {
        ...placements,
        b: {
          orientation: 'vertical',
          address: null,
          cellPosition: null,
        },
      },
      {
        reason: 'rotate-product',
        productId: 'b',
      }
    );
  });

  it('reconciles resized products back to inventory', async () => {
    const onPlacementsChange = vi.fn();
    const { rerender } = renderInventoryScreen(products, placements, onPlacementsChange);

    const resizedProducts: ProductInput[] = [
      {
        ...products[0],
        size: { width: 14, height: 6 },
      },
      products[1],
    ];

    rerender(
      <ThemeProvider theme={demoTheme}>
        <InventoryModeScreen
          shelves={shelves}
          categories={categories}
          products={resizedProducts}
          placements={placements}
          onPlacementsChange={onPlacementsChange}
        />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(onPlacementsChange).toHaveBeenCalledWith(
        {
          a: {
            orientation: 'horizontal',
            address: null,
            cellPosition: null,
          },
          b: {
            orientation: 'horizontal',
            address: null,
            cellPosition: null,
          },
        },
        {
          reason: 'sync-products',
        }
      );
    });
  });
});
