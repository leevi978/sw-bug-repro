
let deferredPrompt;

self.addEventListener('beforeinstallprompt', (e) => {
  console.log("Installable")
});

let precacheResources = []
var staticCacheName = 'offline-pwa'

self.onhashchange = () => {
  console.log("Hash change")
}

self.oninstall = () => {
  console.log("on install")
  console.log(self)
}

self.onmessage = (e) => {
  console.log(`on message: ${e}`)
}

self.onsync = () => {
  console.log("on sync")
}

self.onactivate = () => {
  console.log("on activate")
}

self.addEventListener('update', () => {
  console.log('update')
})

self.addEventListener('appinstalled', event => {
  console.log('Attempting to install service worker and cache static assets');
  /*
  event.waitUntil(
    caches.open(staticCacheName)
      .then(cache => {
        return cache.addAll(precacheResources);
      })
  );
  */
});