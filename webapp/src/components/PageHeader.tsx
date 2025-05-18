import { FC } from "react";

export const PageHeader: FC<{ children: string }> = ({ children }) => {
  return <h2>{children}</h2>;
};
