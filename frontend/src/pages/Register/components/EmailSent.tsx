import { Trans } from 'react-i18next';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { Check, MarkEmailReadRounded } from '@mui/icons-material';
import {
  Box,
  Button,
  CardContent,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import { resendVerificationEmailApi } from '#modules/account/api/resendVerificationEmail.api';
import { useTranslation } from '#shared/i18n/useTranslation';

export default function EmailSent() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { t } = useTranslation();
  const { email = undefined, firstName = undefined } = state || {};
  const { isSuccess, mutate, isPending } = useMutation({
    mutationFn: resendVerificationEmailApi,
  });
  if (!state) {
    return <Navigate to="/register" replace />;
  }
  return (
    <Box>
      <Typography variant="h4">
        {t('register.nearlyDone', { firstName: firstName })}
      </Typography>
      <Paper sx={{ width: '100%', marginTop: 3 }} variant="elevation">
        <CardContent>
          <Stack direction="row" sx={{ justifyContent: 'center' }}>
            <MarkEmailReadRounded sx={{ fontSize: 200 }} color="secondary" />
          </Stack>
          <Typography
            variant="body1"
            color="secondary"
            sx={{ textAlign: 'center' }}
          >
            <Trans
              i18nKey="register.confirmationEmailSent"
              values={{ email: email.replace('-', '-\u2060') }}
            />
          </Typography>
          <Typography
            variant="body1"
            sx={{ textAlign: 'center', marginLeft: 1, marginTop: 2 }}
            color="primary"
          >
            {t('register.clickOnLink')}
          </Typography>
          <Stack direction="row" sx={{ mt: 3, justifyContent: 'center' }}>
            <Button
              sx={{ maxWidth: 300 }}
              onClick={() => navigate('/login/')}
              variant="contained"
              size="large"
              fullWidth
            >
              {t('login.login')}
            </Button>
          </Stack>
        </CardContent>
      </Paper>
      <Stack sx={{ mt: 2 }}>
        <Typography sx={{ color: 'gray', mb: 1 }}>
          {t('register.emailNotReceived')}
        </Typography>
        <Typography>{t('register.waitAFewMinutes')}</Typography>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: 1 }}>
          <Typography>{t('register.stillNothing')}</Typography>
          {isSuccess ? (
            <>
              <Typography sx={{ color: 'gray' }}>
                {t('register.emailSent')}
              </Typography>
              <Check color="success" />
            </>
          ) : (
            <Button
              disabled={isPending}
              sx={{ textTransform: 'none' }}
              onClick={() => {
                mutate(email);
              }}
            >
              {t('register.sendAgain')}
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
