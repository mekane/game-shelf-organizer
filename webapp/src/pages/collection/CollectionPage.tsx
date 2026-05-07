import { PageHeader } from "@components/PageHeader";
import { useApi } from "@context/api";
import { useEditDimensions } from "@context/useEditDimensions/useEditDimensions";
import { Collection, Game } from "@lib/boardgame.api.client";
import { Sync } from "@mui/icons-material";
import { Button, CircularProgress, Container, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CollectionList } from "./components/CollectionList";

export const CollectionPage = () => {
  const api = useApi();
  const { showEditor } = useEditDimensions();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [collection, setCollection] = useState<Collection>();

  const loadCollection = useCallback(() => {
    setIsLoading(true);
    api.collection
      .collectionControllerGet()
      .then((res) => {
        setCollection(res.data);
      })
      .catch((err) => {
        toast.error(`Error loading collection: ${err.message}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [api]);

  useEffect(() => {
    loadCollection();
  }, [loadCollection]);

  const syncCollection = async () => {
    console.log("Starting Sync");
    setIsSyncing(true);

    try {
      const res = await api.collection.collectionControllerSync();
      console.log("Done syncing collection from BGG", res);
      toast.success("Successfully synced collection from BGG");
      loadCollection();
    } catch (err) {
      toast.error(`Error syncing collection from BGG: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const refreshGame = async (game: Game) => {
    const { data: updated } = await api.games.gamesControllerFindOne(
      game.bggId,
      game.versionId,
    );

    const targetIndex = collection.games.findIndex(
      (g) => g.bggId === updated.bggId && g.versionId === updated.versionId,
    );

    const newGames = collection.games.map((g, i) =>
      i === targetIndex ? { ...g, ...updated } : g,
    );

    if (targetIndex !== -1) {
      setCollection((prev) => ({
        ...prev,
        games: newGames,
      }));
    }
  };

  return (
    <Container>
      <PageHeader headerText="Manage Collection">
        <Button
          variant="contained"
          onClick={syncCollection}
          loading={isSyncing}
          startIcon={<Sync />}
        >
          Sync Collection
        </Button>
        {collection && (
          <Typography>{`Last synced: ${collection.lastSyncDate}`}</Typography>
        )}
      </PageHeader>

      {isLoading ? (
        <CircularProgress />
      ) : (
        <CollectionList
          games={collection.games}
          editDimensions={showEditor}
          refreshGame={refreshGame}
        />
      )}
    </Container>
  );
};
