// 앱 설치 조건용 서비스 워커. 화면은 늘 인터넷에서 새로 받고(폰 저장본 안 씀), 끊겼을 때만 마지막 화면을 보여 줌.
// 말씀(data.json), 녹음, 사진은 건드리지 않음(매일 새벽 바뀜).
const C = "malsseum-v2";
self.addEventListener("install", e => { self.skipWaiting(); e.waitUntil(caches.open(C).then(c => c.add(new Request("./", { cache: "reload" })))); });
self.addEventListener("activate", e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())
));
self.addEventListener("fetch", e => {
  if (e.request.mode !== "navigate") return;
  e.respondWith(fetch(e.request.url, { cache: "no-cache", credentials: "same-origin" }).then(r => {
    const copy = r.clone(); caches.open(C).then(c => c.put("./", copy)); return r;
  }).catch(() => caches.match("./")));
});
