import {
  InventoryChangeMeta,
  InventoryModeScreen,
  PlacementOutput,
} from "@components/shelf";
import { useApi } from "@context/api";
import { Shelf } from "@lib/boardgame.api.client";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const Organize = () => {
  const { id } = useParams();
  const api = useApi();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [shelfData, setShelfData] = useState<Shelf>(null);

  useEffect(() => {
    setIsLoading(true);

    api.shelf
      .shelfControllerFindOne(id)
      .then((res) => {
        setShelfData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(`Error loading room ${id}: ${err.message}`, err);

        // TODO: show a "not found" alert instead

        if (err.status === 404) {
          navigate("/404");
        }
      });
  }, [api, id]);

  const gameCategories = {
    solo: { id: "solo", name: "Solo", color: "#ccf" },
  };

  const products = [];

  const gameUpdated = (
    nextPlacements: PlacementOutput,
    meta: InventoryChangeMeta,
  ) => {
    console.log(meta);
    console.log(nextPlacements);
  };

  // TODO: this needs to be loaded from the api
  const placements = {};

  return isLoading ? (
    <CircularProgress />
  ) : (
    <InventoryModeScreen
      copy={{
        holdingAreaTitle: "Games",
        holdingAreaDescription: "Waiting to be shelved",
        productDetailsTitle: "Game Details",
      }}
      name={shelfData?.name}
      shelves={shelfData?.shelves ?? []}
      categories={gameCategories}
      products={products}
      placements={placements}
      onPlacementsChange={gameUpdated}
    />
  );
};
