import { useApi } from "@context/api";
import { AnylistDto } from "@lib/boardgame.api.client";
import { Container, Skeleton } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AnylistEditor } from "./AnylistEditor";

export const EditAnyListPage: FC = () => {
  const { id } = useParams();
  const api = useApi();

  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState<AnylistDto>();

  useEffect(() => {
    api.anylist.anylistControllerFindOne(id).then((res) => {
      console.log("api result for list fetch", res.data);
      setList(res.data);
      setIsLoading(false);
    });
  }, [id]);

  return (
    <Container maxWidth="xl">
      {isLoading && <Skeleton />}
      {list && <AnylistEditor list={list} />}
    </Container>
  );
};
