import { Stack } from "@mui/material";
import { Outlet } from "react-router-dom";
import { TopBar } from "../components/nav/TopBar";

export const PageContainer = () => {
  return (
    <>
      <TopBar />
      <Stack
        className="page"
        justifyContent={"flex-end"}
        sx={{ height: "100%" }}
      >
        <Outlet />
      </Stack>
    </>
  );
};
