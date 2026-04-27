import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { FC, ReactNode, useCallback, useRef, useState } from "react";
import { ConfirmContext, ConfirmOptions } from "./useConfirmContext";

export const ConfirmProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [loading, setLoading] = useState(false);
  const resolveRef = useRef<(value: boolean) => void>(() => {});

  const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    setOptions(opts);
    setLoading(false);
    setOpen(true);
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  const handleClose = () => {
    setOpen(false);
    setLoading(false);
    resolveRef.current?.(false);
  };

  const handleConfirm = () => {
    setLoading(true);
    resolveRef.current?.(true);
  };

  const close = () => {
    setOpen(false);
    setLoading(false);
  };

  return (
    <ConfirmContext value={{ confirm, setLoading, close }}>
      {children}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>{options?.title}</DialogTitle>
        <DialogContent>{options?.description}</DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            disabled={loading}
            variant={"outlined"}
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            color={options?.color ?? "primary"}
            loading={loading}
          >
            {options?.actionText}
          </Button>
        </DialogActions>
      </Dialog>
    </ConfirmContext>
  );
};
