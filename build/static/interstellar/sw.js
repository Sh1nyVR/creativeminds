importScripts("/static/interstellar/dy/config.js?v=12")
importScripts("/static/interstellar/dy/worker.js?v=12")
importScripts("/static/interstellar/assets/-/bundle.js?v=5-5-2024")
importScripts("/static/interstellar/assets/-/config.js?v=5-5-2024")
importScripts(__uv$config.sw || "/static/interstellar/assets/-/sw.js?v=2")

const uv = new UVServiceWorker()
const dynamic = new Dynamic()

let userKey = new URL(location).searchParams.get("userkey")
self.dynamic = dynamic

self.addEventListener("install", () => {
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
})

self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async function () {
      if (await dynamic.route(event)) {
        return await dynamic.fetch(event)
      }

      if (event.request.url.startsWith(location.origin + "/static/interstellar/a/")) {
        return await uv.fetch(event)
      }

      return await fetch(event.request)
    })()
  )
})

