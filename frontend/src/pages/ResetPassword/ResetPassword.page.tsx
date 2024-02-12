import { Outlet } from 'react-router-dom';

import { Card, Typography, useTheme } from '@mui/material';

import { FloatingContainer } from '#shared/components/FloatingContainer/FloatingContainer';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useTranslation } from '#shared/i18n/useTranslation';

export default function ForgotPasswordPage() {
  const theme = useTheme();
  const { t } = useTranslation();
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
          textAlign="center"
          variant="h2"
        >
          {t('passwordReset.title')}
        </Typography>
        <Spacer vertical={4} />
        <Outlet />
      </Card>
    </FloatingContainer>
  );
}
