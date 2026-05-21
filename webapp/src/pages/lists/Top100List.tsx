import { PageHeader } from '@components/PageHeader';
import { useTop100ListData } from '@hooks/useTop100ListData';
import { Game } from '@lib/boardgame.api.client';
import {
  Alert,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { byName } from '../../util';

export const Top100List = () => {
  const { isLoading, isError, resetList, top100List } = useTop100ListData();

  const games = top100List?.games?.filter((g) => g.owned && g.showInCollection).sort(byName);

  return isLoading ? (
    <CircularProgress />
  ) : (
    <>
      <PageHeader headerText="Top 100 List">
        <Button onClick={() => resetList()}>Reset List</Button>
      </PageHeader>
      {isError && <Alert color="error">Error loading Top 100 List</Alert>}
      <TableContainer component={Paper} sx={{ margin: 'auto', minWidth: 800 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Cover</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="right">Year</TableCell>
              <TableCell align="right">Size</TableCell>
              <TableCell align="right">Plays</TableCell>
              <TableCell align="right">Rating</TableCell>
              <TableCell align="right">BGG Rating</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {games.map((g: Game) => (
              <TableRow key={`${g.bggId}-${g.versionId}`} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>
                  <img src={g.thumbnailUrl} />
                </TableCell>
                <TableCell component="th" scope="row">
                  <Typography
                    sx={{ fontWeight: 700 }}
                  >{`${g.name}${g.versionName ? ' (' + g.versionName + ')' : ''}`}</Typography>
                </TableCell>

                <TableCell align="right">{g.yearPublished}</TableCell>
                <TableCell align="right">
                  {`${g.customLength ?? g.length} x ${g.customWidth ?? g.width} x ${g.customDepth ?? g.depth}`}
                </TableCell>
                <TableCell align="right">{g.plays}</TableCell>
                <TableCell align="right">{g.rating}</TableCell>
                <TableCell align="right">{g.bggRating}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
