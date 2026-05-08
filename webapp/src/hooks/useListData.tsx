import { useApi } from '@context/api/useApi';
import { List } from '@lib/boardgame.api.client';
import { useCallback, useEffect, useState } from 'react';

export interface UseListsDataResult {
  isError: boolean;
  isLoading: boolean;
  refreshLists: () => Promise<void>;
  lists: List[];
}

export const useListsData = (): UseListsDataResult => {
  const api = useApi();
  const [lists, setLists] = useState<List[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const refreshLists = useCallback(async () => {
    setIsError(false);
    setIsLoading(true);

    try {
      const res = await api.list.listControllerFindAll();
      setLists(res.data);
    } catch (err) {
      console.error('useCollectionData: error getting data', err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [api.list]);

  useEffect(() => {
    void refreshLists();
  }, [refreshLists]);

  return {
    isError,
    isLoading,
    refreshLists,
    lists,
  };
};
