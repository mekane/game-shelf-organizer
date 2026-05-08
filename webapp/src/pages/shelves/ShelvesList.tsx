import { PageHeader } from '@components/PageHeader';
import { useApi } from '@context/api';
import { useConfirm } from '@context/useConfirm/useConfirm';
import { useShelfData } from '@hooks/useShelfData';
import { CreateShelfDto } from '@lib/boardgame.api.client';
import AddIcon from '@mui/icons-material/Add';
import { Alert, Button, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { AddRoomDialog } from './components';
import { RoomList } from './components/RoomList';

export const ShelvesList = () => {
  const api = useApi();
  const { confirm, setLoading, close: closeConfirm } = useConfirm();

  const { isLoading, isError, refreshShelves, shelves } = useShelfData();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteRoom = async (roomId, name: string) => {
    const confirmDelete = await confirm({
      title: 'Confirm Delete',
      description: `Are you sure you want to delete ${name}?`,
      actionText: 'Delete',
      color: 'error',
    });

    if (!confirmDelete) {
      return;
    }

    try {
      await api.shelf.shelfControllerRemove(roomId);
      refreshShelves();
      toast.success(`${name} was deleted`);
    } catch (err) {
      toast.error(`Could not delete ${name}: ${err.message}`);
      console.error('error deleting', err);
    } finally {
      setLoading(false);
      setIsDeleting(false);
      closeConfirm();
    }
  };

  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const openNewDialog = () => {
    setNewDialogOpen(true);
  };

  const handleClose = () => {
    setNewDialogOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());

    setIsSubmittingForm(true);

    const createDto: CreateShelfDto = {
      name: formJson.name as string,
      room: {
        size: {
          width: Number(formJson.width),
          height: Number(formJson.height),
        },
      },
      shelves: [],
    };

    try {
      await api.shelf.shelfControllerCreate(createDto);
      handleClose();
      refreshShelves();
      toast.success(`${createDto.name} was added`);
    } catch (err) {
      console.log('error submitting add room form', err);
      toast.error(`Could not add room ${createDto.name}: ${err.message}}`);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  return (
    <>
      <PageHeader headerText="Shelves">
        <Button variant="contained" onClick={openNewDialog} startIcon={<AddIcon />}>
          Add New Room
        </Button>
      </PageHeader>

      {isError && <Alert color="error">Error loading list of rooms</Alert>}

      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <RoomList shelves={shelves} deleteRoom={deleteRoom} isDeleting={isDeleting} />
          <AddRoomDialog
            open={newDialogOpen}
            handleClose={handleClose}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmittingForm}
          />
        </>
      )}
    </>
  );
};
