import {
  Button,
  Divider,
  FormControl,
  InputLabel,
  OutlinedInput,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useId } from 'react';
import type { ShelfInput } from '../../common/types';
import { WarningNotice } from '../../common/components';
import {
  DEFAULT_SHELF_INNER_BORDER_INCHES,
  DEFAULT_SHELF_OUTER_BORDER_INCHES,
  SHELF_BORDER_INCREMENT_INCHES,
} from '../../common/geometry';

interface LayoutSidebarProps {
  selectedShelf: ShelfInput | undefined;
  warningMessage?: string | null;
  onAddShelf: () => void;
  onRemoveShelf: () => void;
  onUpdateShelf: (updater: (shelf: ShelfInput) => ShelfInput) => void;
}

export function LayoutSidebar({
  selectedShelf,
  warningMessage,
  onAddShelf,
  onRemoveShelf,
  onUpdateShelf,
}: LayoutSidebarProps) {
  const resolvedBorders = selectedShelf ? getResolvedShelfBorders(selectedShelf) : null;

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
        p: 2,
        backgroundColor: 'background.paper',
      }}
    >
      <Stack spacing={2}>
        <Stack
          direction="row"
          sx={{ justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Shelf Controls
          </Typography>
          <Button variant="contained" color="secondary" onClick={onAddShelf}>
            Add Shelf
          </Button>
        </Stack>

        <WarningNotice message={warningMessage} />

        {selectedShelf ? (
          <>
            <TextField
              label="Label"
              value={selectedShelf.label ?? ''}
              onChange={(event) =>
                onUpdateShelf((shelf) => ({
                  ...shelf,
                  label: event.target.value,
                }))
              }
              fullWidth
              size="small"
            />

            <Stack direction="row" spacing={1.5}>
              <NumericField
                label="Rows"
                value={selectedShelf.grid.rows}
                onChange={(value) =>
                  onUpdateShelf((shelf) => ({
                    ...shelf,
                    grid: {
                      ...shelf.grid,
                      rows: Math.max(1, value),
                    },
                  }))
                }
              />
              <NumericField
                label="Columns"
                value={selectedShelf.grid.columns}
                onChange={(value) =>
                  onUpdateShelf((shelf) => ({
                    ...shelf,
                    grid: {
                      ...shelf.grid,
                      columns: Math.max(1, value),
                    },
                  }))
                }
              />
            </Stack>

            <Stack direction="row" spacing={1.5}>
              <NumericField
                label="Cell Width"
                value={selectedShelf.cellSize.width}
                onChange={(value) =>
                  onUpdateShelf((shelf) => ({
                    ...shelf,
                    cellSize: {
                      ...shelf.cellSize,
                      width: Math.max(1, value),
                    },
                  }))
                }
              />
              <NumericField
                label="Cell Height"
                value={selectedShelf.cellSize.height}
                onChange={(value) =>
                  onUpdateShelf((shelf) => ({
                    ...shelf,
                    cellSize: {
                      ...shelf.cellSize,
                      height: Math.max(1, value),
                    },
                  }))
                }
              />
            </Stack>

            <Stack direction="row" spacing={1.5}>
              <NumericField
                label="Outer Border"
                value={resolvedBorders!.outer}
                step={SHELF_BORDER_INCREMENT_INCHES}
                roundTo={SHELF_BORDER_INCREMENT_INCHES}
                min={0}
                onChange={(value) =>
                  onUpdateShelf((shelf) => ({
                    ...shelf,
                    borders: {
                      ...getResolvedShelfBorders(shelf),
                      outer: Math.max(0, value),
                    },
                  }))
                }
              />
              <NumericField
                label="Inner Divider"
                value={resolvedBorders!.inner}
                step={SHELF_BORDER_INCREMENT_INCHES}
                roundTo={SHELF_BORDER_INCREMENT_INCHES}
                min={0}
                onChange={(value) =>
                  onUpdateShelf((shelf) => ({
                    ...shelf,
                    borders: {
                      ...getResolvedShelfBorders(shelf),
                      inner: Math.max(0, value),
                    },
                  }))
                }
              />
            </Stack>

            <Divider />

            <Stack direction="row" spacing={1.5}>
              <NumericField
                label="X"
                value={selectedShelf.position.x}
                onChange={(value) =>
                  onUpdateShelf((shelf) => ({
                    ...shelf,
                    position: {
                      ...shelf.position,
                      x: value,
                    },
                  }))
                }
              />
              <NumericField
                label="Y"
                value={selectedShelf.position.y}
                onChange={(value) =>
                  onUpdateShelf((shelf) => ({
                    ...shelf,
                    position: {
                      ...shelf.position,
                      y: value,
                    },
                  }))
                }
              />
            </Stack>

            <Button color="error" variant="outlined" onClick={onRemoveShelf}>
              Remove Shelf
            </Button>
          </>
        ) : (
          <Typography sx={{ color: 'text.secondary' }}>
            Select a shelf to edit its grid, borders, cell size, and coordinates.
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}

interface NumericFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  roundTo?: number;
}

function NumericField({
  label,
  value,
  onChange,
  step = 1,
  min,
  roundTo = 1,
}: NumericFieldProps) {
  const inputId = useId();

  return (
    <FormControl fullWidth size="small">
      <InputLabel htmlFor={inputId}>{label}</InputLabel>
      <OutlinedInput
        id={inputId}
        label={label}
        type="number"
        value={value}
        onChange={(event) => {
          const nextValue = Number(event.target.value);

          if (Number.isNaN(nextValue)) {
            return;
          }

          const roundedValue = roundToIncrement(nextValue, roundTo);
          onChange(min === undefined ? roundedValue : Math.max(min, roundedValue));
        }}
        inputProps={{ step, min }}
      />
    </FormControl>
  );
}

function getResolvedShelfBorders(shelf: ShelfInput) {
  return {
    outer: shelf.borders?.outer ?? DEFAULT_SHELF_OUTER_BORDER_INCHES,
    inner: shelf.borders?.inner ?? DEFAULT_SHELF_INNER_BORDER_INCHES,
  };
}

function roundToIncrement(value: number, increment: number): number {
  if (increment <= 0) {
    return value;
  }

  return Number((Math.round(value / increment) * increment).toFixed(2));
}
