import { Alert, Box } from '@mui/material';
import type { CSSProperties } from 'react';
import { getLayoutWorkspaceGridStyles, SQUARE_SURFACE_RADIUS } from '../../common/styles/surfaces';
import type { LayoutWorkspaceInput, ShelfId, ShelfInput } from '../../common/types';
import { LayoutShelfItem, LayoutShelfVisual } from './LayoutShelfItem';

const LAYOUT_WORKSPACE_BORDER_PX = 1;
const LAYOUT_FRAME_PADDING_PX = 12;
const LAYOUT_FRAME_BORDER_PX = 1;

interface LayoutWorkspaceCanvasProps {
  workspace: LayoutWorkspaceInput;
  shelves: ShelfInput[];
  previewShelf?: ShelfInput | null;
  selectedShelfId: ShelfId | null;
  invalidShelfIds: Set<ShelfId>;
  activeShelfId: ShelfId | null;
  scale: number;
  warningMessage?: string | null;
  onSelectShelf: (shelfId: ShelfId) => void;
  onClearSelection: () => void;
}

export function LayoutWorkspaceCanvas({
  workspace,
  shelves,
  previewShelf,
  selectedShelfId,
  invalidShelfIds,
  activeShelfId,
  scale,
  warningMessage,
  onSelectShelf,
  onClearSelection,
}: LayoutWorkspaceCanvasProps) {
  const workspaceWidth = workspace.size.width * scale;
  const workspaceHeight = workspace.size.height * scale;
  const workspaceFrameWidth =
    workspaceWidth +
    LAYOUT_WORKSPACE_BORDER_PX * 2 +
    LAYOUT_FRAME_PADDING_PX * 2 +
    LAYOUT_FRAME_BORDER_PX * 2;
  const workspaceStyle: CSSProperties = {
    position: 'relative',
    boxSizing: 'content-box',
    width: workspaceWidth,
    height: workspaceHeight,
    border: '1px solid rgba(95, 72, 50, 0.16)',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.72)',
    backgroundClip: 'padding-box',
    ...getLayoutWorkspaceGridStyles(workspace, scale),
  };

  return (
    <Box sx={{ display: 'grid', alignItems: 'start' }}>
      {warningMessage ? (
        <Alert
          variant="filled"
          severity="warning"
          sx={{
            gridArea: '1 / 1',
            alignSelf: 'start',
            justifySelf: { xs: 'stretch', sm: 'end' },
            width: 'fit-content',
            maxWidth: 'calc(100% - 24px)',
            zIndex: 1,
            mt: 1.5,
            mx: 1.5,
            boxShadow: '0 16px 28px rgba(91, 63, 33, 0.18)',
            pointerEvents: 'none',
          }}
        >
          {warningMessage}
        </Alert>
      ) : null}

      <Box
        data-testid="layout-workspace-frame"
        sx={{
          gridArea: '1 / 1',
          width: '100%',
          maxWidth: workspaceFrameWidth,
          overflow: 'auto',
          borderRadius: SQUARE_SURFACE_RADIUS,
          border: '1px solid rgba(95, 72, 50, 0.2)',
          background:
            'linear-gradient(180deg, rgba(250,247,241,0.96), rgba(244,236,225,0.92))',
          p: 1.5,
        }}
      >
        <div
          data-testid="layout-workspace"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && activeShelfId === null) {
              onClearSelection();
            }
          }}
          style={workspaceStyle}
        >
          {shelves.length === 0 ? (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'grid',
                placeItems: 'center',
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  color: 'rgba(77, 53, 36, 0.68)',
                  fontSize: 16,
                  lineHeight: 1.5,
                }}
              >
                Add a shelf to begin shaping the layout.
              </div>
            </div>
          ) : null}

          {shelves.map((shelf) => (
            <LayoutShelfItem
              key={shelf.id}
              shelf={shelf}
              workspaceHeight={workspace.size.height}
              scale={scale}
              selected={selectedShelfId === shelf.id}
              invalid={previewShelf?.id === shelf.id ? false : invalidShelfIds.has(shelf.id)}
              active={activeShelfId === shelf.id && previewShelf?.id !== shelf.id}
              ghost={previewShelf?.id === shelf.id}
              hoverRevealEnabled={activeShelfId === null}
              onSelect={onSelectShelf}
            />
          ))}

          {previewShelf ? (
            <LayoutShelfVisual
              shelf={previewShelf}
              workspaceHeight={workspace.size.height}
              scale={scale}
              selected={selectedShelfId === previewShelf.id}
              invalid={invalidShelfIds.has(previewShelf.id)}
              hoverRevealEnabled={false}
              pointerEvents="none"
              zIndex={3}
            />
          ) : null}
        </div>
      </Box>
    </Box>
  );
}
