// Service Worker — 全球风能锂电人才搜索雷达
// 基础离线缓存策略，不影响桌面端。

const CACHE_NAME = "wle-talent-radar-v1"
const OFFLINE_HTML = "/offline.html"

// 预缓存核心资源（仅关键页面）
const PRECACHE_URLS = [
  "/",
  "/login",
  "/dashboard",
  "/candidates",
  "/offline.html",
  "/manifest.json",
]

// 安装：预缓存关键资源
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS)
    })
  )
  self.skipWaiting()
})

// 激活：清理旧缓存
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key)
        })
      )
    ).then(() => self.clients.claim())
  )
})

// 拦截请求：缓存优先（仅 GET）
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached
      return fetch(event.request)
        .then((response) => {
          // 仅缓存同源成功响应
          if (
            response &&
            response.status === 200 &&
            response.type === "basic"
          ) {
            const cloned = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, cloned)
            })
          }
          return response
        })
        .catch(() => {
          // 导航请求离线兜底
          if (event.request.mode === "navigate") {
            return caches.match(OFFLINE_HTML)
          }
          return new Response("", { status: 503, statusText: "Offline" })
        })
    })
  )
})

// 监听「安装 PWA」消息
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
})
