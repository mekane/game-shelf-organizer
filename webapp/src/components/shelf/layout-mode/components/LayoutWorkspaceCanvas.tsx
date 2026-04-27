import { Alert, Box } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
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
  const theme = useTheme();
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
    border: `1px solid ${theme.palette.divider}`,
    overflow: 'hidden',
    backgroundColor: theme.palette.background.default,
    backgroundClip: 'padding-box',
    color: alpha(theme.palette.text.secondary, theme.palette.mode === 'dark' ? 0.34 : 0.4),
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
          border: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
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
                  color: theme.palette.text.secondary,
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
