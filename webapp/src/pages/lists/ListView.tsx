import { useApi } from "@context/api";
import { List } from "@lib/boardgame.api.client";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

export const ListView = () => {
  const { id } = useParams();
  const api = useApi();

  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState<List>(null);

  useEffect(() => {
    setIsLoading(true);

    api.list
      .listControllerFindOne(id)
      .then((res) => {
        console.log("api result for get " + id, res.data);

        setList(res.data);

        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error(`No list found for id ${id}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [api, id]);

  return isLoading ? (
    <CircularProgress />
  ) : (
    <div>
      <pre>{JSON.stringify(list)}</pre>
    </div>
  );
};
