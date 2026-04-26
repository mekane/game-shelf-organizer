import { Shelf } from "@lib/boardgame.api.client";
import DeleteForever from "@mui/icons-material/DeleteForever";
import {
  Button,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

export interface RoomListProps {
  shelves: Shelf[];
  deleteRoom: (id: string) => void;
  isDeleting: boolean;
}

export const RoomList = ({ shelves, deleteRoom, isDeleting }) => {
  return (
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
