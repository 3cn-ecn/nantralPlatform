import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { CheckCircle } from '@mui/icons-material';
import { Button, Divider, Typography } from '@mui/material';

import { Spacer } from '#shared/components/Spacer/Spacer';

export default function ResetPasswordSuccess() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <>
      <CheckCircle sx={{ fontSize: 200 }} color="success" />
      <Typography variant="h4">{t('resetPassword.passwordChanged')}</Typography>
      <Typography textAlign="center">
        {t('resetPassword.youCanNowLogin')}
      </Typography>
      <Spacer vertical={3} />
      <Divider flexItem />
      <Spacer vertical={3} />
      <Button
        variant="contained"
        size="large"
        fullWidth
        onClick={() => navigate('/login/')}
      >
        {t('resetPassword.backToLogin')}
      </Button>
    </>
  );
}
