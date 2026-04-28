import {
  LayoutChangeMeta,
  LayoutModeScreen,
  LayoutWorkspaceInput,
  ShelfInput,
} from "@components/shelf";
import { useApi } from "@context/api";
import { UpdateShelfDto } from "@lib/boardgame.api.client";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

interface LayoutConfig {
  name: string;
  room: LayoutWorkspaceInput;
  shelves: ShelfInput[];
}

export const ShelfLayout = () => {
  const { id } = useParams();
  const api = useApi();

  const [isLoading, setIsLoading] = useState(true);
  const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>(null);

  useEffect(() => {
    setIsLoading(true);

    api.shelf
      .shelfControllerFindOne(id)
      .then((res) => {
        console.log("api result for get " + id, res.data);
        const config = res.data;

        setLayoutConfig({
          name: config.name,
          room: {
            size: {
              height: config.room.size?.height ?? 96,
              width: config.room.size?.width ?? 96,
            },
            snapIncrement: 2,
          },
          shelves: config.shelves,
        });

        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        // TODO: show 404 error
      });
  }, [api, id]);

  const handleShelvesChange = async (
    nextShelves: ShelfInput[],
    meta: LayoutChangeMeta,
  ) => {
    console.log({
      meta: meta,
      payload: JSON.stringify(nextShelves),
    });

    // TODO: push to a history array to enable undo

    const updateShelfDto: UpdateShelfDto = {
      name: meta.name,
      room: {
        ...layoutConfig.room,
        size: meta.size,
      },
      shelves: nextShelves,
    };

    // TODO: debounce API requests in case user spams actions / undo
    try {
      await api.shelf.shelfControllerUpdate(id, updateShelfDto);

      setLayoutConfig((prev) => ({
        name: meta.name,
        room: {
          ...prev.room,
          size: meta.size,
        },
        shelves: nextShelves,
      }));

      toast.dismiss();
      toast.info("Saved");
    } catch (err) {
      console.error("error saving shelf state", err);
      toast.error(`Could not save shelves: ${err.message}`);
    }
  };

  return isLoading ? (
    <CircularProgress />
  ) : (
    <LayoutModeScreen
      name={layoutConfig.name}
      workspace={layoutConfig.room}
      shelves={layoutConfig.shelves}
      onShelvesChange={handleShelvesChange}
    />
  );
};
