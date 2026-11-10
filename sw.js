// Service worker de Press Turn.
// - Código (html/js/css): primero la red, así los cambios y capítulos nuevos llegan al instante. Sin red, usa lo guardado.
// - Imágenes y fuentes: guardadas y refrescadas en segundo plano.
// - API, login, música y voces: nunca se guardan.
const V = 'pt-v1';
const BASE = ['/', '/estilo.css', '/musica.js', '/reproductor.js', '/interfaz.js', '/pantallas.js', '/dialogos.js', '/novela.js', '/historia.js', '/combate2.js',
  '/img/icon-192.png', '/img/icon-512.png', '/fuentes/thempo.ttf'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => Promise.all(BASE.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin !== location.origin) return;
  const p = u.pathname;
  if (p.startsWith('/api/') || p.startsWith('/auth/') || p.startsWith('/musica') || p.startsWith('/voces/') || r.headers.has('range')) return;

  if (r.mode === 'navigate' || /\.(js|css|html|webmanifest)$/.test(p) || p === '/') {
    e.respondWith(fetch(r).then(res => {
      if (res.ok) { const c = res.clone(); caches.open(V).then(ca => ca.put(r.mode === 'navigate' ? '/' : r, c)); }
      return res;
    }).catch(() => caches.match(r.mode === 'navigate' ? '/' : r).then(x => x || Response.error())));
    return;
  }
  if (p.startsWith('/img/') || p.startsWith('/img_historia/') || p.startsWith('/fuentes/')) {
    e.respondWith(caches.open(V).then(ca => ca.match(r).then(hit => {
      const red = fetch(r).then(res => { if (res.ok) ca.put(r, res.clone()); return res; }).catch(() => hit);
      return hit || red;
    })));
  }
});
