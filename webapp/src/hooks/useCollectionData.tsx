import { useApi } from "@context/api/useApi";
import { Collection } from "@lib/boardgame.api.client";
import { useCallback, useEffect, useState } from "react";

export interface UseCollectionDataResult {
  isError: boolean;
  isLoading: boolean;
  refreshCollection: () => Promise<void>;
  collection: Collection;
}

export const useCollectionData = (): UseCollectionDataResult => {
  const api = useApi();
  const [collection, setCollection] = useState<Collection>();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const refreshCollection = useCallback(async () => {
    setIsError(false);
    setIsLoading(true);

    try {
      const res = await api.collection.collectionControllerGet();
      setCollection(res.data);
    } catch (err) {
      console.error("useCollectionData: error getting data", err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [api.collection]);

  useEffect(() => {
    void refreshCollection();
  }, [api.collection, refreshCollection]);

  return {
    isError,
    isLoading,
    refreshCollection,
    collection,
  };
};
