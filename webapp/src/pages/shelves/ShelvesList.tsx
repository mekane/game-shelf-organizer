import { useApi } from "@context/api";
import { Shelf } from "@lib/boardgame.api.client";
import {
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Stack,
} from "@mui/material";
import DeleteForever from "@mui/icons-material/DeleteForever";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
        // TODO: reload list
      })
      .catch((err) => {
        console.log("error deleting", err);
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  return isLoading ? (
    <CircularProgress />
  ) : (
    <List sx={{ width: "50%", margin: "auto", minWidth: 800 }}>
      {shelves.map((s) => (
        <ListItem key={s.id}>
          <ListItemText
            primary={s.name}
            secondary={`${s.shelves.length} shelves`}
          />
          <Stack direction="row" spacing={2}>
            <Button component={Link} variant="contained" to={`layout/${s.id}`}>
              Edit Shelf Layout
            </Button>
            <Button component={Link} variant="contained" to={`layout/${s.id}`}>
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
  );
};
