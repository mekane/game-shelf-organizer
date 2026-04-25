import { Alert } from '@mui/material';

interface WarningNoticeProps {
  message?: string | null;
}

export function WarningNotice({ message }: WarningNoticeProps) {
  if (!message) {
    return null;
  }

  return (
    <Alert severity="warning" variant="outlined" sx={{ borderRadius: 3 }}>
      {message}
    </Alert>
  );
}
