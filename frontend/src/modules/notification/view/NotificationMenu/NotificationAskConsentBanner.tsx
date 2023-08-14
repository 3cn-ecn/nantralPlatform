import { useState } from 'react';

import { Alert, Button } from '@mui/material';

import { FlexCol } from '#shared/components/FlexBox/FlexBox';
import { useTranslation } from '#shared/i18n/useTranslation';

export function NotificationAskConsentBanner() {
  const { t } = useTranslation();

  const [shouldAsk, setShouldAsk] = useState(
    'Notification' in window && Notification.permission === 'default'
  );

  const askPermission = () => {
    Notification.requestPermission().then(() => {
      setShouldAsk(Notification.permission === 'default');
    });
  };

  if (!shouldAsk) return null;

  return (
    <FlexCol gap={1} px={2}>
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
    </FlexCol>
  );
}
