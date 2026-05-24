const CACHE_NAME = 'dcrgym-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,400;1,600&display=swap'
];

// Install: cache all assets including font stylesheet
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Cache local assets
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json'
      ]).then(() => {
        // Also try to cache the Google Font stylesheet (may fail offline — that's ok)
        return fetch('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,400;1,600&display=swap')
          .then(resp => {
            if (resp.ok) {
              cache.put('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,400;1,600&display=swap', resp.clone());
              // Parse font URL from CSS and cache the actual font file
              return resp.text().then(css => {
                const urls = [...css.matchAll(/url\(([^)]+)\)/g)].map(m => m[1].replace(/['"]/g,''));
                return Promise.all(urls.map(url =>
                  fetch(url).then(r => r.ok ? cache.put(url, r) : null).catch(() => null)
                ));
              });
            }
          }).catch(() => null);
      });
    })
  );
  self.skipWaiting();
});

// Activate: clear old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: cache-first strategy
self.addEventListener('fetch', e => {
  // Skip non-GET requests
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(resp => {
        if (resp && resp.ok) {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return resp;
      }).catch(() => cached || new Response('Offline', { status: 503 }));
    })
  );
});

// ── Rest Timer Notifications ──────────────────────────────────────────────────
// Main thread sends { type: 'SCHEDULE_NOTIFICATION', delay: ms } when rest starts
// and { type: 'CANCEL_NOTIFICATION' } when user returns before timer expires.

let notificationTimer = null;

self.addEventListener('message', e => {
  if (!e.data) return;

  if (e.data.type === 'SCHEDULE_NOTIFICATION') {
    // Cancel any existing scheduled notification
    if (notificationTimer) clearTimeout(notificationTimer);

    const delay = e.data.delay; // milliseconds until timer expires
    if (delay <= 0) return;

    notificationTimer = setTimeout(() => {
      notificationTimer = null;
      self.registration.showNotification('DCR Gym', {
        body: 'Lock In DCR!',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        vibrate: [100, 50, 200, 50, 100],
        tag: 'rest-timer',
        renotify: true,
        requireInteraction: false,
        silent: false
      });
    }, delay);
  }

  if (e.data.type === 'CANCEL_NOTIFICATION') {
    if (notificationTimer) {
      clearTimeout(notificationTimer);
      notificationTimer = null;
    }
    // Close any visible rest-timer notification
    self.registration.getNotifications({ tag: 'rest-timer' })
      .then(notifs => notifs.forEach(n => n.close()))
      .catch(() => null);
  }
});

// Notification click: focus or open the app
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});
