import { AnylistColumns, AnylistOptions } from "@lib/boardgame.api.client";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { FC } from "react";

const RatingOutOfTen = (
  <Select>
    <MenuItem value={1}>1</MenuItem>
    <MenuItem value={2}>2</MenuItem>
    <MenuItem value={3}>3</MenuItem>
    <MenuItem value={4}>4</MenuItem>
    <MenuItem value={5}>5</MenuItem>
    <MenuItem value={6}>6</MenuItem>
    <MenuItem value={7}>7</MenuItem>
    <MenuItem value={8}>8</MenuItem>
    <MenuItem value={9}>9</MenuItem>
    <MenuItem value={10}>10</MenuItem>
  </Select>
);

export interface ItemEditorProps {
  item: AnylistColumns;
  options: AnylistOptions;
  onSave: (AnylistColumns) => void;
  onDelete: (string) => void;
}

export const ItemEditor: FC<ItemEditorProps> = ({
  item,
  options,
  onSave,
  onDelete,
}) => {
  function onSubmit(e) {
    const form = e.target;
    const name = form["name"].value ?? "";
    const rating = form["rating"].value ?? "";
    const notes = form["notes"].value ?? "";
    console.log(`AddRow name: ${name} ${rating} ${notes}`, e);
    onSave({ name, rating, notes });
  }

  function ratingChanged(e) {
    console.log("rating changed", e);
  }

  function deleteClicked(e) {
    onDelete(item.id);
  }

  const labelId = `row-${item.id}-rating-input-label`;

  return (
    <form onSubmit={onSubmit}>
      <Stack
        direction={"row"}
        sx={{ px: 1, width: "100%" }}
        spacing={1}
        className="item-editor"
      >
        <TextField name="name" value={item.name} />

        <FormControl>
          <InputLabel id={labelId}>Rating</InputLabel>
          <Select
            name="rating"
            labelId={labelId}
            id="demo-simple-select"
            value={item.rating}
            label="Rating"
            onChange={ratingChanged}
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
          </Select>
        </FormControl>

        <TextField type="text" name={"notes"}></TextField>

        <IconButton aria-label="Delete" onClick={deleteClicked}>
          <DeleteIcon />
        </IconButton>
      </Stack>
    </form>
  );
};
