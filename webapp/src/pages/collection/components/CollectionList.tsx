import { useApi } from '@context/api';
import { Dimensions } from '@context/useEditDimensions';
import { EditDimensionsContextType } from '@context/useEditDimensions/useEditDimensionsContext';
import { Game } from '@lib/boardgame.api.client';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { byName } from '../../../util';

export interface CollectionListProps {
  games: Game[];
  editDimensions: EditDimensionsContextType['showEditor'];
  refreshGame: (game: Game) => void;
}

export const CollectionList = ({ games, editDimensions, refreshGame }: CollectionListProps) => {
  const api = useApi();
  const [hiding, setHiding] = useState<number>(0);
  const [showing, setShowing] = useState<number>(0);

  const showEditor = async (game: Game) => {
    console.log('edit game', game.bggId);
    const d: Dimensions = await editDimensions({
      width: game.customWidth ?? game.width,
      height: game.customDepth ?? game.depth,
      length: game.customLength ?? game.length,
    });
    console.log('saving dimensions', d);

    await api.games.gamesControllerUpdate(game.bggId, game.versionId, {
      customWidth: d.width,
      customLength: d.length,
      customDepth: d.height,
    });

    refreshGame(game);
  };

  const hideGame = async (game: Game) => {
    setHiding(game.bggId);
    try {
      await api.games.gamesControllerUpdate(game.bggId, game.versionId, { showInCollection: false });
      refreshGame(game);
    } catch (err) {
      console.error(err);
    } finally {
      setHiding(0);
    }
  };

  const showGame = async (game: Game) => {
    setShowing(game.bggId);
    try {
      await api.games.gamesControllerUpdate(game.bggId, game.versionId, { showInCollection: true });
      refreshGame(game);
    } catch (err) {
      console.error(err);
    } finally {
      setShowing(0);
    }
  };

  const owned = games.filter((g) => g.owned);
  const shown = owned.filter((g) => g.showInCollection).sort(byName);
  const hidden = owned.filter((g) => !g.showInCollection).sort(byName);

  return (
    <>
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
              <TableCell align="right">Hide</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shown.map((g: Game) => (
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
                  <Tooltip title="Click to edit box dimensions">
                    <Box sx={{ cursor: 'pointer' }} onClick={() => showEditor(g)}>
                      {`${g.customLength ?? g.length} x ${g.customWidth ?? g.width} x ${g.customDepth ?? g.depth}`}
                    </Box>
                  </Tooltip>
                </TableCell>
                <TableCell align="right">{g.plays}</TableCell>
                <TableCell align="right">{g.rating}</TableCell>
                <TableCell align="right">{g.bggRating}</TableCell>
                <TableCell align="right">
                  <Button
                    loading={hiding === g.bggId}
                    onClick={() => {
                      hideGame(g);
                    }}
                  >
                    Hide
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ my: 2 }} />

      <Accordion disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography component="span">Hidden Games</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer component={Paper} sx={{ margin: 'auto', minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Cover</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Show</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {hidden.map((g: Game) => (
                  <TableRow
                    key={`${g.bggId}-${g.versionId}`}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>
                      <img src={g.thumbnailUrl} />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Typography
                        sx={{ fontWeight: 700 }}
                      >{`${g.name}${g.versionName ? ' (' + g.versionName + ')' : ''}`}</Typography>
                    </TableCell>
                    <TableCell>
                      <Button
                        loading={showing === g.bggId}
                        onClick={() => {
                          showGame(g);
                        }}
                      >
                        Show
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
    </>
  );
};
