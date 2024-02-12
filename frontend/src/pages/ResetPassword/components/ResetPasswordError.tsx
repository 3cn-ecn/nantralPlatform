import { Alert } from '@mui/material';

import { useTranslation } from '#shared/i18n/useTranslation';

export default function ResetPasswordError() {
  const { t } = useTranslation();
  return <Alert severity="error">{t('passwordReset.error')}</Alert>;
}
