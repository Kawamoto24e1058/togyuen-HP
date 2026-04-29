const CACHE_NAME = 'togyuen-v1';

// キャッシュするアセット
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.svg',
  '/icon-192.png',
  '/icon-512.png'
];

// インストール: 静的アセットを事前キャッシュ
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// アクティベート: 古いキャッシュを削除
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// フェッチ: Network First（失敗時にキャッシュ返却）
self.addEventListener('fetch', (event) => {
  // POST・API・Notionリクエストはキャッシュしない
  if (
    event.request.method !== 'GET' ||
    event.request.url.includes('notion') ||
    event.request.url.includes('googleapis') ||
    event.request.url.includes('fonts.g') ||
    event.request.url.startsWith('chrome-extension')
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 正常レスポンスをキャッシュに保存
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // オフライン時はキャッシュから返す
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          // ナビゲーションリクエストはトップページを返す
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
        });
      })
  );
});
