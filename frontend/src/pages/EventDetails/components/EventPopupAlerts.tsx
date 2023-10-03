import { Alert } from '@mui/material';

import { Event } from '#modules/event/event.type';
import { useTranslation } from '#shared/i18n/useTranslation';

interface EventPopupAlertsProps {
  event: Event;
}

export function EventPopupAlerts({ event }: EventPopupAlertsProps) {
  const { t, formatDateTime } = useTranslation();

  const now = new Date();
  const formatLongDateTime = (date: Date) =>
    formatDateTime(date, { dateStyle: 'long', timeStyle: 'short' });

  if (event.startRegistration && event.startRegistration > now) {
    return (
      <Alert variant="outlined" elevation={6} severity="info">
        {t('event.popupAlerts.registrationNotStarted', {
          date: formatLongDateTime(event.startRegistration),
        })}
      </Alert>
    );
  }

  if (
    event.maxParticipant &&
    event.numberOfParticipants >= event.maxParticipant
  ) {
    return (
      <Alert variant="outlined" elevation={6} severity="error">
        {t('event.popupAlerts.maxParticipantReached', {
          max: event.maxParticipant,
        })}
      </Alert>
    );
  }

  if (event.endRegistration && event.endRegistration >= now) {
    return (
      <Alert variant="outlined" elevation={6} severity="info">
        {t('event.popupAlerts.registrationWillBeSoonEnded', {
          date: formatLongDateTime(event.endRegistration),
        })}
      </Alert>
    );
  }

  if (event.endRegistration && event.endRegistration < now) {
    return (
      <Alert variant="outlined" elevation={6} severity="error">
        {t('event.popupAlerts.registrationHasEnded', {
          date: formatLongDateTime(event.endRegistration),
        })}
      </Alert>
    );
  }
}
