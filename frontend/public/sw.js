/**
 * CodeVault Pro - Service Worker for PWA & Offline App Shell
 * Version: 2.1.0
 */

const CACHE_NAME = 'codevault-app-shell-v2.1.0';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
];

// Install Event: Pre-cache App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Pre-caching non-fatal warning:', err);
      });
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate Event: Cleanup Obsolete Caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('codevault-') && name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch Event: Cache-First for App Shell & Static Assets; Network-Only for APIs
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Never cache API, auth, or AI requests
  if (
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/auth') ||
    url.hostname.includes('nvidia') ||
    url.hostname.includes('googleapis') ||
    url.hostname.includes('openai')
  ) {
    return; // Normal network request
  }

  // 2. Navigation requests: return index.html for SPA offline routing
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/index.html') || caches.match('/');
      })
    );
    return;
  }

  // 3. Static Assets (JS, CSS, Images, Fonts): Cache-First with Network Fallback
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(event.request).then((response) => {
        if (
          !response ||
          response.status !== 200 ||
          response.type !== 'basic'
        ) {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      }).catch(() => {
        // Return empty or fallback if asset fetch fails offline
        return cached;
      });
    })
  );
});
