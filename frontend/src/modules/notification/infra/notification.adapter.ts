import { SentNotification } from '../notification.types';
import { SentNotificationDTO } from './notification.dto';

export function adaptSentNotification(
  notification: SentNotificationDTO
): SentNotification {
  return {
    id: notification.notification.id,
    title: notification.notification.title,
    body: notification.notification.body,
    url: notification.notification.url,
    iconUrl: notification.notification.icon_url,
    date: new Date(notification.notification.date),
    seen: notification.seen,
    subscribed: notification.subscribed,
  };
}
