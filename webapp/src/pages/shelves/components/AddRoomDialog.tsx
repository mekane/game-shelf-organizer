import SaveIcon from "@mui/icons-material/Save";
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

export interface AddRoomDialogProps {
  isSubmitting: boolean;
  open: boolean;
  handleClose: () => void;
  handleSubmit: () => void;
}

export const AddRoomDialog = ({
  open,
  handleClose,
  handleSubmit,
  isSubmitting,
}) => {
  return (
    <Dialog open={open} onClose={handleClose}>
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
          loading={isSubmitting}
          loadingPosition="end"
          startIcon={<SaveIcon />}
          variant="contained"
        >
          Add Room
        </Button>
      </DialogActions>
    </Dialog>
  );
};
