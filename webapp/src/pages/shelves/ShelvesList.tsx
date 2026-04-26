import { PageHeader } from "@components/PageHeader";
import { useApi } from "@context/api";
import { CreateShelfDto, Shelf } from "@lib/boardgame.api.client";
import DeleteForever from "@mui/icons-material/DeleteForever";
import {
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AddRoomDialog } from "./components";

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
          <List sx={{ width: "50%", margin: "auto", minWidth: 800 }}>
            {shelves.map((s) => (
              <ListItem key={s.id}>
                <ListItemText
                  primary={s.name}
                  secondary={`${s.room.size.width}" x ${s.room.size.height}"`}
                />
                <Stack direction="row" spacing={2}>
                  <Typography
                    sx={{ lineHeight: 2.5 }}
                  >{`${s.shelves.length} shelves`}</Typography>
                  <Button
                    component={Link}
                    variant="contained"
                    to={`layout/${s.id}`}
                  >
                    Edit Shelf Layout
                  </Button>
                  <Button
                    component={Link}
                    variant="contained"
                    to={`layout/${s.id}`}
                  >
                    Organize Games on Shelves
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      deleteRoom(s.id);
                    }}
                    loading={isDeleting}
                  >
                    <DeleteForever />
                  </Button>
                </Stack>
              </ListItem>
            ))}
          </List>
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
