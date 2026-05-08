import { useApi } from '@context/api/useApi';
import { Shelf } from '@lib/boardgame.api.client';
import { useCallback, useEffect, useState } from 'react';

export interface UseShelfDataResult {
  isError: boolean;
  isLoading: boolean;
  refreshShelves: () => Promise<void>;
  shelves: Shelf[];
}

export const useShelfData = (): UseShelfDataResult => {
  const api = useApi();
  const [shelves, setShelves] = useState<Shelf[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const refreshShelves = useCallback(async () => {
    setIsError(false);
    setIsLoading(true);

    try {
      const res = await api.shelf.shelfControllerFindAll();
      setShelves(res.data);
    } catch (err) {
      console.error('useShelfData: error getting data', err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [api.shelf]);

  useEffect(() => {
    void refreshShelves();
  }, [refreshShelves]);

  return {
    isError,
    isLoading,
    refreshShelves,
    shelves,
  };
};
