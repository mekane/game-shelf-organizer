import { PageHeader } from '@components/PageHeader';
import { useApi } from '@context/api';
import { useEditDimensions } from '@context/useEditDimensions/useEditDimensions';
import { useCollectionData } from '@hooks/useCollectionData';
import { Sync } from '@mui/icons-material';
import { Alert, Button, CircularProgress, Container, Typography } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { CollectionList } from './components/CollectionList';

export const CollectionPage = () => {
  const api = useApi();
  const { showEditor } = useEditDimensions();

  const { isLoading, isError, refreshCollection, collection } = useCollectionData();

  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const syncCollection = async () => {
    console.log('Starting Sync');
    setIsSyncing(true);

    try {
      const res = await api.collection.collectionControllerSync();
      console.log('Done syncing collection from BGG', res);
      toast.success('Successfully synced collection from BGG');
      refreshCollection();
    } catch (err) {
      toast.error(`Error syncing collection from BGG: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Container>
      <PageHeader headerText="Manage Collection">
        <Button variant="contained" onClick={syncCollection} loading={isSyncing} startIcon={<Sync />}>
          Sync Collection
        </Button>
        {collection && <Typography>{`Last synced: ${collection.lastSyncDate}`}</Typography>}
      </PageHeader>

      {isError && <Alert color="error">Error loading Collection</Alert>}

      {isLoading && !collection ? (
        <CircularProgress />
      ) : (
        <CollectionList games={collection.games} editDimensions={showEditor} refreshGame={refreshCollection} />
      )}
    </Container>
  );
};
