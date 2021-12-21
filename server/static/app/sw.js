// Installing Service Worker
this.addEventListener('install',function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.add('/static/');
    })
  );
});