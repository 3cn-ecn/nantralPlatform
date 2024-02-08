import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { Check } from '@mui/icons-material';
import { Button, Divider, Typography } from '@mui/material';

import { Spacer } from '#shared/components/Spacer/Spacer';

export default function ForgotPasswordSuccessView() {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state?.email) {
    return <Navigate to="/forgot_password/" replace />;
  }
  return (
    <>
      <Spacer vertical={2} />
      <Check sx={{ fontSize: 200 }} color="success" />
      <Typography variant="body1" margin={2}>
        An email has been sent to reset your password. If you don&apos;t receive
        anything, wait a few minutes it can sometimes take some time.
      </Typography>
      <Spacer vertical={3} />
      <Divider flexItem />
      <Spacer vertical={3} />
      <Button onClick={() => navigate('/login')} variant="contained" fullWidth>
        Back to login
      </Button>
    </>
  );
}
