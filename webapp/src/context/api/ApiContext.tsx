import { Api } from "@lib/boardgame.api.client";
import { createContext } from "react";

export interface ApiContextData {
  api: Api<string>;
}

const defaultState: ApiContextData = {
  api: {} as Api<string>,
} as ApiContextData;

export const ApiContext = createContext<ApiContextData>(defaultState);
