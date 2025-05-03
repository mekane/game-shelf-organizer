import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { List } from "@mui/material";
import { FC, useState } from "react";
import { SortableItem } from "./SortableItem";

export interface ListEditorProps {
  items: { id: number; name: string }[];
}

export const ListEditor: FC<ListEditorProps> = ({ items }) => {
  const [sortedItems, setItems] = useState(items);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: { active: any; over: any }) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = sortedItems.findIndex((i) => i.id === active.id);
      const newIndex = sortedItems.findIndex((i) => i.id === over.id);

      setItems(arrayMove(sortedItems, oldIndex, newIndex));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sortedItems}
        strategy={verticalListSortingStrategy}
      >
        <List sx={{ width: "90%" }}>
          {sortedItems.map((item) => (
            <SortableItem key={item.id} id={item.id} name={item.name} />
          ))}
        </List>
      </SortableContext>
    </DndContext>
  );
};
