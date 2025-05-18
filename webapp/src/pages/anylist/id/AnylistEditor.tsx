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
import { AnylistDto } from "@lib/boardgame.api.client";
import {
  Button,
  FormControlLabel,
  FormGroup,
  List,
  Stack,
  Switch,
} from "@mui/material";
import { FC, SyntheticEvent, useState } from "react";
import { getMaxId } from "../util";
import { SortableItem } from "./SortableItem";

export interface AnylistEditorProps {
  list: AnylistDto;
}

export const AnylistEditor: FC<AnylistEditorProps> = ({ list }) => {
  const [sortedItems, setItems] = useState(list.data);
  const [editable, setEditable] = useState(false);

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

  function toggleEditable(e: SyntheticEvent) {
    console.log(e.target);
    setEditable(!editable);
  }

  function addRow(e: SyntheticEvent) {
    const nextId = getMaxId(sortedItems);
    setItems(
      sortedItems.concat({
        id: String(nextId),
        name: "",
        rating: 1,
        notes: "",
        thumbnail: "",
      })
    );
  }

  return (
    <>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <h2>{list.name}</h2>
        <FormGroup>
          <FormControlLabel
            control={<Switch onChange={toggleEditable} checked={editable} />}
            label="Edit"
          />
        </FormGroup>
      </Stack>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sortedItems}
          strategy={verticalListSortingStrategy}
        >
          <List sx={{ pt: 0 }}>
            {sortedItems.map((item) => (
              <SortableItem
                key={item.id}
                item={item}
                options={list.options}
                editable={editable}
              />
            ))}
          </List>
        </SortableContext>
      </DndContext>
      <Stack direction={"row"} justifyContent={"flex-end"}>
        <Button variant="contained" onClick={addRow}>
          Add Row
        </Button>
      </Stack>
    </>
  );
};
