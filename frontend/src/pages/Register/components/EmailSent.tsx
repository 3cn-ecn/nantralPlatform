import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { MarkEmailReadRounded } from '@mui/icons-material';
import { Box, Button, CardContent, Paper, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import { resendVerificationEmailApi } from '#modules/account/api/email.api';
import { FlexCol, FlexRow } from '#shared/components/FlexBox/FlexBox';

export default function EmailSent() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { email = undefined, firstName = undefined } = state || {};
  const { isSuccess, mutate, isLoading } = useMutation(
    resendVerificationEmailApi,
  );
  if (!state) {
    return <Navigate to="/register" replace />;
  }
  return (
    <Box>
      <Typography variant="h4">{`We are nearly done ${
        firstName || ''
      }!`}</Typography>
      <Paper sx={{ width: '100%', marginTop: 3 }} variant="elevation">
        <CardContent>
          <FlexRow justifyContent={'center'}>
            <MarkEmailReadRounded sx={{ fontSize: 200 }} color="secondary" />
          </FlexRow>
          <Typography variant="body1" color="secondary">
            A confirmation e-mail has been sent to you to confirm your e-mail
            address at <b color="primary">{email}</b>
          </Typography>
          <Typography
            variant="body1"
            sx={{ textAlign: 'center', marginLeft: 1, marginTop: 2 }}
            color="primary"
          >
            Click on the link in the email and login to access your account
          </Typography>
          <FlexRow mt={3} justifyContent="center">
            <Button
              sx={{ maxWidth: 300 }}
              onClick={() => navigate('/login/')}
              variant="contained"
              size="large"
              fullWidth
            >
              Login
            </Button>
          </FlexRow>
        </CardContent>
      </Paper>
      <FlexCol sx={{ mt: 2 }}>
        <Typography sx={{ color: 'gray', mb: 1 }}>
          Email not received?
        </Typography>
        <Typography>
          Wait a few minutes, this can sometimes take a long time.
        </Typography>
        <FlexRow sx={{ alignItems: 'center', gap: 1 }}>
          <Typography>Still Nothing?</Typography>
          {isSuccess ? (
            <Typography color="primary">Email sent</Typography>
          ) : (
            <Button
              disabled={isLoading}
              sx={{ textTransform: 'none' }}
              onClick={() => {
                mutate(email);
              }}
            >
              Send again
            </Button>
          )}
        </FlexRow>
      </FlexCol>
    </Box>
  );
}
