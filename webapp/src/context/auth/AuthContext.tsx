import { createContext } from "react";
export interface AuthContextData {
  authed: boolean;
  accessToken?: string;
  logout: () => Promise<boolean>;
  setAccessToken: (string) => void;
  setUser: (user: unknown) => void;
  user?: unknown;
}

const defaultState: AuthContextData = {
  authed: false,
  logout: async () => true,
  setAccessToken: () => {},
  setUser: () => {},
};

export const AuthContext = createContext<AuthContextData>(defaultState);
