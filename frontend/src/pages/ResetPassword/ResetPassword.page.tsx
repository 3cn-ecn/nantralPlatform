import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Card, Typography, useTheme } from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import { passwordResetValidateTokenApi } from '#modules/account/api/passwordReset.api';
import { FloatingContainer } from '#shared/components/FloatingContainer/FloatingContainer';
import { Spacer } from '#shared/components/Spacer/Spacer';

import { ResetPasswordError } from './components/ResetPasswordError';
import ResetPasswordForm from './components/ResetPasswordForm';
import ResetPasswordSuccess from './components/ResetPasswordSuccess';

export default function ForgotPasswordPage() {
  const { token } = useParams();

  const theme = useTheme();
  const [success, setSuccess] = useState(false);
  const {
    isError,
    isSuccess: tokenValid,
    mutate,
    isIdle,
  } = useMutation(passwordResetValidateTokenApi);

  useEffect(() => {
    if (isIdle && token) {
      mutate(token);
    }
  }, [isIdle, token, mutate]);

  return (
    <FloatingContainer maxWidth={'sm'}>
      <Card
        sx={{
          padding: 5,
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
        }}
        variant="outlined"
      >
        <img
          style={{
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
        <Typography
          sx={{
            color: theme.palette.mode == 'dark' ? '#b6b7b7' : '#282828',
          }}
          variant="h2"
        >
          Password Reset
        </Typography>
        <Spacer vertical={4} />
        {isError && <ResetPasswordError />}
        {!success && tokenValid && (
          <ResetPasswordForm token={token} onSuccess={() => setSuccess(true)} />
        )}
        {tokenValid && success && <ResetPasswordSuccess />}
      </Card>
    </FloatingContainer>
  );
}
