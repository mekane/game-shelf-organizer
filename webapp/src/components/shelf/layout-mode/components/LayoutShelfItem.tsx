import { useDraggable } from '@dnd-kit/core';
import { forwardRef, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import type {
  CSSProperties,
  HTMLAttributes,
  MouseEvent as ReactMouseEvent,
} from 'react';
import type { Point2D, ShelfInput } from '../../common/types';
import {
  getCellRectInShelf,
  getShelfGridRect,
  getShelfRect,
  getShelfSize,
  toDomStyleRect,
} from '../../common/geometry';
import { SQUARE_SURFACE_RADIUS } from '../../common/styles/surfaces';

const SELECTED_BORDER_COLOR = '#c7852a';
const INVALID_BORDER_COLOR = '#d32f2f';
const DEFAULT_BORDER_COLOR = 'rgba(76, 58, 39, 0.28)';
const LABEL_BACKGROUND = 'linear-gradient(90deg, rgba(96, 67, 45, 0.92), rgba(142, 99, 60, 0.84))';
const INVALID_LABEL_BACKGROUND =
  'linear-gradient(90deg, rgba(199, 87, 58, 0.94), rgba(235, 146, 113, 0.86))';
const LABEL_TEXT_COLOR = '#ffffff';
const SHELF_FRAME_BACKGROUND =
  'linear-gradient(145deg, rgba(126, 95, 63, 0.98), rgba(88, 61, 37, 0.98))';

interface LayoutShelfVisualProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> {
  shelf: ShelfInput;
  workspaceHeight: number;
  scale: number;
  selected: boolean;
  invalid: boolean;
  active?: boolean;
  ghost?: boolean;
  interactive?: boolean;
  hoverRevealEnabled?: boolean;
  zIndex?: number;
  pointerEvents?: CSSProperties['pointerEvents'];
  positionOverride?: Point2D;
  dataTestId?: string;
  onClick?: () => void;
}

interface LayoutShelfItemProps
  extends Omit<
    LayoutShelfVisualProps,
    'interactive' | 'onClick' | 'onSelect' | 'style' | 'children'
  > {
  onSelect: (shelfId: number) => void;
}

export const LayoutShelfVisual = forwardRef<HTMLDivElement, LayoutShelfVisualProps>(
  function LayoutShelfVisual(
    {
      shelf,
      workspaceHeight,
      scale,
      selected,
      invalid,
      active = false,
      ghost = false,
      interactive = false,
      hoverRevealEnabled = true,
      zIndex,
      pointerEvents,
      positionOverride,
      dataTestId,
      onClick,
      onMouseEnter,
      onMouseLeave,
      style: styleProp,
      ...divProps
    },
    ref
  ) {
    const theme = useTheme();
    const [hovered, setHovered] = useState(false);
    const renderedShelf =
      positionOverride === undefined
        ? shelf
        : {
            ...shelf,
            position: positionOverride,
          };
    const shelfSize = getShelfSize(renderedShelf);
    const domRect = toDomStyleRect(getShelfRect(renderedShelf), workspaceHeight, scale);
    const gridDomRect = toDomStyleRect(
      getShelfGridRect(renderedShelf),
      shelfSize.height,
      scale
    );
    const showLabel = selected || (hoverRevealEnabled && hovered);
    const accentColor = selected
      ? SELECTED_BORDER_COLOR
      : invalid
        ? INVALID_BORDER_COLOR
        : DEFAULT_BORDER_COLOR;
    const cellBackground = theme.palette.background.paper;
    const cellOutline = `inset 0 0 0 1px ${theme.palette.divider}`;

    function handleMouseEnter(event: ReactMouseEvent<HTMLDivElement>) {
      onMouseEnter?.(event);
      if (hoverRevealEnabled) {
        setHovered(true);
      }
    }

    function handleMouseLeave(event: ReactMouseEvent<HTMLDivElement>) {
      onMouseLeave?.(event);
      setHovered(false);
    }

    return (
      <div
        ref={ref}
        {...divProps}
        data-testid={dataTestId}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          ...styleProp,
          position: 'absolute',
          left: domRect.x,
          top: domRect.y,
          width: domRect.width,
          height: domRect.height,
          borderRadius: SQUARE_SURFACE_RADIUS,
          overflow: 'hidden',
          cursor: interactive ? (active ? 'grabbing' : 'grab') : 'default',
          opacity: ghost ? 0 : active ? 0.78 : 1,
          pointerEvents: pointerEvents ?? (ghost ? 'none' : undefined),
          zIndex: zIndex ?? (active ? 2 : selected ? 1 : 0),
          boxShadow: invalid
            ? '0 20px 30px rgba(198, 62, 29, 0.18)'
            : '0 18px 26px rgba(77, 55, 35, 0.12)',
          background: SHELF_FRAME_BACKGROUND,
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
          }}
        >
          <div
            data-testid={`shelf-grid-${shelf.id}`}
            style={{
              position: 'absolute',
              left: gridDomRect.x,
              top: gridDomRect.y,
              width: gridDomRect.width,
              height: gridDomRect.height,
              pointerEvents: 'none',
            }}
          />

          {Array.from({ length: shelf.grid.rows }).map((_, rowIndex) =>
            Array.from({ length: shelf.grid.columns }).map((__, columnIndex) => {
              const cellRect = getCellRectInShelf(renderedShelf, {
                row: rowIndex,
                column: columnIndex,
              });
              const cellDomRect = toDomStyleRect(cellRect, shelfSize.height, scale);

              return (
                <div
                  key={`${shelf.id}-${rowIndex}-${columnIndex}`}
                  data-testid={`layout-shelf-cell-${shelf.id}-${rowIndex}-${columnIndex}`}
                  style={{
                    position: 'absolute',
                    left: cellDomRect.x,
                    top: cellDomRect.y,
                    width: cellDomRect.width,
                    height: cellDomRect.height,
                    background: cellBackground,
                    boxShadow: cellOutline,
                    pointerEvents: 'none',
                  }}
                />
              );
            })
          )}

          <div
            style={{
              position: 'absolute',
              inset: 0,
              boxShadow: `inset 0 0 0 3px ${accentColor}`,
              pointerEvents: 'none',
            }}
          />

          <div
            className="layout-shelf-label"
            data-testid={`shelf-label-${shelf.id}`}
            style={{
              position: 'absolute',
              top: 8,
              left: 8,
              maxWidth: 'calc(100% - 24px)',
              padding: '3.6px 8px',
              opacity: showLabel ? 1 : 0,
              transform: showLabel ? 'translateY(0)' : 'translateY(-4px)',
              transition: 'opacity 120ms ease, transform 120ms ease',
              background: invalid ? INVALID_LABEL_BACKGROUND : LABEL_BACKGROUND,
              boxShadow: '0 8px 16px rgba(68, 48, 29, 0.16)',
              pointerEvents: 'none',
              zIndex: 3,
            }}
          >
            <span
              style={{
                color: LABEL_TEXT_COLOR,
                fontWeight: 700,
                letterSpacing: '0.06em',
                lineHeight: 1.1,
                display: 'block',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontSize: 12,
              }}
            >
              {shelf.label ?? `Shelf ${shelf.id}`}
            </span>
          </div>

          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `
                linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.02)),
                linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0))
              `,
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />
        </div>
      </div>
    );
  }
);

export function LayoutShelfItem({
  shelf,
  workspaceHeight,
  scale,
  selected,
  invalid,
  active,
  onSelect,
  ghost = false,
  hoverRevealEnabled = true,
}: LayoutShelfItemProps) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `shelf-${shelf.id}`,
    data: {
      type: 'shelf',
      shelfId: shelf.id,
    },
  });

  return (
    <LayoutShelfVisual
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      shelf={shelf}
      workspaceHeight={workspaceHeight}
      scale={scale}
      selected={selected}
      invalid={invalid}
      active={active}
      ghost={ghost}
      interactive
      hoverRevealEnabled={hoverRevealEnabled}
      dataTestId={`shelf-${shelf.id}`}
      onClick={() => onSelect(shelf.id)}
    />
  );
}
