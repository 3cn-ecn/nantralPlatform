/// <reference lib="WebWorker" />

export type {};
declare const self: ServiceWorkerGlobalScope;

interface Message extends NotificationOptions {
  title: string;
  hidden?: boolean;
}

/**
 * =============================
 * MANAGE NOTIFICATION RECEPTION
 * =============================
 */

let unreadCount = 0;

// listen to new notifications
self.addEventListener('push', (event: PushEvent) => {
  console.log('Received a new message!');
  let message: Message;
  try {
    // Push is a JSON
    message = event.data?.json();
  } catch (err) {
    // Push is a simple text
    message = {
      title: event.data?.text() || '',
    };
  }

  // send a notification, except if we explicitly say it must not be sent
  if (!message.hidden) {
    // Keep the service worker alive until the notification is created.
    event.waitUntil(self.registration.showNotification(message.title, message));
  }

  // set a badge
  const nav = navigator;
  unreadCount += 1;
  if (nav.setAppBadge) {
    nav.setAppBadge(unreadCount).catch(() => {
      console.log('Error in setting app badge');
    });
  }
});

// react to click on a notification
self.addEventListener(
  'notificationclick',
  async (event) => {
    const notif = event.notification;
    // check if we click on an action button
    const action = event.action.match(/^action_(\d)$/);
    if (action != null) {
      const id = action[1];
      self.clients.openWindow(notif.data.actions_url[id]);
    } else {
      // User selected (e.g., clicked in) the main body of notification.
      self.clients.openWindow(notif.data.url);
    }

    // close the notification
    event.notification.close();
  },
  false,
);
