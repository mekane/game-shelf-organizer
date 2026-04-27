import { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { LayoutModeProps, LayoutWorkspaceInput, ShelfInput } from '../common/types';
import { getLayoutWorkspaceGridStyles, SQUARE_SURFACE_RADIUS } from '../common/styles/surfaces';
import { demoTheme } from '../demo/theme';
import { LayoutModeScreen } from './LayoutModeScreen';

const workspace: LayoutWorkspaceInput = {
  size: { width: 60, height: 60 },
  snapIncrement: 2,
};

function renderLayoutScreen(
  shelves: ShelfInput[],
  onShelvesChange = vi.fn(),
  name = 'Shelf Arrangement',
  sx?: LayoutModeProps['sx']
) {
  return render(
    <ThemeProvider theme={demoTheme}>
      <LayoutModeScreen
        name={name}
        sx={sx}
        workspace={workspace}
        shelves={shelves}
        onShelvesChange={onShelvesChange}
      />
    </ThemeProvider>
  );
}

function renderControlledLayoutScreen(
  initialShelves: ShelfInput[],
  onShelvesChange = vi.fn(),
  initialName = 'Shelf Arrangement',
  sx?: LayoutModeProps['sx']
) {
  function LayoutScreenHarness() {
    const [name, setName] = useState(initialName);
    const [workspaceState, setWorkspaceState] = useState(workspace);
    const [shelves, setShelves] = useState(initialShelves);

    return (
      <ThemeProvider theme={demoTheme}>
        <LayoutModeScreen
          name={name}
          sx={sx}
          workspace={workspaceState}
          shelves={shelves}
          onShelvesChange={(nextShelves, meta) => {
            setShelves(nextShelves);
            setName(meta.name);
            setWorkspaceState((current) => ({
              ...current,
              size: meta.size,
            }));
            onShelvesChange(nextShelves, meta);
          }}
        />
      </ThemeProvider>
    );
  }

  return render(<LayoutScreenHarness />);
}

describe('LayoutModeScreen', () => {
  it('renders the layout name as the workspace header when no shelf is selected', () => {
    renderLayoutScreen([], vi.fn(), 'Front Room Shelves');

    expect(screen.getByRole('heading', { name: 'Front Room Shelves', level: 2 })).toBeVisible();
    expect(screen.queryByTestId('layout-name-field')).toBeNull();
  });

  it('keeps the layout name in the workspace header when the selected shelf changes', async () => {
    const user = userEvent.setup();

    renderLayoutScreen(
      [
        {
          id: 1,
          label: 'Entry Wall',
          position: { x: 0, y: 0 },
          grid: { rows: 4, columns: 1 },
          cellSize: { width: 12, height: 12 },
        },
        {
          id: 2,
          label: 'Back Corner',
          position: { x: 18, y: 0 },
          grid: { rows: 4, columns: 1 },
          cellSize: { width: 12, height: 12 },
        },
      ],
      vi.fn(),
      'Front Room Shelves'
    );

    expect(screen.getByRole('heading', { name: 'Front Room Shelves', level: 2 })).toBeVisible();

    await user.click(screen.getByTestId('shelf-2'));

    expect(screen.getByRole('heading', { name: 'Front Room Shelves', level: 2 })).toBeVisible();
    expect(screen.queryByRole('heading', { name: 'Back Corner', level: 2 })).toBeNull();
  });

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
        name: 'Shelf Arrangement',
        size: workspace.size,
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
      overflow: 'auto',
    });
    expect(screen.getByTestId('layout-workspace')).toHaveStyle({
      width: '720px',
      height: '720px',
    });
  });

  it('does not render the workspace summary chips in the header', () => {
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

    expect(screen.queryByTestId('screen-layout-header-supplement')).toBeNull();
    expect(screen.queryByTestId('layout-summary-chips')).toBeNull();
  });

  it('forwards sx to the outer workspace container', () => {
    renderLayoutScreen([], vi.fn(), 'Shelf Arrangement', { margin: 2 });

    expect(window.getComputedStyle(screen.getByTestId('screen-layout-root')).marginTop).toBe(
      '16px'
    );
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
    expect(screen.getByRole('heading', { name: 'Shelf Arrangement', level: 2 })).toBeVisible();
    expect(screen.getByTestId('shelf-label-1')).toHaveStyle({
      opacity: '0',
    });
  });

  it('renames the layout from the workspace header using the confirm button', async () => {
    const user = userEvent.setup();
    const onShelvesChange = vi.fn();

    renderControlledLayoutScreen([], onShelvesChange, 'Entry Layout');

    await user.click(screen.getByTestId('layout-name-trigger'));
    const nameInput = within(screen.getByTestId('layout-name-field')).getByRole('textbox');
    await user.clear(nameInput);
    await user.type(nameInput, 'Front Display');
    await user.click(screen.getByTestId('layout-name-confirm'));

    expect(onShelvesChange).toHaveBeenCalledWith([], {
      reason: 'update-layout',
      name: 'Front Display',
      size: workspace.size,
    });
    expect(screen.getByRole('heading', { name: 'Front Display', level: 2 })).toBeVisible();
  });

  it('confirms a layout header rename on enter', async () => {
    const user = userEvent.setup();
    const onShelvesChange = vi.fn();

    renderControlledLayoutScreen([], onShelvesChange, 'Entry Layout');

    await user.click(screen.getByTestId('layout-name-trigger'));
    const nameInput = within(screen.getByTestId('layout-name-field')).getByRole('textbox');
    await user.clear(nameInput);
    await user.type(nameInput, 'Receiving Rack{Enter}');

    expect(onShelvesChange).toHaveBeenCalledWith([], {
      reason: 'update-layout',
      name: 'Receiving Rack',
      size: workspace.size,
    });
    expect(screen.queryByTestId('layout-name-field')).toBeNull();
  });

  it('cancels a layout header rename on escape', async () => {
    const user = userEvent.setup();
    const onShelvesChange = vi.fn();

    renderControlledLayoutScreen([], onShelvesChange, 'Entry Layout');

    await user.click(screen.getByTestId('layout-name-trigger'));
    const nameInput = within(screen.getByTestId('layout-name-field')).getByRole('textbox');
    await user.clear(nameInput);
    await user.type(nameInput, 'Receiving Rack{Escape}');

    expect(onShelvesChange).not.toHaveBeenCalled();
    expect(screen.queryByTestId('layout-name-field')).toBeNull();
    expect(screen.getByRole('heading', { name: 'Entry Layout', level: 2 })).toBeVisible();
  });

  it('cancels a layout header rename from the cancel button', async () => {
    const user = userEvent.setup();
    const onShelvesChange = vi.fn();

    renderControlledLayoutScreen([], onShelvesChange, 'Entry Layout');

    await user.click(screen.getByTestId('layout-name-trigger'));
    const nameInput = within(screen.getByTestId('layout-name-field')).getByRole('textbox');
    await user.clear(nameInput);
    await user.type(nameInput, 'Receiving Rack');
    await user.click(screen.getByTestId('layout-name-cancel'));

    expect(onShelvesChange).not.toHaveBeenCalled();
    expect(screen.queryByTestId('layout-name-field')).toBeNull();
    expect(screen.getByRole('heading', { name: 'Entry Layout', level: 2 })).toBeVisible();
  });

  it('cancels a layout header rename when the workspace background is clicked', async () => {
    const user = userEvent.setup();
    const onShelvesChange = vi.fn();

    renderControlledLayoutScreen([], onShelvesChange, 'Entry Layout');

    await user.click(screen.getByTestId('layout-name-trigger'));
    const nameInput = within(screen.getByTestId('layout-name-field')).getByRole('textbox');
    await user.clear(nameInput);
    await user.type(nameInput, 'Receiving Rack');
    await user.click(screen.getByTestId('layout-workspace'));

    expect(onShelvesChange).not.toHaveBeenCalled();
    expect(screen.queryByTestId('layout-name-field')).toBeNull();
    expect(screen.getByRole('heading', { name: 'Entry Layout', level: 2 })).toBeVisible();
  });

  it('cancels a layout header rename when another header control is clicked', async () => {
    const user = userEvent.setup();
    const onShelvesChange = vi.fn();

    renderControlledLayoutScreen([], onShelvesChange, 'Entry Layout');

    await user.click(screen.getByTestId('layout-name-trigger'));
    const nameInput = within(screen.getByTestId('layout-name-field')).getByRole('textbox');
    await user.clear(nameInput);
    await user.type(nameInput, 'Receiving Rack');
    await user.click(screen.getByTestId('layout-size-trigger'));

    expect(onShelvesChange).not.toHaveBeenCalled();
    expect(screen.queryByTestId('layout-name-field')).toBeNull();
    expect(screen.queryByTestId('layout-size-width-field')).toBeNull();
    expect(screen.queryByTestId('layout-size-height-field')).toBeNull();
    expect(screen.getByRole('heading', { name: 'Entry Layout', level: 2 })).toBeVisible();
  });

  it('cancels a layout header rename when the header spacer is clicked', async () => {
    const user = userEvent.setup();
    const onShelvesChange = vi.fn();

    renderControlledLayoutScreen([], onShelvesChange, 'Entry Layout');

    await user.click(screen.getByTestId('layout-name-trigger'));
    const nameInput = within(screen.getByTestId('layout-name-field')).getByRole('textbox');
    await user.clear(nameInput);
    await user.type(nameInput, 'Receiving Rack');
    await user.click(screen.getByTestId('layout-header-spacer'));

    expect(onShelvesChange).not.toHaveBeenCalled();
    expect(screen.queryByTestId('layout-name-field')).toBeNull();
    expect(screen.getByRole('heading', { name: 'Entry Layout', level: 2 })).toBeVisible();
  });

  it('renders the workspace width and height in the header', () => {
    renderLayoutScreen([]);

    expect(screen.getByTestId('layout-size-width-value')).toHaveTextContent('60"');
    expect(screen.getByTestId('layout-size-height-value')).toHaveTextContent('60"');
  });

  it('updates the workspace size from the header using the shared confirm button', async () => {
    const user = userEvent.setup();
    const onShelvesChange = vi.fn();

    renderControlledLayoutScreen([], onShelvesChange, 'Entry Layout');

    await user.click(screen.getByTestId('layout-size-trigger'));
    const widthInput = screen.getByRole('spinbutton', { name: 'Workspace Width' });
    const heightInput = screen.getByRole('spinbutton', { name: 'Workspace Height' });
    await user.clear(widthInput);
    await user.type(widthInput, '72');
    await user.clear(heightInput);
    await user.type(heightInput, '48');
    await user.click(screen.getByTestId('layout-size-confirm'));

    expect(onShelvesChange).toHaveBeenCalledWith([], {
      reason: 'update-layout',
      name: 'Entry Layout',
      size: { width: 72, height: 48 },
    });
    expect(screen.getByTestId('layout-size-width-value')).toHaveTextContent('72"');
    expect(screen.getByTestId('layout-size-height-value')).toHaveTextContent('48"');
    expect(screen.getByTestId('layout-workspace')).toHaveStyle({
      width: '864px',
      height: '576px',
    });
  });

  it('cancels a workspace size edit from the shared cancel button', async () => {
    const user = userEvent.setup();
    const onShelvesChange = vi.fn();

    renderControlledLayoutScreen([], onShelvesChange, 'Entry Layout');

    await user.click(screen.getByTestId('layout-size-trigger'));
    const widthInput = screen.getByRole('spinbutton', { name: 'Workspace Width' });
    const heightInput = screen.getByRole('spinbutton', { name: 'Workspace Height' });
    await user.clear(widthInput);
    await user.type(widthInput, '72');
    await user.clear(heightInput);
    await user.type(heightInput, '48');
    await user.click(screen.getByTestId('layout-size-cancel'));

    expect(onShelvesChange).not.toHaveBeenCalled();
    expect(screen.getByTestId('layout-size-width-value')).toHaveTextContent('60"');
    expect(screen.getByTestId('layout-size-height-value')).toHaveTextContent('60"');
    expect(screen.queryByTestId('layout-size-width-field')).toBeNull();
    expect(screen.queryByTestId('layout-size-height-field')).toBeNull();
  });

  it('cancels a workspace size edit when the workspace background is clicked', async () => {
    const user = userEvent.setup();
    const onShelvesChange = vi.fn();

    renderControlledLayoutScreen([], onShelvesChange, 'Entry Layout');

    await user.click(screen.getByTestId('layout-size-trigger'));
    const widthInput = screen.getByRole('spinbutton', { name: 'Workspace Width' });
    const heightInput = screen.getByRole('spinbutton', { name: 'Workspace Height' });
    await user.clear(widthInput);
    await user.type(widthInput, '72');
    await user.clear(heightInput);
    await user.type(heightInput, '48');
    await user.click(screen.getByTestId('layout-workspace'));

    expect(onShelvesChange).not.toHaveBeenCalled();
    expect(screen.getByTestId('layout-size-width-value')).toHaveTextContent('60"');
    expect(screen.getByTestId('layout-size-height-value')).toHaveTextContent('60"');
    expect(screen.queryByTestId('layout-size-width-field')).toBeNull();
    expect(screen.queryByTestId('layout-size-height-field')).toBeNull();
  });

  it('cancels a workspace size edit when another header control is clicked', async () => {
    const user = userEvent.setup();
    const onShelvesChange = vi.fn();

    renderControlledLayoutScreen([], onShelvesChange, 'Entry Layout');

    await user.click(screen.getByTestId('layout-size-trigger'));
    const widthInput = screen.getByRole('spinbutton', { name: 'Workspace Width' });
    const heightInput = screen.getByRole('spinbutton', { name: 'Workspace Height' });
    await user.clear(widthInput);
    await user.type(widthInput, '72');
    await user.clear(heightInput);
    await user.type(heightInput, '48');
    await user.click(screen.getByTestId('layout-name-trigger'));

    expect(onShelvesChange).not.toHaveBeenCalled();
    expect(screen.queryByTestId('layout-name-field')).toBeNull();
    expect(screen.queryByTestId('layout-size-width-field')).toBeNull();
    expect(screen.queryByTestId('layout-size-height-field')).toBeNull();
    expect(screen.getByTestId('layout-size-width-value')).toHaveTextContent('60"');
    expect(screen.getByTestId('layout-size-height-value')).toHaveTextContent('60"');
  });

  it('cancels a workspace size edit when the header spacer is clicked', async () => {
    const user = userEvent.setup();
    const onShelvesChange = vi.fn();

    renderControlledLayoutScreen([], onShelvesChange, 'Entry Layout');

    await user.click(screen.getByTestId('layout-size-trigger'));
    const widthInput = screen.getByRole('spinbutton', { name: 'Workspace Width' });
    const heightInput = screen.getByRole('spinbutton', { name: 'Workspace Height' });
    await user.clear(widthInput);
    await user.type(widthInput, '72');
    await user.clear(heightInput);
    await user.type(heightInput, '48');
    await user.click(screen.getByTestId('layout-header-spacer'));

    expect(onShelvesChange).not.toHaveBeenCalled();
    expect(screen.queryByTestId('layout-size-width-field')).toBeNull();
    expect(screen.queryByTestId('layout-size-height-field')).toBeNull();
    expect(screen.getByTestId('layout-size-width-value')).toHaveTextContent('60"');
    expect(screen.getByTestId('layout-size-height-value')).toHaveTextContent('60"');
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
        name: 'Shelf Arrangement',
        size: workspace.size,
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
        name: 'Shelf Arrangement',
        size: workspace.size,
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
      name: 'Shelf Arrangement',
      size: workspace.size,
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
