const CACHE = 'dcr-gym-v2';
const ASSETS = ['./index.html', './programs.js', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

// Navigations: network-first so deploys arrive on next launch; cache keeps the
// app fully functional offline. Static assets: cache-first for speed.
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
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
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(net => {
      if (url.origin === self.location.origin) {
        const copy = net.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
      }
      return net;
    }).catch(() => caches.match('./index.html')))
  );
});

// ── Rest-timer notification — fires if the phone is locked / app backgrounded ─
let restTimerId = null;

self.addEventListener('message', e => {
  const msg = e.data || {};
  if (msg.type === 'SCHEDULE_NOTIFICATION') {
    if (restTimerId) clearTimeout(restTimerId);
    restTimerId = setTimeout(() => {
      restTimerId = null;
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
  if (msg.type === 'CANCEL_NOTIFICATION') {
    if (restTimerId) { clearTimeout(restTimerId); restTimerId = null; }
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
