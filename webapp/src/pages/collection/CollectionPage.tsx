import { PageHeader } from "@components/PageHeader";
import { useApi } from "@context/api";
import { Collection } from "@lib/boardgame.api.client";
import { Sync } from "@mui/icons-material";
import { Button, CircularProgress, Container, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const CollectionPage = () => {
  const api = useApi();

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
        <div>{JSON.stringify(collection)}</div>
      )}
    </Container>
  );
};
