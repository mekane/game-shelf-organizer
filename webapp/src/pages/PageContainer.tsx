import { useTheme } from "@emotion/react";
import { Outlet } from "react-router-dom";
import { TopBar } from "../components/nav/TopBar";

export const PageContainer = () => {
  const theme = useTheme();

  return (
    <>
      <TopBar />
      <Outlet />
    </>
  );
};
