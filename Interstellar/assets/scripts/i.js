window.addEventListener("load", () => {
  navigator.serviceWorker.register("/static/interstellar/sw.js?v=5-5-2024", {
    scope: "/static/interstellar/",
  })
})

const form = document.getElementById("fs")
const input = document.getElementById("is")

if (form && input) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault()
    if (window.top.location.pathname === "/static/interstellar/tabs.html") {
      processUrl(input.value, "")
    } else {
      processUrl(input.value, "/static/interstellar/tabs.html")
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

  if (dy === "true") {
    window.location.href = "/static/interstellar/a/q/" + __uv$config.encodeUrl(url)
  } else {
    if (path) {
      location.href = path
    } else {
      window.location.href = "/static/interstellar/a/" + __uv$config.encodeUrl(url)
    }
  }
}

function go(value) {
  processUrl(value, "/static/interstellar/tabs.html")
}

function blank(value) {
  processUrl(value)
}

function dy(value) {
  processUrl(value, "/static/interstellar/a/q/" + __uv$config.encodeUrl(value))
}

function isUrl(val = "") {
  if (/^http(s?):\/\//.test(val) || (val.includes(".") && val.substr(0, 1) !== " ")) {
    return true
  }
  return false
}

