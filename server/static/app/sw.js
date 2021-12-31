importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.2.0/workbox-sw.js');


// Cache the external fonts, stylesheets and plugins
workbox.routing.registerRoute(
  ({url}) => url.origin === 'https://fonts.googleapis.com' ||
             url.origin === 'https://fonts.gstatic.com' ||
             url.origin === 'https://kit.fontawesome.com' ||
             url.origin === 'https://ka-f.fontawesome.com' ||
             url.origin === 'https://cdn.jsdelivr.net',
  new workbox.strategies.CacheFirst({
    cacheName: 'external-files',
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200, 304],   // on cache uniquement les renvois non-erreurs
      }),
      new workbox.expiration.ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 30,  // le cache expire après 30 jours
        maxEntries: 40,                    // pas plus de 40 fichiers dans le cache
      })
    ]
  })
);

// cache images
workbox.routing.registerRoute(
  ({request}) => request.destination === 'image',
  new workbox.strategies.CacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: 60 * 60 * 24 * 7, // 7 Days
      }),
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [200],
      })
    ]
  })
);

// cache js and css files
workbox.routing.registerRoute(
  ({request}) => request.destination === 'script' ||
                 request.destination === 'style',
  new workbox.strategies.CacheFirst({
    cacheName: 'static-resources',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: 60 * 60 * 24 * 1, // 7 Days
      }),
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [200]
      })
    ]
  })
);


// cache the home and main pages to accelerate navigation
workbox.routing.registerRoute(
  ({url}) => url.pathname === '/' ||
             url.pathname === '/club/' ||
             url.pathname === '/colocs/map' ||
             url.pathname === '/liste/' ||
             url.pathname === '/signature/' ||
             url.pathname === '/student/' ||
             url.pathname === '/academic/liste/' ||
             url.pathname === '/adminsitration' ||
             url.pathname === '/me/',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'main-pages',
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [200],
      })
    ]
  })
)


// par défaut privilégier le réseau, mais utiliser le cache si hors-connexion
workbox.routing.setDefaultHandler(
  new workbox.strategies.NetworkFirst()
);



// À FAIRE : Ajouter une page hors-connexion*/