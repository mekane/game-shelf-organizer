import { AnylistColumns, AnylistOptions } from "@lib/boardgame.api.client";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { FC } from "react";

const RatingOutOfFive = (
  <Select>
    <MenuItem value={1}>1</MenuItem>
    <MenuItem value={2}>2</MenuItem>
    <MenuItem value={3}>3</MenuItem>
    <MenuItem value={4}>4</MenuItem>
    <MenuItem value={5}>5</MenuItem>
  </Select>
);

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
}

export const ItemEditor: FC<ItemEditorProps> = ({ item, options, onSave }) => {
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

  const labelId = `row-${item.id}-rating-input-label`;

  return (
    <form onSubmit={onSubmit}>
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
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>

      <TextField type="text" name={"notes"}></TextField>

      <Button type="submit">Add</Button>
    </form>
  );
};
