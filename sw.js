// sw.js - ECHTE SERVICE WORKER voor Honden Database PWA
const CACHE_NAME = 'honden-database-v2.0';
const APP_VERSION = '2.0';
const NEW_VERSION_AVAILABLE = 'new-version-available';

// ESSENTIËLE bestanden die offline MOETEN werken
const CORE_ASSETS = [
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

// Dynamische caching voor deze externe bestanden
const EXTERNAL_ASSETS = [
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
];

console.log(`Service Worker v${APP_VERSION} geladen voor Honden Database PWA`);

// INSTALL - Cache alle essentiële bestanden
self.addEventListener('install', function(event) {
  console.log('SW: Installeren - caching essentiële bestanden');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('SW: Cache geopend - toevoegen core assets');
        return cache.addAll(CORE_ASSETS)
          .then(() => {
            console.log('SW: Core assets gecached');
            return Promise.all(
              EXTERNAL_ASSETS.map(url => 
                fetch(url)
                  .then(response => cache.put(url, response))
                  .catch(err => console.log(`SW: Kon ${url} niet cachen:`, err))
              )
            );
          })
          .catch(error => {
            console.error('SW: Fout bij caching:', error);
          });
      })
      .then(() => {
        console.log('SW: Forceer activatie');
        return self.skipWaiting();
      })
  );
});

// ACTIVATE - Oude caches opruimen + update melding
self.addEventListener('activate', function(event) {
  console.log('SW: Activeren - opruimen oude caches');
  
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('SW: Verwijderen oude cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      // UPDATE MELDING NAAR CLIENTS
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: NEW_VERSION_AVAILABLE,
            version: APP_VERSION
          });
        });
      });
      
      console.log('SW: Claim clients');
      return self.clients.claim();
    })
  );
});

// FETCH - Serveer uit cache OF haal van netwerk
self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;
  if (event.request.url.startsWith('chrome-extension://')) return;
  
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        
        return fetch(event.request)
          .then(function(networkResponse) {
            if (event.request.url.startsWith('http') && 
                !event.request.url.includes('sockjs-node') &&
                networkResponse.status === 200) {
              
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(function(cache) {
                  cache.put(event.request, responseToCache);
                });
            }
            return networkResponse;
          })
          .catch(function(error) {
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('./index.html')
                .then(response => response || new Response(
                  '<h1>Offline</h1><p>De app werkt offline. Herlaad wanneer er weer internet is.</p>',
                  { headers: { 'Content-Type': 'text/html' } }
                ));
            }
            
            return new Response('Offline - Geen verbinding', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

// CONTROLLED UPDATE CHECK - NIEUWE FUNCTIE
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('SW: Update bevestigd - skipping waiting');
    self.skipWaiting();
  }
});

// PERIODIEKE SYNC (voor toekomstige uitbreidingen)
self.addEventListener('sync', function(event) {
  if (event.tag === 'sync-backup') {
    console.log('SW: Background sync - backup');
  }
});

// PUSH NOTIFICATIES (voor toekomstige uitbreidingen)
self.addEventListener('push', function(event) {
  console.log('SW: Push notification ontvangen');
});