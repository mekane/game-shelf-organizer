import { useDroppable } from '@dnd-kit/core';
import { Box, Paper, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { Category, Orientation, ProductInput } from '../../common/types';
import { InventoryCategoryKey } from './InventoryCategoryKey';
import { InventoryProductCard } from './InventoryProductCard';

interface InventoryPanelProps {
  categories: Category[];
  products: ProductInput[];
  orientationByProductId: Record<string, Orientation>;
  categoryColorByProductId: Record<string, string | undefined>;
  holdingAreaTitle: string;
  holdingAreaDescription: string;
  selectedProductId: string | null;
  activeProductId: string | null;
  invalidProductIds: Set<string>;
  scale: number;
  onSelectProduct: (productId: string) => void;
}

export function InventoryPanel({
  categories,
  products,
  orientationByProductId,
  categoryColorByProductId,
  holdingAreaTitle,
  holdingAreaDescription,
  selectedProductId,
  activeProductId,
  invalidProductIds,
  scale,
  onSelectProduct,
}: InventoryPanelProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'inventory-dropzone',
    data: {
      type: 'inventory-dropzone',
    },
  });

  return (
    <Paper
      ref={setNodeRef}
      elevation={0}
      sx={(theme) => ({
        p: 2,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: isOver
          ? alpha(theme.palette.secondary.main, theme.palette.mode === 'dark' ? 0.22 : 0.14)
          : theme.palette.background.paper,
      })}
    >
      <Stack spacing={1.5}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={1.5}
          sx={{
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', md: 'flex-start' },
          }}
        >
          <Stack spacing={0.5} sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {holdingAreaTitle}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 520 }}>
              {holdingAreaDescription}
            </Typography>
          </Stack>

          <InventoryCategoryKey categories={categories} />
        </Stack>

        <Stack
          direction="row"
          spacing={1.25}
          useFlexGap
          sx={{ flexWrap: 'wrap' }}
        >
          {products.map((product) => (
            <InventoryProductCard
              key={product.id}
              product={product}
              orientation={orientationByProductId[product.id]}
              scale={scale}
              categoryColor={categoryColorByProductId[product.id]}
              selected={selectedProductId === product.id}
              invalid={invalidProductIds.has(product.id)}
              active={activeProductId === product.id}
              onSelect={onSelectProduct}
            />
          ))}
          {products.length === 0 ? (
            <Box
              sx={{
                minHeight: 84,
                width: '100%',
                display: 'grid',
                placeItems: 'center',
                borderRadius: 2,
                border: '1px dashed',
                borderColor: 'divider',
              }}
            >
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Every product is currently placed on a shelf.
              </Typography>
            </Box>
          ) : null}
        </Stack>
      </Stack>
    </Paper>
  );
}
