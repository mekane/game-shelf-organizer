import { useApi } from "@context/api";
import { Dimensions } from "@context/useEditDimensions";
import { EditDimensionsContextType } from "@context/useEditDimensions/useEditDimensionsContext";
import { Game } from "@lib/boardgame.api.client";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";

export interface CollectionListProps {
  games: Game[];
  editDimensions: EditDimensionsContextType["showEditor"];
  refreshGame: (game: Game) => void;
}

export const CollectionList = ({
  games,
  editDimensions,
  refreshGame,
}: CollectionListProps) => {
  const api = useApi();

  const showEditor = async (game: Game) => {
    console.log("edit game", game.bggId);
    const d: Dimensions = await editDimensions({
      width: game.customWidth ?? game.width,
      height: game.customDepth ?? game.depth,
      length: game.customLength ?? game.length,
    });
    console.log("saving dimensions", d);

    await api.games.gamesControllerUpdate(game.bggId, game.versionId, {
      customWidth: d.width,
      customLength: d.length,
      customDepth: d.height,
    });

    refreshGame(game);
  };

  return (
    <TableContainer component={Paper} sx={{ margin: "auto", minWidth: 800 }}>
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
          {games
            .filter((g: Game) => g.owned)
            .map((g: Game) => (
              <TableRow
                key={`${g.bggId}-${g.versionId}`}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>
                  <img src={g.thumbnailUrl} />
                </TableCell>
                <TableCell component="th" scope="row">
                  <Typography
                    sx={{ fontWeight: 700 }}
                  >{`${g.name}${g.versionName ? " (" + g.versionName + ")" : ""}`}</Typography>
                </TableCell>

                <TableCell align="right">{g.yearPublished}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Click to edit box dimensions">
                    <Box
                      sx={{ cursor: "pointer" }}
                      onClick={() => showEditor(g)}
                    >
                      {`${g.customLength ?? g.length} x ${g.customWidth ?? g.width} x ${g.customDepth ?? g.depth}`}
                    </Box>
                  </Tooltip>
                </TableCell>
                <TableCell align="right">{g.plays}</TableCell>
                <TableCell align="right">{g.rating}</TableCell>
                <TableCell align="right">{g.bggRating}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
