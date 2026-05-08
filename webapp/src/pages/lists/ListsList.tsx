import { PageHeader } from "@components/PageHeader";
import { useListsData } from "@hooks/useListData";
import { List } from "@lib/boardgame.api.client";
import {
  Alert,
  Button,
  CircularProgress,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Link } from "react-router-dom";

export const ListsList = () => {
  const { isLoading, isError, refreshLists, lists } = useListsData();

  return (
    <Container>
      <PageHeader headerText="Manage Lists">
        <Button component={Link} variant="contained" to={`new`} sx={{ mr: 2 }}>
          New List
        </Button>
      </PageHeader>

      {isError && <Alert color="error">Error loading Lists</Alert>}

      {isLoading ? (
        <CircularProgress />
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>List Name</TableCell>
                <TableCell>View / Edit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lists.map((list: List) => (
                <TableRow key={list.id}>
                  <TableCell>{list.name}</TableCell>
                  <TableCell>
                    <Button
                      component={Link}
                      variant="contained"
                      to={`list/${list.id}`}
                      sx={{ mr: 2 }}
                    >
                      View List
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};
