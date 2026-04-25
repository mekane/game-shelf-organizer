import { useDraggable } from '@dnd-kit/core';
import { ProductVisual } from '../../common/components';
import { getEffectiveProductSize } from '../../common/geometry';
import type { Orientation, Point2D, ProductInput } from '../../common/types';

interface PlacedProductBoxProps {
  product: ProductInput;
  orientation: Orientation;
  cellPosition: Point2D;
  scale: number;
  categoryColor?: string;
  selected: boolean;
  invalid: boolean;
  active: boolean;
  onSelect: (productId: string) => void;
}

export function PlacedProductBox({
  product,
  orientation,
  cellPosition,
  scale,
  categoryColor,
  selected,
  invalid,
  active,
  onSelect,
}: PlacedProductBoxProps) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `product-${product.id}`,
    data: {
      type: 'product',
      productId: product.id,
    },
  });
  const size = getEffectiveProductSize(product, orientation);

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      data-testid={`placed-product-${product.id}`}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(product.id);
      }}
      style={{
        position: 'absolute',
        left: cellPosition.x * scale,
        bottom: cellPosition.y * scale,
        width: size.width * scale,
        height: size.height * scale,
        cursor: active ? 'grabbing' : 'grab',
        opacity: active ? 0.18 : 1,
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
        enforceMinimumFootprint={false}
        metadataTooltipDisabled={active}
      />
    </div>
  );
}
