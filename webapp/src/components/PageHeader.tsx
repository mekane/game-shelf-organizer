import { Stack } from "@mui/material";
import { FC, ReactNode } from "react";

export interface PageHeaderProps {
  headerText: string;
  children?: ReactNode | ReactNode[];
}

export const PageHeader: FC<PageHeaderProps> = ({ headerText, children }) => {
  return (
    <Stack mx={2} direction="row" justifyContent={"space-between"}>
      <h2>{headerText}</h2>
      <Stack justifyContent={"space-around"}>{children}</Stack>
    </Stack>
  );
};
