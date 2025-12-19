const CACHE_NAME = 'honden-database-v1.1';
const urlsToCache = [
  '/',
  '/index.html',
  '/app.html',
  '/css/style.css',
  '/js/auth.js',
  '/js/database.js',
  '/js/ui.js',
  '/manifest.json',
  '/img/icons/icon-192x192.png',
  '/img/icons/icon-512x512.png'
];

// Install event - ROBUUSTE VERSIE
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  // Skip waiting om direct te activeren
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching files');
        
        // Gebruik Promise.all met individuele cache.add() calls
        // Dit voorkomt dat één mislukking alles stopt
        const cachePromises = urlsToCache.map(urlToCache => {
          return cache.add(urlToCache).catch(error => {
            console.warn(`Service Worker: Failed to cache ${urlToCache}:`, error);
            // Ga door zelfs als één bestand mislukt
            return Promise.resolve();
          });
        });
        
        return Promise.all(cachePromises);
      })
      .then(() => {
        console.log('Service Worker: All files cached (met mogelijke waarschuwingen)');
      })
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
            console.log('Service Worker: Removing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      // Claim clients (neem controle over alle tabs)
      return self.clients.claim();
    })
  );
});

// Fetch event - Verbeterde versie
self.addEventListener('fetch', event => {
  // Skip non-GET requests en chrome-extension requests
  if (event.request.method !== 'GET' || 
      event.request.url.startsWith('chrome-extension://') ||
      event.request.url.includes('sockjs-node') ||
      event.request.url.includes('hot-update')) {
    return;
  }
  
  // Skip API calls naar je eigen backend (als je die hebt)
  if (event.request.url.includes('/api/')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Als gevonden in cache, retourneer het
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Anders fetch van netwerk
        return fetch(event.request)
          .then(fetchResponse => {
            // Check of response geldig is
            if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
              return fetchResponse;
            }
            
            // Clone de response voor caching
            const responseToCache = fetchResponse.clone();
            
            // Open cache en sla op
            caches.open(CACHE_NAME)
              .then(cache => {
                // Probeer te cachen, maar negeer errors
                cache.put(event.request, responseToCache)
                  .catch(error => {
                    console.warn('Service Worker: Failed to cache response:', error);
                  });
              });
            
            return fetchResponse;
          })
          .catch(error => {
            console.log('Service Worker: Fetch failed, checking for fallback:', error);
            
            // Fallback voor HTML pages
            if (event.request.destination === 'document' || 
                event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/index.html');
            }
            
            // Fallback voor andere resources
            return caches.match(event.request);
          });
      })
  );
});

// Optioneel: Message event voor updates
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});