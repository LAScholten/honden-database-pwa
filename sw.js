// sw.js - Service Worker voor Honden Database PWA
const CACHE_NAME = 'honden-cache-v' + Date.now(); // UNIEKE naam elke keer
const CORE_ASSETS = [
  './',
  './index.html',
  './app.html',
  './css/style.css',
  './js/auth.js',
  './js/database.js',
  './js/ui-handler.js',
  './js/modules/BaseModule.js',
  './manifest.json',
  './img/logo.png'
];

// INSTALL - Cache basis
self.addEventListener('install', event => {
  console.log('SW: Installatie gestart');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('SW: Cachen core bestanden');
        return cache.addAll(CORE_ASSETS);
      })
      .then(() => {
        console.log('SW: Direct activeren');
        return self.skipWaiting();
      })
  );
});

// ACTIVATE - Oude verwijderen
self.addEventListener('activate', event => {
  console.log('SW: Activeren gestart');
  event.waitUntil(
    Promise.all([
      // Verwijder ALLE oude caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            console.log('SW: Verwijder cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      }),
      
      // Claim alle tabs direct
      self.clients.claim()
    ]).then(() => {
      console.log('SW: Klaar voor gebruik');
    })
  );
});

// FETCH - Simpel: netwerk eerst, anders cache
self.addEventListener('fetch', event => {
  const request = event.request;
  
  // Skip non-GET
  if (request.method !== 'GET') return;
  
  // Service worker zelf overslaan
  if (request.url.includes('/sw.js')) {
    return fetch(request);
  }
  
  event.respondWith(
    // Probeer eerst netwerk
    fetch(request)
      .then(response => {
        // Succes: update cache
        const responseClone = response.clone();
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(request, responseClone);
          });
        return response;
      })
      .catch(() => {
        // Netwerk faalt: probeer cache
        return caches.match(request)
          .then(cached => {
            if (cached) {
              return cached;
            }
            // Voor HTML: val terug op index
            if (request.headers.get('accept').includes('text/html')) {
              return caches.match('./index.html');
            }
            return new Response('Offline', { status: 503 });
          });
      })
  );
});

// Forceer update bij bericht
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});