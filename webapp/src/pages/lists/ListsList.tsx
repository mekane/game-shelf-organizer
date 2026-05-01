import { PageHeader } from "@components/PageHeader";
import { useApi } from "@context/api";
import { List } from "@lib/boardgame.api.client";
import {
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
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const ListsList = () => {
  const api = useApi();

  const [isLoading, setIsLoading] = useState(true);
  const [myLists, setMyLists] = useState<List[]>([]);

  useEffect(() => {
    api.list.listControllerFindAll().then((res) => {
      setMyLists(res.data);
      setIsLoading(false);
    });
  }, [api]);

  return (
    <Container>
      <PageHeader headerText="Manage Lists">
        <Button component={Link} variant="contained" to={`new`} sx={{ mr: 2 }}>
          New List
        </Button>
      </PageHeader>

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
              {myLists.map((list) => (
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
