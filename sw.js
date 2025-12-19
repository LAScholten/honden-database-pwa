// sw.js - DISABLED SERVICE WORKER
// Dit bestand voorkomt 404 errors maar doet niets

console.log('Service Worker: Disabled - alleen voor 404 preventie');

self.addEventListener('install', function(event) {
  console.log('SW: Install (disabled)');
  // Skip waiting
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  console.log('SW: Activate (disabled)');
  event.waitUntil(self.clients.claim());
});

// Gewoon alle requests doorsturen zonder caching
self.addEventListener('fetch', function(event) {
  event.respondWith(fetch(event.request));
});