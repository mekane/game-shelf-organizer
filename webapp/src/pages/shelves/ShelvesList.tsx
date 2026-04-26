import { PageHeader } from "@components/PageHeader";
import { useApi } from "@context/api";
import { CreateShelfDto, Shelf } from "@lib/boardgame.api.client";
import { Button, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { AddRoomDialog } from "./components";
import { RoomList } from "./components/RoomList";

export const ShelvesList = () => {
  const api = useApi();

  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [shelves, setShelves] = useState<Shelf[]>([]);

  const loadShelfList = () => {
    setIsLoading(true);
    api.shelf.shelfControllerFindAll().then((res) => {
      console.log("api result for shelves fetch", res.data);
      setShelves(res.data);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    loadShelfList();
  }, [api]);

  //TODO: add confirmation step
  const deleteRoom = (roomId) => {
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
    const formJson = Object.fromEntries((formData as any).entries());

    setIsSubmittingForm(true);

    const createDto: CreateShelfDto = {
      name: formJson.name,
      room: {
        size: {
          width: formJson.width,
          height: formJson.height,
        },
      },
      shelves: [],
    };

    console.log("submitting form", createDto);

    const apiRes = await api.shelf
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

  const addShelfButton = (
    <Button variant="contained" onClick={openNewDialog}>
      Add New Room
    </Button>
  );

  return (
    <>
      <PageHeader headerText="Shelves">{addShelfButton}</PageHeader>
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
