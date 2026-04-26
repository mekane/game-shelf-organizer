import { Stack } from "@mui/material";
import { FC, ReactNode } from "react";

export interface PageHeaderProps {
  headerText: string;
  children?: ReactNode | ReactNode[];
}

export const PageHeader: FC<PageHeaderProps> = ({ headerText, children }) => {
  return (
    <Stack direction="row" sx={{ justifyContent: "space-between", mx: 2 }}>
      <h2>{headerText}</h2>
      <Stack sx={{ justifyContent: "space-around" }}>{children}</Stack>
    </Stack>
  );
};
