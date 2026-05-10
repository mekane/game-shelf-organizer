import { useTop100ListData } from '@hooks/useTop100ListData';
import { Alert, CircularProgress } from '@mui/material';

export const Top100List = () => {
  const { isLoading, isError, resetList, top100List } = useTop100ListData();

  return isLoading ? (
    <CircularProgress />
  ) : (
    <>
    <PageHeader headerText="Top 100 List">
      <Button onClick={() => resetList()}>Reset List</Button>
    </PageHeader>
      {isError && <Alert color="error">Error loading Top 100 List</Alert>}

      <pre>{JSON.stringify(top100List)}</pre>
    </>
  );
};
