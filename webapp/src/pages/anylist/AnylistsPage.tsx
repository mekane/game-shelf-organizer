import { PageHeader } from "@components/PageHeader";
import { useApi } from "@context/api";
import { AnylistDto } from "@lib/boardgame.api.client";
import {
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

export const AnylistsPage = () => {
  const api = useApi();

  const [myLists, setMyLists] = useState<AnylistDto[]>([]);

  useEffect(() => {
    api.anylist.anylistControllerFindAll().then((res) => {
      setMyLists(res.data);
    });
  }, [api]);

  return (
    <Container>
      <PageHeader>Manage Lists</PageHeader>
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
                  <Link to={`/anylists/${list.id}`}>
                    View / Edit {list.name}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};
