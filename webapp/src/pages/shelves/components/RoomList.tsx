import { Shelf } from "@lib/boardgame.api.client";
import DeleteForever from "@mui/icons-material/DeleteForever";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
    <TableContainer component={Paper}>
      <Table sx={{ margin: "auto", minWidth: 800 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Size</TableCell>
            <TableCell align="right">Shelves</TableCell>
            <TableCell>Actions</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {shelves.map((s) => (
            <TableRow
              key={s.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Typography sx={{ fontWeight: 700 }}>{s.name}</Typography>
              </TableCell>
              <TableCell align="right">{`${s.room.size.width}" x ${s.room.size.height}"`}</TableCell>
              <TableCell align="right">{s.shelves.length}</TableCell>
              <TableCell>
                <Button
                  component={Link}
                  variant="contained"
                  to={`layout/${s.id}`}
                  sx={{ mr: 2 }}
                >
                  Edit Shelf Layout
                </Button>
                <Button
                  component={Link}
                  variant="contained"
                  to={`layout/${s.id}`}
                >
                  Organize Games
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    deleteRoom(s.id, s.name);
                  }}
                  loading={isDeleting}
                >
                  <DeleteForever />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
