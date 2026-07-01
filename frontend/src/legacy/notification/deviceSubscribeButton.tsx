import { useEffect, useState } from 'react';
import { Button, Typography } from '@mui/material';

import { useTranslation } from '#shared/i18n/useTranslation';

import { wrapAndRenderLegacyCode } from '../utils/wrapAndRenderLegacyCode';

/**
 * Load the Subscribe Button and update it when clicked
 */
function DeviceSubscribeButton() {
  const [notificationState, setNotificationState] = useState<'unsupported' | NotificationPermission>(
    'unsupported',
  );
  const { t } = useTranslation();

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationState(Notification.permission);
    }
  }, []);

  async function askForNotifications() {
    const permission = await Notification.requestPermission();
    setNotificationState(permission);
  }

  switch (notificationState) {
    case 'granted':
      return (
        <Typography>
          {t('notification.settingsPage.enabled')}
        </Typography>
      );

    case 'default':
      return (
        <Typography component="div">
          <span>{t('notification.settingsPage.disabled')} </span>
          <Button
            size="small"
            variant="contained"
            onClick={askForNotifications}
          >
            {t('notification.settingsPage.disabledButtonLabel')}
          </Button>
        </Typography>
      );

    case 'denied':
      return (
        <Typography>
          {t('notification.settingsPage.blocked')}
        </Typography>
      );

    default:
      return (
        <Typography>
          {t('notification.settingsPage.unavailable')}
        </Typography>
      );
  }
}

wrapAndRenderLegacyCode(
  <DeviceSubscribeButton />,
  'subscribe_to_notifications',
);