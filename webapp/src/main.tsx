import { ApiProvider } from "@context/api";
import { AuthProvider } from "@context/auth";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./main.css";
import { router } from "./routes";
import theme from "./theme";
import { ConfirmProvider } from "./context/useConfirm/useConfirmProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <ApiProvider>
          <ConfirmProvider>
            <RouterProvider router={router} />
            <CssBaseline />
          </ConfirmProvider>
        </ApiProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
