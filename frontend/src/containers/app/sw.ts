import { registerRoute, setCatchHandler, setDefaultHandler } from 'workbox-routing';
import {
  NetworkFirst,
  StaleWhileRevalidate,
  CacheFirst,
  NetworkOnly
} from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';

import { MANAGE_NOTIFICATION_URL } from '../notification/api_urls';
import formatUrl from '../utils/formatUrl';
import axios from "../utils/axios";


//////////////////////////////////
/// CACHE MANAGER WITH WORKBOX ///
//////////////////////////////////

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

// pages we do NOT want to be cached
registerRoute(
  ({url}) => url.pathname === '/amiconnected',
  new NetworkOnly({})
)

// default settings: always use the network first, and then the cache if offline
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

// Save offline page when installing the app
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



/////////////////////////////////////
/// MANAGE NOTIFICATION RECEPTION ///
/////////////////////////////////////

// listen to knew notifications
self.addEventListener('push', function (event:PushEvent) {
  // only for tests
  event.waitUntil(
    self.registration.showNotification("Nouvelle notif test !!!", {})
);
  // Retrieve the textual payload from event.data (a PushMessageData object).
  // Other formats are supported (ArrayBuffer, Blob, JSON), check out the documentation
  // on https://developer.mozilla.org/en-US/docs/Web/API/PushMessageData.
  const eventInfo = event.data.text();
  console.log(eventInfo);
  const message = JSON.parse(eventInfo);

  // Keep the service worker alive until the notification is created.
  event.waitUntil(
      self.registration.showNotification(message.title, {
          body: message.body,
          icon: message.icon || '/static/img/logo.svg',
          image: message.image,
          data: message.data
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

// react to click on a notification
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
  var urlToRequest = formatUrl(
    MANAGE_NOTIFICATION_URL, 
    [notif.tag], 
    {markAsSeen: true}
  );
  axios.post(urlToRequest, {});

  // close the notification
  event.notification.close();
}, false);