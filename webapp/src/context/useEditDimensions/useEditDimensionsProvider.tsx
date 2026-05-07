import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { FC, ReactNode, useCallback, useRef, useState } from "react";
import { Dimensions, EditDimensionsContext } from "./useEditDimensionsContext";

export const UseEditDimensionsProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [initialDimensions, setInitialDimensions] = useState<Dimensions | null>(
    null,
  );
  const [currentDimensions, setCurrentDimensions] = useState<Dimensions | null>(
    initialDimensions,
  );
  const resolveRef = useRef<(value: Dimensions) => void>(() => {});

  const showEditor = useCallback(
    (initialValues: Dimensions): Promise<Dimensions> => {
      setInitialDimensions(initialValues);
      setCurrentDimensions(initialDimensions);
      setOpen(true);
      return new Promise<Dimensions>((resolve) => {
        resolveRef.current = resolve;
      });
    },
    [initialDimensions],
  );

  const handleClose = () => {
    setOpen(false);
    resolveRef.current?.(initialDimensions);
  };

  const handleConfirm = () => {
    setOpen(false);
    resolveRef.current?.(currentDimensions);
  };

  const onChangeWidth = (e) => {
    setCurrentDimensions((prev: Dimensions) => ({
      ...prev,
      width: Number(e.target.value),
    }));
  };

  const onChangeLength = (e) => {
    setCurrentDimensions((prev: Dimensions) => ({
      ...prev,
      length: Number(e.target.value),
    }));
  };

  const onChangeHeight = (e) => {
    setCurrentDimensions((prev: Dimensions) => ({
      ...prev,
      height: Number(e.target.value),
    }));
  };

  return (
    <EditDimensionsContext value={{ showEditor, close }}>
      {children}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogContent>
          <Stack
            direction="row"
            spacing={2}
            sx={{ justifyContent: "space-between" }}
          >
            <TextField
              required
              fullWidth
              id="length"
              name="length"
              label="length (in inches)"
              type="number"
              variant="outlined"
              defaultValue={initialDimensions?.length ?? 0}
              onChange={onChangeLength}
              slotProps={{
                htmlInput: { min: 1, max: 99 },
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
              id="width"
              name="width"
              label="Width (in inches)"
              type="number"
              variant="outlined"
              defaultValue={initialDimensions?.width ?? 0}
              onChange={onChangeWidth}
              slotProps={{
                htmlInput: { min: 1, max: 99 },
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
              id="height"
              name="height"
              label="Height (in inches)"
              type="number"
              variant="outlined"
              defaultValue={initialDimensions?.height ?? 0}
              onChange={onChangeHeight}
              slotProps={{
                htmlInput: { min: 1, max: 99 },
                input: {
                  endAdornment: (
                    <InputAdornment position="end">in</InputAdornment>
                  ),
                },
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant={"outlined"} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </EditDimensionsContext>
  );
};
