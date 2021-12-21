// Installing Service Worker
self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
    e.waitUntil((async () => {
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(contentToCache);
    })());
  });

// Show Notification
function showNotification(){
  Notification.requestPermission((result)=> {
    if (result === 'granted') {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification('test',{
          body: 'ceci est un test'
        })
      })
    }   
  })
}