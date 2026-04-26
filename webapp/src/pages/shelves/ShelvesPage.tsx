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
import { useApi } from "@context/api";
import SaveIcon from "@mui/icons-material/Save";

export const ShelvesPage = () => {
  const api = useApi();
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const openNewDialog = () => {
    setNewDialogOpen(true);
  };

  const handleClose = () => {
    setNewDialogOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());

    setIsSubmittingForm(true);

    const createDto: CreateShelfDto = {
      name: formJson.name,
      room: {
        size: {
          width: formJson.width,
          height: formJson.height,
        },
      },
      shelves: [],
    };

    console.log("submitting form", createDto);

    const apiRes = await api.shelf
      .shelfControllerCreate(createDto)
      .then((res) => {
        console.log("success");
        handleClose();
      })
      .catch((err) => {
        console.log("error submitting form", err);
      })
      .finally(() => {
        setIsSubmittingForm(false);
      });
  };

  const addShelfButton = (
    <Button variant="contained" onClick={openNewDialog}>
      Add New Room
    </Button>
  );

  // TODO: refactor page structure so the shelves are loaded at the top level
  // TODO: extract components
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
            <Stack spacing={2} sx={{ mt: 1 }}>
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

              <Stack direction="row" spacing={2}>
                <TextField
                  required
                  fullWidth
                  id="roomWidth"
                  name="width"
                  label="Width (in inches)"
                  type="number"
                  variant="outlined"
                  defaultValue="12"
                  slotProps={{
                    htmlInput: { min: 12, max: 999 },
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">in</InputAdornment>
                      ),
                    },
                  }}
                />

                <TextField
                  required
                  fullWidth
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
                        <InputAdornment position="end">in</InputAdornment>
                      ),
                    },
                  }}
                />
              </Stack>
            </Stack>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button
            type="submit"
            form="new-room-form"
            loading={isSubmittingForm}
            loadingPosition="end"
            startIcon={<SaveIcon />}
            variant="contained"
          >
            Add Room
          </Button>
        </DialogActions>
      </Dialog>

      <Outlet />
    </>
  );
};
