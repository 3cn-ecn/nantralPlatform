// Installing Service Worker
self.addEventListener('install',function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/static/app/',
        '/static/app/app.js'
      ]);
    })
  );
});