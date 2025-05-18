import { useAuth } from "@context/auth";
import { Api } from "@lib/boardgame.api.client";
import { ApiContext, ApiContextData } from "./ApiContext";

const { ENV_API_BASE_URL } = import.meta.env;

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { accessToken } = useAuth();

  const api = new Api<string>({
    baseUrl: ENV_API_BASE_URL,
    securityWorker: async () => {
      return {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
    },
    baseApiParams: {
      headers: {
        "Content-Type": "application/json",
      },
    },
  });

  //console.log(`ApiProvider INIT [token=${accessToken}]`, api);

  const value: ApiContextData = {
    api,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};
