
let precacheResources = []
var staticCacheName = 'offline-pwa'

self.addEventListener('appinstalled', event => {
  console.log('Attempting to install service worker and cache static assets');
  event.waitUntil(
    caches.open(staticCacheName)
      .then(cache => {
        return cache.addAll(precacheResources);
      })
  );
});