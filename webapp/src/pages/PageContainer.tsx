import { Stack } from "@mui/material";
import { Outlet } from "react-router-dom";
import { TopBar } from "../components/nav/TopBar";

export const PageContainer = () => {
  return (
    <>
      <TopBar />
      <Stack
        className="page"
        sx={{ height: "100%", justifyContent: "flex-end", minWidth: "700px" }}
      >
        <Outlet />
      </Stack>
    </>
  );
};
