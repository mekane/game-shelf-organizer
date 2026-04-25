import { ThemeProvider } from '@mui/material/styles';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { LayoutWorkspaceInput, ShelfInput } from '../common/types';
import { getLayoutWorkspaceGridStyles, SQUARE_SURFACE_RADIUS } from '../common/styles/surfaces';
import { demoTheme } from '../demo/theme';
import { LayoutModeScreen } from './LayoutModeScreen';

const workspace: LayoutWorkspaceInput = {
  size: { width: 60, height: 60 },
  snapIncrement: 2,
};

function renderLayoutScreen(shelves: ShelfInput[], onShelvesChange = vi.fn()) {
  return render(
    <ThemeProvider theme={demoTheme}>
      <LayoutModeScreen
        workspace={workspace}
        shelves={shelves}
        onShelvesChange={onShelvesChange}
      />
    </ThemeProvider>
  );
}

describe('LayoutModeScreen', () => {
  it('adds a shelf using the documented defaults', async () => {
    const user = userEvent.setup();
    const onShelvesChange = vi.fn();

    renderLayoutScreen([], onShelvesChange);

    await user.click(screen.getByRole('button', { name: 'Add Shelf' }));

    expect(onShelvesChange).toHaveBeenCalledWith(
      [
        {
          id: 1,
          label: 'Shelf 1',
          position: { x: 0, y: 0 },
          grid: { rows: 4, columns: 1 },
          cellSize: { width: 13, height: 13 },
          borders: { outer: 1.5, inner: 0.75 },
        },
      ],
      {
        reason: 'add-shelf',
        shelfId: 1,
      }
    );
  });

  it('renders full-height shelf cell preview grids in layout mode', () => {
    renderLayoutScreen([
      {
        id: 1,
        label: 'Shelf 1',
        position: { x: 0, y: 0 },
        grid: { rows: 3, columns: 2 },
        cellSize: { width: 10, height: 8 },
        borders: { outer: 1.5, inner: 0.75 },
      },
    ]);

    expect(screen.getByTestId('shelf-grid-1')).toHaveStyle({
      left: '18px',
      top: '18px',
      width: '249px',
      height: '306px',
    });
  });

  it('matches the configured workspace bounds without extra viewport padding', () => {
    renderLayoutScreen([]);

    expect(screen.getByTestId('layout-workspace-frame')).toHaveStyle({
      width: '100%',
      maxWidth: '748px',
      overflow: 'scroll',
    });
    expect(screen.getByTestId('layout-workspace')).toHaveStyle({
      width: '720px',
      height: '720px',
    });
  });

  it('renders the layout summary chips in the header above the workspace', () => {
    renderLayoutScreen([
      {
        id: 1,
        label: 'Shelf 1',
        position: { x: 0, y: 0 },
        grid: { rows: 4, columns: 1 },
        cellSize: { width: 12, height: 12 },
      },
      {
        id: 2,
        label: 'Shelf 2',
        position: { x: 18, y: 0 },
        grid: { rows: 4, columns: 1 },
        cellSize: { width: 12, height: 12 },
      },
    ]);

    const headerSupplement = screen.getByTestId('screen-layout-header-supplement');
    const summaryChips = screen.getByTestId('layout-summary-chips');

    expect(headerSupplement).toContainElement(summaryChips);
    expect(summaryChips).toHaveTextContent('Workspace 60" × 60"');
    expect(summaryChips).toHaveTextContent('Grid 2" snap');
    expect(summaryChips).toHaveTextContent('2 shelves');
    expect(screen.getByTestId('layout-workspace-frame')).not.toContainElement(summaryChips);
  });

  it('shows shelf labels only for the selected shelf by default', () => {
    renderLayoutScreen([
      {
        id: 1,
        label: 'Shelf 1',
        position: { x: 0, y: 0 },
        grid: { rows: 4, columns: 1 },
        cellSize: { width: 12, height: 12 },
      },
      {
        id: 2,
        label: 'Shelf 2',
        position: { x: 18, y: 0 },
        grid: { rows: 4, columns: 1 },
        cellSize: { width: 12, height: 12 },
      },
    ]);

    expect(screen.getByTestId('shelf-label-1')).toHaveStyle({
      opacity: '1',
    });
    expect(screen.getByTestId('shelf-label-2')).toHaveStyle({
      opacity: '0',
    });
  });

  it('clears the shelf selection when the workspace background is clicked', async () => {
    const user = userEvent.setup();

    renderLayoutScreen([
      {
        id: 1,
        label: 'Shelf 1',
        position: { x: 0, y: 0 },
        grid: { rows: 4, columns: 1 },
        cellSize: { width: 12, height: 12 },
      },
      {
        id: 2,
        label: 'Shelf 2',
        position: { x: 18, y: 0 },
        grid: { rows: 4, columns: 1 },
        cellSize: { width: 12, height: 12 },
      },
    ]);

    await user.click(screen.getByTestId('layout-workspace'));

    expect(
      screen.getByText(/select a shelf to edit its grid, borders, cell size, and coordinates/i)
    ).toBeVisible();
    expect(screen.getByTestId('shelf-label-1')).toHaveStyle({
      opacity: '0',
    });
  });

  it('updates border thicknesses in quarter-inch increments', () => {
    const onShelvesChange = vi.fn();

    renderLayoutScreen(
      [
        {
          id: 1,
          label: 'Shelf 1',
          position: { x: 0, y: 0 },
          grid: { rows: 4, columns: 1 },
          cellSize: { width: 12, height: 12 },
        },
      ],
      onShelvesChange
    );

    fireEvent.change(screen.getByLabelText('Outer Border'), {
      target: { value: '2.3' },
    });

    expect(onShelvesChange).toHaveBeenLastCalledWith(
      [
        {
          id: 1,
          label: 'Shelf 1',
          position: { x: 0, y: 0 },
          grid: { rows: 4, columns: 1 },
          cellSize: { width: 12, height: 12 },
          borders: { outer: 2.25, inner: 0.75 },
        },
      ],
      {
        reason: 'update-shelf',
        shelfId: 1,
      }
    );

    fireEvent.change(screen.getByLabelText('Inner Divider'), {
      target: { value: '1.13' },
    });

    expect(onShelvesChange).toHaveBeenLastCalledWith(
      [
        {
          id: 1,
          label: 'Shelf 1',
          position: { x: 0, y: 0 },
          grid: { rows: 4, columns: 1 },
          cellSize: { width: 12, height: 12 },
          borders: { outer: 2.25, inner: 1.25 },
        },
      ],
      {
        reason: 'update-shelf',
        shelfId: 1,
      }
    );
  });

  it('does not emit invalid overlapping shelf edits', async () => {
    const user = userEvent.setup();
    const shelves: ShelfInput[] = [
      {
        id: 1,
        label: 'Shelf 1',
        position: { x: 0, y: 0 },
        grid: { rows: 4, columns: 1 },
        cellSize: { width: 12, height: 12 },
      },
      {
        id: 2,
        label: 'Shelf 2',
        position: { x: 18, y: 0 },
        grid: { rows: 4, columns: 1 },
        cellSize: { width: 12, height: 12 },
      },
    ];
    const onShelvesChange = vi.fn();

    renderLayoutScreen(shelves, onShelvesChange);

    await user.click(screen.getByTestId('shelf-2'));
    fireEvent.change(screen.getByLabelText('X'), {
      target: { value: '0' },
    });

    expect(onShelvesChange).not.toHaveBeenCalled();
    expect(screen.getByText(/invalid shelf changes are kept locally/i)).toBeInTheDocument();
    expect(
      screen.getByText(/invalid positions stay visible locally/i)
    ).toBeInTheDocument();
  });

  it('requires confirmation before removing a shelf', async () => {
    const user = userEvent.setup();
    const shelves: ShelfInput[] = [
      {
        id: 1,
        label: 'Shelf 1',
        position: { x: 0, y: 0 },
        grid: { rows: 4, columns: 1 },
        cellSize: { width: 12, height: 12 },
      },
    ];
    const onShelvesChange = vi.fn();

    renderLayoutScreen(shelves, onShelvesChange);

    await user.click(screen.getByRole('button', { name: 'Remove Shelf' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Remove' }));

    expect(onShelvesChange).toHaveBeenCalledWith([], {
      reason: 'remove-shelf',
      shelfId: 1,
    });
  });

  it('exposes workspace grid styles that align dots to the snap origin', () => {
    expect(getLayoutWorkspaceGridStyles(workspace, 12)).toMatchObject({
      borderRadius: SQUARE_SURFACE_RADIUS,
      backgroundPosition: 'left bottom, center center',
      backgroundRepeat: 'repeat, no-repeat',
      backgroundSize: '24px 24px, auto',
    });
  });
});
