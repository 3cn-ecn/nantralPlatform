import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { Check } from '@mui/icons-material';
import { Button, Divider, Typography } from '@mui/material';

import { Spacer } from '#shared/components/Spacer/Spacer';
import { useTranslation } from '#shared/i18n/useTranslation';

export default function ForgotPasswordSuccessView() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { state } = useLocation();

  if (!state?.email) {
    return <Navigate to="/forgot_password/" replace />;
  }
  return (
    <>
      <Spacer vertical={2} />
      <Check sx={{ fontSize: 200 }} color="success" />
      <Typography variant="body1" margin={2}>
        {t('resetPassword.emailSent')}
      </Typography>
      <Spacer vertical={3} />
      <Divider flexItem />
      <Spacer vertical={3} />
      <Button onClick={() => navigate('/login')} variant="contained" fullWidth>
        {t('resetPassword.backToLogin')}
      </Button>
    </>
  );
}
