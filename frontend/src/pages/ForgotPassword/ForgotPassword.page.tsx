import { useState } from 'react';

import { Box, Card, Container, Icon, useTheme } from '@mui/material';

import '#pages/Login/LoginPage.scss';
import { Spacer } from '#shared/components/Spacer/Spacer';

import { ForgotPasswordForm } from './components/ForgotPasswordForm';
import { ForgotPasswordSuccessView } from './components/ForgotPasswordSuccessView';

/**
 * Home Page, with Welcome message, next events, etc...
 * @returns Home page component
 */
export default function ForgotPasswordPage() {
  const [success, setSuccess] = useState(false);
  const theme = useTheme();

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
            Forgot your Password?
          </Box>
        </Box>
        <Spacer vertical={2} />
        {!success && <ForgotPasswordForm onSuccess={() => setSuccess(true)} />}
        {success && <ForgotPasswordSuccessView />}
      </Card>
    </Container>
  );
}
