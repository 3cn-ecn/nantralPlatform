import { useState } from 'react';
import { Button } from 'react-bootstrap';

import { useTranslation } from '#shared/i18n/useTranslation';

import { wrapAndRenderLegacyCode } from '../utils/wrapAndRenderLegacyCode';

/**
 * Load the Subscribe Button and update it when clicked
 * @param props Properties of the XML element
 * @returns HTML Button element
 */
function DeviceSubscribeButton() {
  const [notificationState, setNotificationState] = useState('unsupported');
  const { t } = useTranslation();

  async function askForNotifications() {
    Notification.requestPermission().then(() => {
      setNotificationState(Notification.permission);
    });
  }

  if (notificationState === 'unsupported' && 'Notification' in window) {
    setNotificationState(Notification.permission);
  }

  if (notificationState === 'granted') {
    return <p>{t('notification.settingsPage.enabled')}</p>;
  } else if (notificationState === 'default') {
    return (
      <p>
        <span>{t('notification.settingsPage.disabled')}</span>
        <Button size="sm" onClick={askForNotifications}>
          {t('notification.settingsPage.disabledButtonLabel')}
        </Button>
      </p>
    );
  } else if (notificationState === 'denied') {
    return <p>{t('notification.settingsPage.blocked')}</p>;
  } else {
    return <p>{t('notification.settingsPage.unavailable')}</p>;
  }
}

wrapAndRenderLegacyCode(
  <DeviceSubscribeButton />,
  'subscribe_to_notifications',
);
