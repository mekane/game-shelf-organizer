import {
  DndContext,
  MouseSensor,
  type DragCancelEvent,
  type DragEndEvent,
  type DragMoveEvent,
  type DragStartEvent,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Chip,
  Stack,
} from '@mui/material';
import { ScreenLayout } from '../common/components';
import {
  LAYOUT_SNAP_THRESHOLD_PX,
  WORKSPACE_SCALE,
  buildDefaultShelf,
  getInvalidShelfIds,
  snapShelfPosition,
  updateShelf,
} from '../common/geometry';
import type {
  LayoutChangeReason,
  LayoutModeProps,
  Point2D,
  ShelfId,
  ShelfInput,
} from '../common/types';
import { LayoutSidebar } from './components/LayoutSidebar';
import { LayoutWorkspaceCanvas } from './components/LayoutWorkspaceCanvas';

export function LayoutModeScreen({
  workspace,
  shelves,
  onShelvesChange,
}: LayoutModeProps) {
  const sensors = useSensors(useSensor(MouseSensor, { activationConstraint: { distance: 5 } }));
  const [draftShelves, setDraftShelves] = useState(shelves);
  const [selectedShelfId, setSelectedShelfId] = useState<ShelfId | null>(
    shelves[0]?.id ?? null
  );
  const [activeShelfId, setActiveShelfId] = useState<ShelfId | null>(null);
  const [dragPreviewPosition, setDragPreviewPosition] = useState<Point2D | null>(null);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const dragOriginRef = useRef<ShelfInput | null>(null);
  const dragPreviewRef = useRef<Point2D | null>(null);
  const draftShelvesRef = useRef(shelves);

  useEffect(() => {
    setDraftShelves(shelves);
    draftShelvesRef.current = shelves;
  }, [shelves]);

  useEffect(() => {
    setSelectedShelfId((current) => {
      if (current && draftShelves.some((shelf) => shelf.id === current)) {
        return current;
      }

      if (current === null && draftShelves.length > 0) {
        return null;
      }

      return draftShelves[0]?.id ?? null;
    });
  }, [draftShelves]);

  const presentedShelves = useMemo(() => {
    if (!activeShelfId || !dragPreviewPosition) {
      return draftShelves;
    }

    return updateShelf(draftShelves, activeShelfId, (shelf) => ({
      ...shelf,
      position: dragPreviewPosition,
    }));
  }, [activeShelfId, dragPreviewPosition, draftShelves]);
  const invalidShelfIds = useMemo(
    () => getInvalidShelfIds(presentedShelves, workspace),
    [presentedShelves, workspace]
  );
  const selectedShelf = useMemo(
    () => presentedShelves.find((shelf) => shelf.id === selectedShelfId),
    [presentedShelves, selectedShelfId]
  );
  const previewShelf = useMemo(() => {
    if (!activeShelfId || !dragPreviewPosition) {
      return null;
    }

    return presentedShelves.find((shelf) => shelf.id === activeShelfId) ?? null;
  }, [activeShelfId, dragPreviewPosition, presentedShelves]);
  const warningMessage = useMemo(() => {
    if (selectedShelf && invalidShelfIds.has(selectedShelf.id)) {
      return 'This shelf is currently invalid. Invalid positions stay visible locally until corrected, but they are not emitted to the parent callback.';
    }

    if (invalidShelfIds.size > 0) {
      return `${invalidShelfIds.size} shelf state${invalidShelfIds.size === 1 ? ' is' : 's are'} currently invalid.`;
    }

    return null;
  }, [invalidShelfIds, selectedShelf]);
  const workspaceWarningMessage =
    invalidShelfIds.size > 0
      ? 'Invalid shelf changes are kept locally for correction, but no layout callback is fired until the full shelf set is valid again.'
      : null;

  function clearDragPreviewState() {
    dragOriginRef.current = null;
    dragPreviewRef.current = null;
    setDragPreviewPosition(null);
    setActiveShelfId(null);
  }

  function commitShelves(
    nextShelves: ShelfInput[],
    reason: LayoutChangeReason,
    shelfId?: ShelfId
  ) {
    draftShelvesRef.current = nextShelves;
    setDraftShelves(nextShelves);

    if (getInvalidShelfIds(nextShelves, workspace).size === 0) {
      onShelvesChange(nextShelves, {
        reason,
        shelfId,
      });
    }
  }

  function handleUpdateSelectedShelf(updater: (shelf: ShelfInput) => ShelfInput) {
    if (!selectedShelfId) {
      return;
    }

    commitShelves(
      updateShelf(draftShelves, selectedShelfId, updater),
      'update-shelf',
      selectedShelfId
    );
  }

  function handleAddShelf() {
    const nextShelf = buildDefaultShelf(draftShelves);
    const nextShelves = [...draftShelves, nextShelf];
    setSelectedShelfId(nextShelf.id);
    commitShelves(nextShelves, 'add-shelf', nextShelf.id);
  }

  function handleConfirmRemove() {
    if (!selectedShelfId) {
      setShowRemoveDialog(false);
      return;
    }

    const nextShelves = draftShelves.filter((shelf) => shelf.id !== selectedShelfId);
    setShowRemoveDialog(false);
    commitShelves(nextShelves, 'remove-shelf', selectedShelfId);
  }

  function handleDragStart(event: DragStartEvent) {
    const shelfId = event.active.data.current?.shelfId as ShelfId | undefined;

    if (!shelfId) {
      return;
    }

    const shelf = draftShelves.find((entry) => entry.id === shelfId);

    if (!shelf) {
      return;
    }

    dragOriginRef.current = shelf;
    dragPreviewRef.current = shelf.position;
    setSelectedShelfId(shelfId);
    setDragPreviewPosition(shelf.position);
    setActiveShelfId(shelfId);
  }

  function handleDragMove(event: DragMoveEvent) {
    const shelfId = event.active.data.current?.shelfId as ShelfId | undefined;

    if (!shelfId || !dragOriginRef.current) {
      return;
    }

    const currentShelves = draftShelvesRef.current;
    const currentShelf = currentShelves.find((shelf) => shelf.id === shelfId);

    if (!currentShelf) {
      return;
    }

    const thresholdInches = LAYOUT_SNAP_THRESHOLD_PX / WORKSPACE_SCALE;
    const releaseThresholdInches = thresholdInches + workspace.snapIncrement / 2;
    const rawPosition = {
      x: dragOriginRef.current.position.x + event.delta.x / WORKSPACE_SCALE,
      y: dragOriginRef.current.position.y - event.delta.y / WORKSPACE_SCALE,
    };
    const snappedPosition = snapShelfPosition(
      rawPosition,
      currentShelf,
      currentShelves,
      workspace,
      thresholdInches,
      {
        previousPosition: dragPreviewRef.current ?? currentShelf.position,
        releaseThresholdInches,
      }
    );

    dragPreviewRef.current = snappedPosition;
    setDragPreviewPosition(snappedPosition);
  }

  function handleDragEnd(event: DragEndEvent) {
    const shelfId = event.active.data.current?.shelfId as ShelfId | undefined;
    const previewPosition = dragPreviewRef.current;

    clearDragPreviewState();

    if (!shelfId || !previewPosition) {
      return;
    }

    commitShelves(
      updateShelf(draftShelvesRef.current, shelfId, (shelf) => ({
        ...shelf,
        position: previewPosition,
      })),
      'move-shelf',
      shelfId
    );
  }

  function handleDragCancel(_event: DragCancelEvent) {
    clearDragPreviewState();
  }

  return (
    <>
      <ScreenLayout
        eyebrow="Layout Mode"
        title="Shelf Arrangement"
        subtitle="Configure and position shelves"
        headerSupplement={
          <Stack
            data-testid="layout-summary-chips"
            direction="row"
            spacing={1}
            useFlexGap
            sx={{ flexWrap: 'wrap' }}
          >
            <Chip
              label={`Workspace ${workspace.size.width}" × ${workspace.size.height}"`}
              variant="outlined"
            />
            <Chip
              label={`Grid ${workspace.snapIncrement}" snap`}
              variant="outlined"
              color="secondary"
            />
            <Chip
              label={`${
                draftShelves.length
              } shel${draftShelves.length === 1 ? 'f' : 'ves'}`}
              variant="outlined"
            />
          </Stack>
        }
        sidebar={
          <LayoutSidebar
            selectedShelf={selectedShelf}
            warningMessage={warningMessage}
            onAddShelf={handleAddShelf}
            onRemoveShelf={() => setShowRemoveDialog(true)}
            onUpdateShelf={handleUpdateSelectedShelf}
          />
        }
      >
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <LayoutWorkspaceCanvas
            workspace={workspace}
            shelves={draftShelves}
            previewShelf={previewShelf}
            selectedShelfId={selectedShelfId}
            invalidShelfIds={invalidShelfIds}
            activeShelfId={activeShelfId}
            scale={WORKSPACE_SCALE}
            warningMessage={workspaceWarningMessage}
            onSelectShelf={setSelectedShelfId}
            onClearSelection={() => setSelectedShelfId(null)}
          />
        </DndContext>
      </ScreenLayout>

      <Dialog open={showRemoveDialog} onClose={() => setShowRemoveDialog(false)}>
        <DialogTitle>Remove Shelf</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Remove {selectedShelf?.label ?? 'the selected shelf'} from the layout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRemoveDialog(false)}>Cancel</Button>
          <Button color="error" onClick={handleConfirmRemove}>
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
