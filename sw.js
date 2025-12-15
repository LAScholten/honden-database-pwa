const CACHE_NAME = 'honden-database-v1.0';
const urlsToCache = [
  './',
  './index.html',
  './app.html',
  './css/style.css',
  './js/auth.js',
  './js/database.js',
  './js/ui.js',
  './manifest.json',
  './img/icons/icon-192x192.png',
  './img/icons/icon-512x512.png'
];

// Install event
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event
self.addEventListener('activate', event => {
  console.log('Service Worker: Activated');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch new
        return response || fetch(event.request)
          .then(fetchResponse => {
            // Cache the new response
            return caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, fetchResponse.clone());
                return fetchResponse;
              });
          });
      })
      .catch(() => {
        // Fallback for offline
        if (event.request.url.includes('.html')) {
          return caches.match('./index.html');
        }
      })
  );
});