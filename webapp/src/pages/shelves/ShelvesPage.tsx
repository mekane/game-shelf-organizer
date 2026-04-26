import { PageHeader } from "@components/PageHeader";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router-dom";

export const ShelvesPage = () => {
  const [newDialogOpen, setNewDialogOpen] = useState(false);

  const openNewDialog = () => {
    setNewDialogOpen(true);
  };

  const handleClose = () => {
    setNewDialogOpen(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());
    console.log("submit", formJson);
    handleClose();
  };

  const addShelfButton = (
    <Button variant="contained" onClick={openNewDialog}>
      Add New Room
    </Button>
  );

  return (
    <>
      <PageHeader headerText="Shelves">{addShelfButton}</PageHeader>

      <Dialog open={newDialogOpen} onClose={handleClose}>
        <DialogTitle>Add New Room Layout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Give your new room a name and configure the size.
          </DialogContentText>
          <form onSubmit={handleSubmit} id="new-room-form">
            <Stack spacing={1}>
              <TextField
                autoFocus
                required
                margin="dense"
                id="roomName"
                name="name"
                label="Room Name"
                type="text"
                fullWidth
                variant="outlined"
              />

              <Stack
                direction="row"
                spacing={2}
                sx={{ justifyContent: "space-between" }}
              >
                <TextField
                  required
                  margin="dense"
                  id="roomWidth"
                  name="width"
                  label="Width (in inches)"
                  type="number"
                  variant="outlined"
                  defaultValue="12"
                  slotProps={{
                    input: {
                      htmlInput: { min: 12, max: 999 },
                      endAdornment: (
                        <InputAdornment position="start">in</InputAdornment>
                      ),
                    },
                  }}
                />

                <TextField
                  required
                  margin="dense"
                  id="roomHeight"
                  name="height"
                  label="Height (in inches)"
                  type="number"
                  variant="outlined"
                  defaultValue="12"
                  slotProps={{
                    htmlInput: { min: 12, max: 999 },
                    input: {
                      endAdornment: (
                        <InputAdornment position="start">in</InputAdornment>
                      ),
                    },
                  }}
                />
              </Stack>
            </Stack>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" form="new-room-form">
            Add Room
          </Button>
        </DialogActions>
      </Dialog>

      <Outlet />
    </>
  );
};
