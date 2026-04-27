import { ApiProvider } from "@context/api";
import { AuthProvider } from "@context/auth";
import { ThemeProvider } from "@emotion/react";
import { createTheme, CssBaseline, useMediaQuery } from "@mui/material";
import { useMemo } from "react";
import { RouterProvider } from "react-router-dom";
import { ConfirmProvider } from "./context/useConfirm/useConfirmProvider";
import { router } from "./routes";
import { darkPalette, lightPalette } from "./theme";

export const App = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
          ...(prefersDarkMode ? darkPalette : lightPalette),
        },
      }),
    [prefersDarkMode],
  );

  return (
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
  );
};
