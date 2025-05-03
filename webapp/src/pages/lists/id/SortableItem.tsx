import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ListItem, ListItemText } from "@mui/material";
import { FC } from "react";

export interface SortableItemProps {
  id: number;
  name: string;
}

export const SortableItem: FC<SortableItemProps> = ({ id, name }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{
        background: "white",
        border: "1px solid #ccc",
        borderRadius: "4px",
        margin: "4px 8px",
      }}
    >
      <ListItemText>{name}</ListItemText>
    </ListItem>
  );
};
