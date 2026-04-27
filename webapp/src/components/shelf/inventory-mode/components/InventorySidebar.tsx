import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { WarningNotice } from '../../common/components';
import type { Orientation, ProductInput, ProductPlacement } from '../../common/types';

interface InventorySidebarProps {
  productDetailsTitle: string;
  selectedProduct: ProductInput | undefined;
  selectedPlacement: ProductPlacement | undefined;
  invalid: boolean;
  warningMessage?: string | null;
  onOrientationChange: (orientation: Orientation) => void;
  onReturnToInventory: () => void;
}

export function InventorySidebar({
  productDetailsTitle,
  selectedProduct,
  selectedPlacement,
  invalid,
  warningMessage,
  onOrientationChange,
  onReturnToInventory,
}: InventorySidebarProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 4,
        border: '1px solid rgba(88, 64, 42, 0.18)',
        p: 2,
        backgroundColor: 'rgba(255,255,255,0.76)',
      }}
    >
      <Stack spacing={2}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {productDetailsTitle}
        </Typography>

        <WarningNotice message={warningMessage} />

        {selectedProduct && selectedPlacement ? (
          <>
            <Typography variant="body1" sx={{ fontWeight: 700 }}>
              {selectedProduct.label}
            </Typography>
            {selectedProduct.sku ? (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                SKU: {selectedProduct.sku}
              </Typography>
            ) : null}
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Size: {selectedProduct.size.width}" × {selectedProduct.size.height}"
            </Typography>
            <Typography variant="body2" sx={{ color: invalid ? 'error.main' : 'text.secondary' }}>
              Address: {formatAddress(selectedPlacement)}
            </Typography>
            <FormControl fullWidth size="small">
              <InputLabel id="orientation-label">Orientation</InputLabel>
              <Select
                labelId="orientation-label"
                label="Orientation"
                value={selectedPlacement.orientation}
                onChange={(event) =>
                  onOrientationChange(event.target.value as Orientation)
                }
              >
                <MenuItem value="horizontal">Horizontal</MenuItem>
                <MenuItem value="vertical">Vertical</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              color="secondary"
              onClick={onReturnToInventory}
              disabled={!selectedPlacement.address}
            >
              Return To Inventory
            </Button>
          </>
        ) : (
          <Typography sx={{ color: 'text.secondary' }}>
            Select a product from the inventory or a shelf cell to inspect its placement.
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}

function formatAddress(placement: ProductPlacement): string {
  if (!placement.address || !placement.cellPosition) {
    return 'null';
  }

  return `Shelf ${placement.address.shelfId}, row ${placement.address.row}, column ${placement.address.column}, x ${placement.cellPosition.x}, y ${placement.cellPosition.y}`;
}
