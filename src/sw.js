
self.addEventListener('install', (event) => {
  console.log("Installing service worker...")
})

self.addEventListener('activate', (event) => {
  console.log('Service worker active.')
})

self.addEventListener('message', async (event) => {
  if (event.data === 'onappinstalled') {
    console.log(`App was installed. Precaching pages...`)
    const precacheFiles = self.__WB_MANIFEST

    
    const cache = await caches.open(workbox.core.cacheNames.runtime)

    var i = 0
    while (i < precacheFiles.length) {
      const file = precacheFiles[i]
      await workbox.routing.registerRoute(`/${file.url}`, new workbox.strategies.CacheFirst(), 'GET')
      await cache.add(`/${file.url}`)
      i++
    }

    console.log("Caching of pages successful.")
  }
})

