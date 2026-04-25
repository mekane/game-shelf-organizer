import { PageHeader } from "@components/PageHeader";
import { Button, Stack } from "@mui/material";
import { Link, Outlet } from "react-router-dom";

export const ShelvesPage = () => {
  return (
    <>
      <PageHeader>Shelves</PageHeader>
      <Stack direction="row" gap={2}>
        <Button component={Link} to="layout" variant="outlined">
          Go to Page Configure Shelf Layout for Room
        </Button>
        <Button component={Link} to="organize" variant="outlined">
          Organize Games on Shelf
        </Button>
      </Stack>

      {
        //TODO: update the shelf DTO to contain the entire workspace config
        //TODO: load shelf list from API
        // Show list of nav links to /layout/:shelfId
        // replaces the "Configure" link above
        // also include a /organize/:shelfId link
      }

      <Outlet />
    </>
  );
};
