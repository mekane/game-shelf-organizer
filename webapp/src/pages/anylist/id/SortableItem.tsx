import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AnylistColumns, AnylistOptions } from "@lib/boardgame.api.client";
import { ListItem } from "@mui/material";
import { FC } from "react";
import { ItemEditor } from "./ItemEditor";
import { ItemView } from "./ItemView";

export interface SortableItemProps {
  item: AnylistColumns;
  options: AnylistOptions;
  editable: boolean;
}

export const SortableItem: FC<SortableItemProps> = ({
  item,
  options,
  editable,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const saved = (data: any) => {
    console.log("row saved", data);
  };

  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{
        border: "1px solid #ccc",
        borderRadius: "3px",
        margin: "4px 0px",
        px: 0,
        py: 1.5,
      }}
    >
      {editable ? (
        <ItemEditor item={item} options={options} onSave={saved} />
      ) : (
        <ItemView item={item} options={options} />
      )}
    </ListItem>
  );
};
