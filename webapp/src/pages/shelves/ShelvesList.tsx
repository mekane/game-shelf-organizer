import { PageHeader } from "@components/PageHeader";
import { useApi } from "@context/api";
import { useConfirm } from "@context/useConfirm/useConfirm";
import { CreateShelfDto, Shelf } from "@lib/boardgame.api.client";
import AddIcon from "@mui/icons-material/Add";
import { Button, CircularProgress } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { AddRoomDialog } from "./components";
import { RoomList } from "./components/RoomList";

export const ShelvesList = () => {
  const api = useApi();
  const { confirm, setLoading, close: closeConfirm } = useConfirm();

  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [shelves, setShelves] = useState<Shelf[]>([]);

  const loadShelfList = useCallback(() => {
    setIsLoading(true);
    api.shelf.shelfControllerFindAll().then((res) => {
      console.log("api result for shelves fetch", res.data);
      setShelves(res.data);
      setIsLoading(false);
    });
  }, [api]);

  useEffect(() => {
    loadShelfList();
  }, [loadShelfList]);

  const deleteRoom = async (roomId, name: string) => {
    const confirmDelete = await confirm({
      title: "Confirm Delete",
      description: `Are you sure you want to delete ${name}?`,
      actionText: "Delete",
      color: "error",
    });

    if (!confirmDelete) {
      return;
    }

    try {
      api.shelf
        .shelfControllerRemove(roomId)
        .then((res) => {
          console.log("deleted");
          loadShelfList();
        })
        .catch((err) => {
          console.log("error deleting", err);
        })
        .finally(() => {
          setIsDeleting(false);
        });
    } catch (err) {
      setLoading(false);
    } finally {
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

    console.log("submitting form", createDto);

    await api.shelf
      .shelfControllerCreate(createDto)
      .then((res) => {
        console.log("success");
        handleClose();
        loadShelfList();
      })
      .catch((err) => {
        console.log("error submitting form", err);
      })
      .finally(() => {
        setIsSubmittingForm(false);
      });
  };

  return (
    <>
      <PageHeader headerText="Shelves">
        <Button
          variant="contained"
          onClick={openNewDialog}
          startIcon={<AddIcon />}
        >
          Add New Room
        </Button>
      </PageHeader>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <RoomList
            shelves={shelves}
            deleteRoom={deleteRoom}
            isDeleting={isDeleting}
          />
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
