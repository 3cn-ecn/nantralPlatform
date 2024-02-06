import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { Box, Card, Container, Icon, useTheme } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import { passwordResetValidateToken } from '#modules/account/api/passwordReset.api';
import { Spacer } from '#shared/components/Spacer/Spacer';

import { ResetPasswordError } from './components/ResetPasswordError';
import { ResetPasswordForm } from './components/ResetPasswordForm';
import { ResetPasswordSuccess } from './components/ResetPasswordSuccess';

/**
 * Home Page, with Welcome message, next events, etc...
 * @returns Home page component
 */
export default function ForgotPasswordPage() {
  const { token } = useParams();

  const theme = useTheme();
  const [success, setSuccess] = useState(false);
  const { isError, isSuccess: tokenValid } = useQuery({
    queryFn: () => {
      if (token) return passwordResetValidateToken(token);
    },
    queryKey: ['validateToken', token],
    retry: false,
  });

  return (
    <Container
      sx={{
        margin: 0,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
      maxWidth={'sm'}
    >
      <Card
        sx={{
          padding: 5,
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
        }}
        variant="outlined"
      >
        <Icon
          component="img"
          sx={{
            width: 50,
            height: 50,
            border: 'solid',
            borderRadius: '50%',
            borderColor: 'gray',
            borderWidth: 2,
            marginBottom: 2,
          }}
          src="/static/img/logo/scalable/logo.svg"
          alt="Nantral platform"
        />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            width: '100%',
            justifyContent: 'center',
            columnGap: 2,
            rowGap: 1,
          }}
        >
          <Box
            className="login-title"
            sx={{
              color: theme.palette.mode == 'dark' ? '#b6b7b7' : '#282828',
            }}
          >
            Password Reset
          </Box>
        </Box>
        <Spacer vertical={4} />
        {isError && <ResetPasswordError />}
        {!success && tokenValid && (
          <ResetPasswordForm token={token} onSuccess={() => setSuccess(true)} />
        )}
        {tokenValid && success && <ResetPasswordSuccess />}
      </Card>
    </Container>
  );
}
