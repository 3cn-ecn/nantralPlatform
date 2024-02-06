import { useNavigate } from 'react-router-dom';

import { CheckCircle } from '@mui/icons-material';
import { Typography } from '@mui/material';

import { BigButton } from '#shared/components/Button/BigButton';

export function ResetPasswordSuccess() {
  const navigate = useNavigate();
  return (
    <>
      <CheckCircle sx={{ fontSize: 200 }} color="success" />
      <Typography variant="h4">Password changed successfully</Typography>
      <Typography>You can now login with your new password</Typography>
      <BigButton onClick={() => navigate('/login/')} sx={{ marginTop: 3 }}>
        Go to login page
      </BigButton>
    </>
  );
}
