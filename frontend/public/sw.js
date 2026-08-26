/**
 * CodeVault Pro - Service Worker for PWA & Offline App Shell
 * Version: 3.0.0
 * - Caches app shell for offline navigation
 * - Network-only for API, auth, and AI calls
 * - Study materials are stored in IndexedDB by the app (not cached here)
 */

const CACHE_NAME = 'codevault-app-shell-v3.0.0';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
];

// Install: Pre-cache App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Pre-caching non-fatal warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: Cleanup Obsolete Caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('codevault-') && name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Cache-First for App Shell; Network-Only for APIs
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Never cache API, auth, or upstream AI provider calls
  if (
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/auth') ||
    url.hostname.includes('googleapis') ||
    url.hostname.includes('integrate.api') ||
    url.hostname.includes('openai')
  ) {
    return; // Fall through to normal network
  }

  // 2. Navigation requests: SPA shell fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/index.html') || caches.match('/');
      })
    );
    return;
  }

  // 3. Static Assets: Cache-First with Network Fallback
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      }).catch(() => cached);
    })
  );
});