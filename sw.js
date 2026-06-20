const CACHE = 'dcr-gym-v11';
const ASSETS = ['./index.html', './programs.js', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  // Do NOT skipWaiting unconditionally — the app shows an "update ready" chip
  // and the user restarts on THEIR terms (mid-workout reloads are banned).
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

// ── Fetch strategy — true OTA ─────────────────────────────────────────────────
// Navigations: network-first. Every launch with signal gets the newest build;
// cache is the offline fallback only.
// Same-origin assets: stale-while-revalidate. Served instantly from cache,
// refreshed in the background — programs.js updates flow without reinstalls
// or even a service-worker version bump.
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;

  const isNav = e.request.mode === 'navigate' || url.pathname.endsWith('/index.html');
  if (isNav) {
    e.respondWith(
      fetch(e.request)
        .then(r => {
          const copy = r.clone();
          caches.open(CACHE).then(c => c.put('./index.html', copy)).catch(() => {});
          return r;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        const refetch = fetch(e.request).then(net => {
          if (net && net.ok) {
            const copy = net.clone();
            caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
          }
          return net;
        }).catch(() => cached);
        return cached || refetch;
      })
    );
    return;
  }
  // Cross-origin (fonts, GIS, Health API): straight to network.
});

// ── Update handshake — the app's update chip triggers the swap ───────────────
self.addEventListener('message', e => {
  const msg = e.data || {};
  const type = typeof msg === 'string' ? msg : msg.type;

  if (type === 'SKIP_WAITING') { self.skipWaiting(); return; }

  // Rest-timer notification — fires if the phone is locked / app backgrounded
  if (type === 'SCHEDULE_NOTIFICATION') {
    if (self.__restTimer) clearTimeout(self.__restTimer);
    self.__restTimer = setTimeout(() => {
      self.__restTimer = null;
      self.registration.showNotification('Lock In DCR!', {
        body: 'Rest over — next set is waiting.',
        icon: './icon-192.png',
        badge: './icon-192.png',
        vibrate: [60, 70, 60, 70, 110],
        tag: 'dcr-rest',
        renotify: true,
      }).catch(() => {});
    }, Math.max(0, msg.delay || 0));
  }
  if (type === 'CANCEL_NOTIFICATION') {
    if (self.__restTimer) { clearTimeout(self.__restTimer); self.__restTimer = null; }
    self.registration.getNotifications({ tag: 'dcr-rest' })
      .then(ns => ns.forEach(n => n.close()))
      .catch(() => {});
  }
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) { if ('focus' in c) return c.focus(); }
      return self.clients.openWindow('./index.html');
    })
  );
});
