import { useApi } from '@context/api/useApi';
import { List } from '@lib/boardgame.api.client';
import { useCallback, useEffect, useState } from 'react';

export interface UseListsDataResult {
  isError: boolean;
  isLoading: boolean;
  refreshList: () => Promise<void>;
  resetList: () => Promise<void>;
  top100List: List;
}

export const useTop100ListData = (): UseListsDataResult => {
  const api = useApi();
  const [top100List, setTop100List] = useState<List>();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const getTop100List = useCallback(async () => {
    const res = await api.list.listControllerFindAll();
    const lists = res.data;
    return lists[0];
  }, [api.list]);

  const deleteTop100List = useCallback(async () => {
    const list = await getTop100List();
    if (list) {
      await api.list.listControllerRemove(list.id);
    }
  }, [getTop100List, api.list]);

  const refreshList = useCallback(async () => {
    if (!api.collection || !api.list) {
      return;
    }

    setIsError(false);
    setIsLoading(true);

    try {
      const list = await getTop100List();

      if (list) {
        console.log('got list', list);
        setTop100List(list);
        return;
      }

      const collRes = await api.collection.collectionControllerGet();
      console.log('got collection', collRes.data);

      const include = collRes?.data?.games.filter((g) => g.showInCollection);
      console.log('including games', include);

      const played = include.filter((g) => g.plays > 0);
      console.log('filtering to games with plays', played);

      const games = played.map((g) => ({
        bggId: g.bggId,
        versionId: g.versionId,
      }));

      console.log('Initialize top 100 from games', games);

      // Create list and initialize it from collection
      // any game with at least one play
      const createRes = await api.list.listControllerCreate({ name: 'Top 100', games });
      const newList = createRes.data;

      setTop100List(newList);
    } catch (err) {
      console.error('useCollectionData: error getting data', err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [getTop100List, api.collection, api.list]);

  useEffect(() => {
    void refreshList();
  }, [refreshList]);

  return {
    isError,
    isLoading,
    refreshList,
    resetList: deleteTop100List,
    top100List,
  };
};
