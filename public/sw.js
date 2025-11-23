// Custom Service Worker for Meet App PWA
// Bump this version whenever deployment should force-refresh clients
const CACHE_NAME = 'meet-app-v4';
// Avoid caching the app shell HTML ('/') to prevent stale deployments
const urlsToCache = [
    '/manifest.json',
    '/vite.svg'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    console.log('Service Worker: Install event');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching files');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('Service Worker: Skip waiting and take control');
                return self.skipWaiting();
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activate event');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('Service Worker: Claiming clients');
            return self.clients.claim();
        })
    );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
    const { request } = event;

    // Network-first for navigation requests (HTML) to always get fresh builds
    if (request.mode === 'navigate') {
        event.respondWith(
            (async () => {
                try {
                    const networkResponse = await fetch(request);
                    return networkResponse;
                } catch (err) {
                    // Fallback to cache if offline
                    const cache = await caches.open(CACHE_NAME);
                    const cached = await cache.match('/');
                    return cached || Response.error();
                }
            })()
        );
        return;
    }

    // For other requests: try cache, then network, and update cache
    event.respondWith(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            const cached = await cache.match(request);
            if (cached) return cached;
            try {
                const networkResponse = await fetch(request);
                // Clone and store in cache (best-effort)
                cache.put(request, networkResponse.clone());
                return networkResponse;
            } catch (err) {
                return Response.error();
            }
        })()
    );
});

// Push notification support (for future use)
self.addEventListener('push', () => {
    console.log('Service Worker: Push event received');
});