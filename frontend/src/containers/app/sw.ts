import { registerRoute, setCatchHandler, setDefaultHandler } from 'workbox-routing';
import {
  NetworkFirst,
  StaleWhileRevalidate,
  CacheFirst,
  NetworkOnly
} from 'workbox-strategies';
import {CacheableResponsePlugin} from 'workbox-cacheable-response';
import {ExpirationPlugin} from 'workbox-expiration';
import axios from 'axios';

// disable dev logs
declare var self: ServiceWorkerGlobalScope;
declare global {interface ServiceWorkerGlobalScope {__WB_DISABLE_DEV_LOGS: boolean;}}
self.__WB_DISABLE_DEV_LOGS = true;

// badge
let unreadCount = 0;

// Cache the external fonts, stylesheets and plugins
registerRoute(
  ({url}) => url.origin === 'https://fonts.googleapis.com' ||
             url.origin === 'https://fonts.gstatic.com' ||
             url.origin === 'https://kit.fontawesome.com' ||
             url.origin === 'https://ka-f.fontawesome.com' ||
             url.origin === 'https://cdn.jsdelivr.net',
  new CacheFirst({
    cacheName: 'external-files',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200, 304],   // on cache uniquement les renvois non-erreurs
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 30,  // le cache expire après 30 jours
        maxEntries: 30,                    // pas plus de 30 fichiers dans le cache
      })
    ]
  })
);

// cache images
registerRoute(
  ({url, request}) => request.destination === 'image' ||
                      url.origin === 'https://nantral-platform-prod.s3.amazonaws.com' ||
                      url.origin === 'https://avatars.dicebear.com',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: 60 * 60 * 24 * 7, // 7 Days
      }),
      new CacheableResponsePlugin({
        statuses: [200],
      })
    ]
  })
);

// cache js and css files
registerRoute(
  ({request}) => request.destination === 'script' ||
                 request.destination === 'style',
  new CacheFirst({
    cacheName: 'static-resources',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 60 * 60 * 24 * 7, // 7 Days
      }),
      new CacheableResponsePlugin({
        statuses: [200]
      })
    ]
  })
);


// cache the home and main pages to accelerate navigation
registerRoute(
  ({url}) => url.pathname === '' ||
             url.pathname === '/club/' ||
             url.pathname === '/colocs/' ||
             url.pathname === '/liste/' ||
             url.pathname === '/services/signature' ||  
             url.pathname === '/student/' ||
             url.pathname === '/academic/' ||
             url.pathname === '/administration/',
  new StaleWhileRevalidate({
    cacheName: 'main-pages',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 14,
      })
    ]
  })
)

// pages à ne surtout pas cacher
registerRoute(
  ({url}) => url.pathname === '/amiconnected',
  new NetworkOnly({})
)

// par défaut privilégier le réseau, mais utiliser le cache si hors-connexion
setDefaultHandler(
  new NetworkFirst({
    cacheName: "default-cache",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24 * 15,
      })
    ]
  })
);



// Page Hors-Connexion
const CACHE_NAME = 'offline-html';
const FALLBACK_HTML_URL = '/offline.html';

self.addEventListener('install', async (event:ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.add(FALLBACK_HTML_URL))
  );
});

setCatchHandler(async ({request}) => {
  if (request.destination == 'document') {
    return caches.match(FALLBACK_HTML_URL);
  }
  // If we don't have a fallback, just return an error response.
  return Response.error();
});

// Receiving notifications
self.addEventListener('push', function (event:PushEvent) {
  // Retrieve the textual payload from event.data (a PushMessageData object).
  // Other formats are supported (ArrayBuffer, Blob, JSON), check out the documentation
  // on https://developer.mozilla.org/en-US/docs/Web/API/PushMessageData.
  const eventInfo = event.data.text();
  const data = JSON.parse(eventInfo);

  // Keep the service worker alive until the notification is created.
  event.waitUntil(
      self.registration.showNotification(data.title, {
          body: data.body,
          icon: data.icon || '/static/img/logo.svg',
          image: data.image,
          data: data.data
      })
  );

  // set a badge
  let nav = navigator as any;
  unreadCount++;
  if (nav.setAppBadge) {
    nav.setAppBadge(unreadCount).catch((error) => {
      console.log("Error in setting app badge");
    })
}
});


// use the notification url
declare const notifications_url: string;

// react to clicking on a notification
self.addEventListener('notificationclick', function(event) {
  const notif = event.notification;
  // open the notification
  if (event.action === 'action1') {
    self.clients.openWindow(notif.data.action1_url);
  } else if (event.action == 'action2') {
    self.clients.openWindow(notif.data.action2_url);
  } else {
    // User selected (e.g., clicked in) the main body of notification.
    self.clients.openWindow(notif.data.url);
  }

  // mark it as read
  var urlToRequest = notifications_url
  urlToRequest += "?notif_id=" + notif.tag;
  urlToRequest += "&mark_read=true";
  axios.post(urlToRequest, {});

  // close the notification
  event.notification.close();
}, false);