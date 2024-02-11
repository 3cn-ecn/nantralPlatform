import { Alert } from '@mui/material';

export default function ResetPasswordError() {
  return (
    <Alert severity="error">
      Something went wrong. The link may be invalid.
    </Alert>
  );
}
