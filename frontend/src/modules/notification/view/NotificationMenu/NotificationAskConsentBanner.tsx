import { useState } from 'react';

import { Alert, Button, Stack } from '@mui/material';

import { useTranslation } from '#shared/i18n/useTranslation';

export function NotificationAskConsentBanner() {
  const { t } = useTranslation();

  const [shouldAsk, setShouldAsk] = useState(
    'Notification' in window && Notification.permission === 'default',
  );

  const askPermission = () => {
    Notification.requestPermission().then(() => {
      setShouldAsk(Notification.permission === 'default');
    });
  };

  if (!shouldAsk) return null;

  return (
    <Stack spacing={1} sx={{ px: 2 }}>
      <Alert
        // variant="filled"
        severity="warning"
        action={
          <Button color="inherit" size="small" onClick={askPermission}>
            {t('notification.askConsentBanner.button')}
          </Button>
        }
      >
        {t('notification.askConsentBanner.warning')}
      </Alert>
    </Stack>
  );
}
