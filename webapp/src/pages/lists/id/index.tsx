import { Paper } from "@mui/material";
import { FC } from "react";
import { ListEditor } from "./ListEditor";

export const EditListView: FC = () => {
  //TODO: get id from params

  // TODO: load this from server based on id
  const loadedItems = [
    { id: 1, name: "Item One" },
    { id: 2, name: "Item Two" },
    { id: 3, name: "Item Three" },
  ];

  return (
    <Paper>
      <ListEditor items={loadedItems} />
    </Paper>
  );
};
