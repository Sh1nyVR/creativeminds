window.addEventListener("load", () => {
  navigator.serviceWorker.register("/interstellar/sw.js?v=5-5-2024", {
    scope: "/interstellar/",
  })
})

const form = document.getElementById("fs")
const input = document.getElementById("is")

if (form && input) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault()
    if (window.top.location.pathname === "/interstellar/tabs.html") {
      processUrl(input.value, "")
    } else {
      processUrl(input.value, "/interstellar/tabs.html")
    }
  })
}
function processUrl(value, path) {
  let url = value.trim()
  const engine = localStorage.getItem("engine")
  const searchUrl = engine ? engine : "https://www.google.com/search?q="

  if (!isUrl(url)) {
    url = searchUrl + url
  } else if (!(url.startsWith("https://") || url.startsWith("http://"))) {
    url = "https://" + url
  }

  sessionStorage.setItem("GoUrl", __uv$config.encodeUrl(url))
  const dy = localStorage.getItem("dy")

  const target = dy === "true" ? "/interstellar/a/q/" + __uv$config.encodeUrl(url) : "/interstellar/a/" + __uv$config.encodeUrl(url)

  if (path) {
    location.href = path
    return
  }

  navigateToProxyTarget(target)
}

function go(value) {
  processUrl(value, "/interstellar/tabs.html")
}

function blank(value) {
  processUrl(value)
}

function dy(value) {
  processUrl(value, "/interstellar/a/q/" + __uv$config.encodeUrl(value))
}

function isUrl(val = "") {
  if (/^http(s?):\/\//.test(val) || (val.includes(".") && val.substr(0, 1) !== " ")) {
    return true
  }
  return false
}

async function waitForInterstellarServiceWorker(timeoutMs = 4000) {
  if (!("serviceWorker" in navigator)) return false

  try {
    await navigator.serviceWorker.register("/interstellar/sw.js?v=5-5-2024", {
      scope: "/interstellar/",
    })
  } catch (e) {
    return false
  }

  try {
    await Promise.race([
      navigator.serviceWorker.ready,
      new Promise((resolve) => setTimeout(resolve, timeoutMs)),
    ])
  } catch (e) {}

  if (navigator.serviceWorker.controller) return true

  await new Promise((resolve) => {
    let done = false
    const finish = () => {
      if (done) return
      done = true
      resolve()
    }
    const timer = setTimeout(() => {
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange)
      finish()
    }, timeoutMs)
    const onControllerChange = () => {
      clearTimeout(timer)
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange)
      finish()
    }
    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange)
  })

  return !!navigator.serviceWorker.controller
}

async function navigateToProxyTarget(target) {
  const hasController = await waitForInterstellarServiceWorker()
  if (hasController) {
    window.location.href = target
    return
  }

  // Fallback: avoid hard 404 if SW still isn't controlling this page yet.
  window.location.href = "/interstellar/tabs.html"
}

