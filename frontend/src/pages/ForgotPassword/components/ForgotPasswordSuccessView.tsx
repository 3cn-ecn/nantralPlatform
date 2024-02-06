import { useNavigate } from 'react-router-dom';

import { Check } from '@mui/icons-material';
import { Box, Button, Divider, Typography } from '@mui/material';

import { Spacer } from '#shared/components/Spacer/Spacer';

export function ForgotPasswordSuccessView() {
  const navigate = useNavigate();
  return (
    <>
      <Spacer vertical={2} />
      <Check sx={{ fontSize: 200 }} color="success" />
      <Typography variant="h6" margin={2}>
        An email has been sent to reset your password. If you don&apos;t receive
        anything, wait a few minutes it can sometimes take some time.
      </Typography>
      <Spacer vertical={3} />
      <Divider flexItem />
      <Spacer vertical={3} />
      <Box
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Button
          sx={{ maxWidth: 220 }}
          onClick={() => navigate('/login')}
          variant="text"
        >
          Back to login
        </Button>
      </Box>
    </>
  );
}
