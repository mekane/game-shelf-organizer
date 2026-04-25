import { Box } from '@mui/material';
import { useDraggable } from '@dnd-kit/core';
import { ProductVisual } from '../../common/components';
import type { Orientation, ProductInput } from '../../common/types';

interface InventoryProductCardProps {
  product: ProductInput;
  orientation: Orientation;
  scale: number;
  categoryColor?: string;
  selected: boolean;
  invalid: boolean;
  active: boolean;
  onSelect: (productId: string) => void;
}

export function InventoryProductCard({
  product,
  orientation,
  scale,
  categoryColor,
  selected,
  invalid,
  active,
  onSelect,
}: InventoryProductCardProps) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `product-${product.id}`,
    data: {
      type: 'product',
      productId: product.id,
    },
  });

  return (
    <Box
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      data-testid={`inventory-product-${product.id}`}
      onClick={() => onSelect(product.id)}
      sx={{
        cursor: active ? 'grabbing' : 'grab',
        opacity: active ? 0.28 : 1,
      }}
    >
      <ProductVisual
        product={product}
        orientation={orientation}
        scale={scale}
        categoryColor={categoryColor}
        selected={selected}
        invalid={invalid}
        dense
        metadataTooltipDisabled={active}
      />
    </Box>
  );
}
