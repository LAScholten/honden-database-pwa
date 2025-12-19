const CACHE_NAME = 'honden-database-v2.0';
const ASSETS_TO_CACHE = [
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

// Helper om de juiste URL te bepalen
function getCacheableUrl(url) {
  // Als we op localhost zijn met file:// protocol
  if (self.location.protocol === 'file:') {
    return url;
  }
  
  // Verwijder query parameters en hashes
  const cleanUrl = url.split('?')[0].split('#')[0];
  
  // Zorg voor absolute URL
  try {
    return new URL(cleanUrl, self.location.origin).href;
  } catch (e) {
    return cleanUrl;
  }
}

// Install event - ROBUUSTE VERSIE
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  // Skip waiting om direct te activeren
  self.skipWaiting();
  
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        console.log('Service Worker: Cache geopend');
        
        // Probeer alleen de meest essentiële bestanden te cachen
        const cachePromises = ASSETS_TO_CACHE.map(async (assetUrl) => {
          try {
            // Bepaal de juiste URL
            const urlToCache = getCacheableUrl(assetUrl);
            
            // Controleer of het bestand bestaat
            const response = await fetch(urlToCache, {
              method: 'HEAD',
              mode: 'no-cors',
              cache: 'no-cache'
            }).catch(() => null);
            
            if (response || assetUrl === '/' || assetUrl === '/index.html') {
              await cache.add(urlToCache).catch(e => {
                console.warn(`Service Worker: Failed to cache ${urlToCache}:`, e.message);
                return null;
              });
              console.log(`Service Worker: Successfully cached ${urlToCache}`);
              return true;
            } else {
              console.warn(`Service Worker: Skipping ${urlToCache} - not found`);
              return false;
            }
          } catch (error) {
            console.warn(`Service Worker: Error caching ${assetUrl}:`, error.message);
            return false;
          }
        });
        
        const results = await Promise.allSettled(cachePromises);
        const successful = results.filter(r => r.status === 'fulfilled' && r.value).length;
        console.log(`Service Worker: ${successful}/${ASSETS_TO_CACHE.length} assets cached successfully`);
        
      } catch (error) {
        console.error('Service Worker: Cache setup failed:', error);
      }
    })()
  );
});

// Activate event - CLEANUP
self.addEventListener('activate', event => {
  console.log('Service Worker: Activated');
  
  event.waitUntil(
    (async () => {
      // Cleanup oude caches
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
      
      // Claim alle clients (tabs)
      await self.clients.claim();
      console.log('Service Worker: All clients claimed');
    })()
  );
});

// Fetch event - SMART CACHING
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);
  
  // Skip chrome-extension en andere non-http(s) requests
  if (url.protocol !== 'http:' && url.protocol !== 'https:' && url.protocol !== 'file:') {
    return;
  }
  
  // Skip browser sync en dev tools
  if (url.hostname === 'localhost' && (url.pathname.includes('browser-sync') || url.pathname.includes('sockjs'))) {
    return;
  }
  
  // Voor development: skip hot reload
  if (url.pathname.includes('hot-update')) return;
  
  event.respondWith(
    (async () => {
      try {
        // Probeer eerst cache
        const cachedResponse = await caches.match(event.request, {
          ignoreSearch: true,
          ignoreMethod: true,
          ignoreVary: true
        });
        
        if (cachedResponse) {
          console.log('Service Worker: Serving from cache:', event.request.url);
          return cachedResponse;
        }
        
        // Anders fetch van netwerk
        console.log('Service Worker: Fetching from network:', event.request.url);
        const fetchResponse = await fetch(event.request);
        
        // Check of response geldig is
        if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type === 'opaque') {
          return fetchResponse;
        }
        
        // Clone response voor caching
        const responseToCache = fetchResponse.clone();
        
        // Open cache en sla op (async, wacht niet)
        caches.open(CACHE_NAME).then(cache => {
          // Controleer of URL cachebaar is
          const shouldCache = 
            // HTML pages
            event.request.destination === 'document' ||
            // Stylesheets
            event.request.destination === 'style' ||
            // Scripts
            event.request.destination === 'script' ||
            // Images
            event.request.destination === 'image' ||
            // Manifest
            url.pathname.endsWith('manifest.json') ||
            // Onze specifieke assets
            ASSETS_TO_CACHE.some(asset => url.pathname.endsWith(asset.replace('/', '')));
          
          if (shouldCache) {
            cache.put(event.request, responseToCache).catch(e => {
              console.warn('Service Worker: Failed to cache response:', e.message);
            });
          }
        });
        
        return fetchResponse;
        
      } catch (error) {
        console.log('Service Worker: Fetch failed, checking fallback:', error.message);
        
        // Fallback logica
        if (event.request.destination === 'document' || 
            event.request.headers.get('accept')?.includes('text/html')) {
          const fallback = await caches.match('/index.html');
          if (fallback) return fallback;
        }
        
        // Fallback voor styles
        if (event.request.destination === 'style') {
          const fallback = await caches.match('/css/style.css');
          if (fallback) return fallback;
        }
        
        // Return offline page of error
        return new Response(
          `<h1>Offline</h1>
           <p>U bent offline. Deze pagina is niet beschikbaar.</p>
           <p>Controleer uw internetverbinding en probeer opnieuw.</p>`,
          {
            headers: { 'Content-Type': 'text/html' }
          }
        );
      }
    })()
  );
});

// Message handler voor updates
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME).then(() => {
      console.log('Service Worker: Cache cleared by request');
    });
  }
});

// Background sync (optioneel)
self.addEventListener('sync', event => {
  if (event.tag === 'sync-data') {
    console.log('Service Worker: Background sync started');
    event.waitUntil(syncData());
  }
});

async function syncData() {
  // Hier kun je offline data synchroniseren
  console.log('Service Worker: Syncing data...');
  return Promise.resolve();
}