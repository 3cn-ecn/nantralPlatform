import { Alert } from '@mui/material';

export function ResetPasswordError() {
  return (
    <Alert severity="error">
      Something went wrong. The link may be invalid.
    </Alert>
  );
}
