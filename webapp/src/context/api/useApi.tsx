import { useContext } from "react";
import { ApiContext } from "./ApiContext";

export const useApi = () => {
  const context = useContext(ApiContext);
  return context.api;
};
