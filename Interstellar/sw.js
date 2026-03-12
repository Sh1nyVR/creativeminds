importScripts("/interstellar/dy/config.js?v=12")
importScripts("/interstellar/dy/worker.js?v=12")
importScripts("/interstellar/assets/-/bundle.js?v=5-5-2024")
importScripts("/interstellar/assets/-/config.js?v=5-5-2024")
importScripts(__uv$config.sw || "/interstellar/assets/-/sw.js?v=2")

const uv = new UVServiceWorker()
const dynamic = new Dynamic()

let userKey = new URL(location).searchParams.get("userkey")
self.dynamic = dynamic

self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async function () {
      if (await dynamic.route(event)) {
        return await dynamic.fetch(event)
      }

      if (event.request.url.startsWith(location.origin + "/interstellar/a/")) {
        return await uv.fetch(event)
      }

      return await fetch(event.request)
    })()
  )
})

