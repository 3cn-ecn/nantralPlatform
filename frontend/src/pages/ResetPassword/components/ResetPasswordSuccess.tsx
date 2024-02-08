import { useNavigate } from 'react-router-dom';

import { CheckCircle } from '@mui/icons-material';
import { Button, Divider, Typography } from '@mui/material';

import { Spacer } from '#shared/components/Spacer/Spacer';

export default function ResetPasswordSuccess() {
  const navigate = useNavigate();
  return (
    <>
      <CheckCircle sx={{ fontSize: 200 }} color="success" />
      <Typography variant="h4">Password changed successfully</Typography>
      <Typography>You can now login with your new password</Typography>
      <Spacer vertical={3} />
      <Divider flexItem />
      <Spacer vertical={3} />
      <Button
        variant="contained"
        size="large"
        fullWidth
        onClick={() => navigate('/login/')}
      >
        Go to login page
      </Button>
    </>
  );
}
