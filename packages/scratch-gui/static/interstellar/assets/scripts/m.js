/*
LICENSE_SERVER_URL = "https://main.gointerstellar.app/validate?license="
async function checkLicense(pass) {
  if (localStorage["LICENSE_CHECK"]) {
    return true
  }
  licenseCheck = (await (await fetch(LICENSE_SERVER_URL + pass + "&host=" + location.origin)).json())["status"]
  if (licenseCheck == "License valid") {
    localStorage["LICENSE_CHECK"] = true
    return true
  }
  return false
} */

/* document.addEventListener("DOMContentLoaded", function () {
  let ads = localStorage.getItem("ads")
  if (ads === null || ads === "default" || ads === "true") {
    localStorage.setItem("ads", "on")
    ads = "on"
  } else if (ads === "popups") {
    ads = "popups"
  } else if (ads === "off2") {
    ads = "off2"
  }

  let div = document.getElementById("adv")
  let div2 = document.getElementById("adv2")
  if (div) {
    if (ads === "on") {
      let scripts = ["//alleygoat.com/4d/2f/92/4d2f92b8c68718dd3efb74b9f9b5fa4e.js", "//alleygoat.com/87/17/b8/8717b825d69c8461460199fb3c6249e4.js"]

      scripts.forEach(function (src) {
        let script = document.createElement("script")
        script.type = "text/javascript"
        script.src = src
        div.appendChild(script)
      })
    } else if (ads === "popups") {
      let scripts = ["//alleygoat.com/4d/2f/92/4d2f92b8c68718dd3efb74b9f9b5fa4e.js"]

      scripts.forEach(function (src) {
        let script = document.createElement("script")
        script.type = "text/javascript"
        script.src = src
        div.appendChild(script)
      })
    } else if (ads === "off2") {
      advDiv.remove()
    }
  } else if (div2 && ads != "off2") {
    let scripts = ["//alleygoat.com/4d/2f/92/4d2f92b8c68718dd3efb74b9f9b5fa4e.js"]
    scripts.forEach(function (src) {
      let script = document.createElement("script")
      script.type = "text/javascript"
      script.src = src
      div.appendChild(script)
    })
  }
})
*/
// Dynamic & Ads
document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("dy") === null || localStorage.getItem("dy") === undefined) {
    localStorage.setItem("dy", "false")
  }
})
// Nav
var nav = document.querySelector(".fixed-nav-bar")

if (nav) {
  var themeId = localStorage.getItem("theme")
  var LogoUrl = "/static/interstellar/assets/media/favicon/main.png"
  var LogoUrl
  if (themeId === "Inverted") {
    LogoUrl = "/static/interstellar/assets/media/favicon/main-inverted.png"
  } else {
    LogoUrl = LogoUrl
  }
  var html = `
    <div class="fixed-nav-bar-container">
      <a class="icon" href="/static/interstellar/index.html"><img alt="nav" id="INImg" src="${LogoUrl}"/></a>
    </div>
    <div class="fixed-nav-bar-right">
      <a class="navbar-link" href="/static/interstellar/games.html"><i class="fa-solid fa-gamepad navbar-icon"></i><an>Ga</an><an>mes</an></a>
      <a class="navbar-link" href="/static/interstellar/apps.html"><i class="fa-solid fa-phone navbar-icon"></i><an>Ap</an><an>ps</an></a>
      <a class="navbar-link" href="/static/interstellar/tools.html"><i class="fa-solid fa-folder navbar-icon"></i><an>To</an><an>ols</an></a>
      ${!(window.top !== window || window.location.pathname === "/static/interstellar/tabs.html") ? '<a class="navbar-link" href="/static/interstellar/tabs.html"><i class="fa-solid fa-laptop navbar-icon"></i><an>Ta</an><an>bs</an></a>' : ""}
      <a class="navbar-link" href="/static/interstellar/settings.html"><i class="fa-solid fa-gear navbar-icon settings-icon"></i><an>Set</an><an>tings</an></a>
    </div>`
  nav.innerHTML = html
}

// Themes
var themeid = localStorage.getItem("theme")
themeEle = document.createElement("link")
themeEle.rel = "stylesheet"
if (themeid == "catppuccinMocha") {
  themeEle.href = "/static/interstellar/assets/css/themes/catppuccin/mocha.css?v=1"
  document.body.appendChild(themeEle)
}
if (themeid == "catppuccinMacchiato") {
  themeEle.href = "/static/interstellar/assets/css/themes/catppuccin/macchiato.css?v=1"
  document.body.appendChild(themeEle)
}
if (themeid == "catppuccinFrappe") {
  themeEle.href = "/static/interstellar/assets/css/themes/catppuccin/frappe.css?v=1"
  document.body.appendChild(themeEle)
}
if (themeid == "catppuccinLatte") {
  themeEle.href = "/static/interstellar/assets/css/themes/catppuccin/latte.css?v=1"
  document.body.appendChild(themeEle)
}
if (themeid == "Inverted") {
  themeEle.href = "/static/interstellar/assets/css/themes/colors/inverted.css?v=2"
  document.body.appendChild(themeEle)
} else {
  var customThemeEle = document.createElement("style")
  customThemeEle.textContent = localStorage.getItem("theme-" + themeid)
  document.head.appendChild(customThemeEle)
}
// Tab Cloaker
document.addEventListener("DOMContentLoaded", function (event) {
  const icon = document.getElementById("tab-favicon")
  const name = document.getElementById("tab-title")
  const selectedValue = localStorage.getItem("selectedOption")

  function setCloak(nameValue, iconUrl) {
    const customName = localStorage.getItem("CustomName")
    const customIcon = localStorage.getItem("CustomIcon")

    if (customName) {
      nameValue = customName
    }
    if (customIcon) {
      iconUrl = customIcon
    }

    if (iconUrl) {
      icon.setAttribute("href", iconUrl)
      localStorage.setItem("icon", iconUrl)
    }
    if (nameValue) {
      name.textContent = nameValue
      localStorage.setItem("name", nameValue)
    }
  }

  const options = {
    Google: { name: "Google", icon: "/static/interstellar/assets/media/favicon/google.png" },
    "Savvas Realize": { name: "Savvas Realize", icon: "/static/interstellar/assets/media/favicon/savvas-realize.png" },
    SmartPass: { name: "SmartPass", icon: "/static/interstellar/assets/media/favicon/smartpass.png" },
    "World Book Online - Super Home": { name: "Super Home Page", icon: "/static/interstellar/assets/media/favicon/wbo.ico" },
    "World Book Online - Student": { name: "WBO Student | Home Page", icon: "/static/interstellar/assets/media/favicon/wbo.ico" },
    "World Book Online - Timelines": { name: "Timelines - Home Page", icon: "/static/interstellar/assets/media/favicon/wbo.ico" },
    Naviance: { name: "Naviance Student", icon: "/static/interstellar/assets/media/favicon/naviance.png" },
    "PBS Learning Media": {
      name: "PBS LearningMedia | Teaching Resources For Students And Teachers",
      icon: "/static/interstellar/assets/media/favicon/pbslearningmedia.ico",
    },
    "PBS Learning Media Student Home": { name: "Student Homepage | PBS LearningMedia", icon: "/static/interstellar/assets/media/favicon/pbslearningmedia.ico" },
    Drive: { name: "My Drive - Google Drive", icon: "/static/interstellar/assets/media/favicon/drive.png" },
    Classroom: { name: "Home", icon: "/static/interstellar/assets/media/favicon/classroom.png" },
    Schoology: { name: "Home | Schoology", icon: "/static/interstellar/assets/media/favicon/schoology.png" },
    Gmail: { name: "Gmail", icon: "/static/interstellar/assets/media/favicon/gmail.png" },
    Clever: { name: "Clever | Portal", icon: "/static/interstellar/assets/media/favicon/clever.png" },
    Khan: { name: "Dashboard | Khan Academy", icon: "/static/interstellar/assets/media/favicon/khan.png" },
    Dictionary: { name: "Dictionary.com | Meanings & Definitions of English Words", icon: "/static/interstellar/assets/media/favicon/dictionary.png" },
    Thesaurus: { name: "Synonyms and Antonyms of Words | Thesaurus.com", icon: "/static/interstellar/assets/media/favicon/thesaurus.png" },
    Campus: { name: "Infinite Campus", icon: "/static/interstellar/assets/media/favicon/campus.png" },
    IXL: { name: "IXL | Dashboard", icon: "/static/interstellar/assets/media/favicon/ixl.png" },
    Canvas: { name: "Dashboard", icon: "/static/interstellar/assets/media/favicon/canvas.png" },
    LinkIt: { name: "Test Taker", icon: "/static/interstellar/assets/media/favicon/linkit.ico" },
    Edpuzzle: { name: "Edpuzzle", icon: "/static/interstellar/assets/media/favicon/edpuzzle.png" },
    "i-Ready Math": { name: "Math To Do, i-Ready", icon: "/static/interstellar/assets/media/favicon/i-ready.ico" },
    "i-Ready Reading": { name: "Reading To Do, i-Ready", icon: "/static/interstellar/assets/media/favicon/i-ready.ico" },
    "ClassLink Login": { name: "Login", icon: "/static/interstellar/assets/media/favicon/classlink-login.png" },
    "Google Meet": { name: "Google Meet", icon: "/static/interstellar/assets/media/favicon/google-meet.png" },
    "Google Docs": { name: "Google Docs", icon: "/static/interstellar/assets/media/favicon/google-docs.ico" },
    "Google Slides": { name: "Google Slides", icon: "/static/interstellar/assets/media/favicon/google-slides.ico" },
    Wikipedia: { name: "Wikipedia", icon: "/static/interstellar/assets/media/favicon/wikipedia.png" },
    Britannica: { name: "Encyclopedia Britannica | Britannica", icon: "/static/interstellar/assets/media/favicon/britannica.png" },
    Ducksters: { name: "Ducksters", icon: "/static/interstellar/assets/media/favicon/ducksters.png" },
    Minga: { name: "Minga – Creating Amazing Schools", icon: "/static/interstellar/assets/media/favicon/minga.png" },
    "i-Ready Learning Games": { name: "Learning Games, i-Ready", icon: "/static/interstellar/assets/media/favicon/i-ready.ico" },
    "NoRedInk Home": { name: "Student Home | NoRedInk", icon: "/static/interstellar/assets/media/favicon/noredink.webp" },
    "Newsela Binder": { name: "Newsela | Binder", icon: "/static/interstellar/assets/media/favicon/newsela.png" },
    "Newsela Assignments": { name: "Newsela | Assignments", icon: "/static/interstellar/assets/media/favicon/newsela.png" },
    "Newsela Home": { name: "Newsela | Instructional Content Platform", icon: "/static/interstellar/assets/media/favicon/newsela.png" },
    "PowerSchool Sign In": { name: "Student and Parent Sign In", icon: "/static/interstellar/assets/media/favicon/powerschool.png" },
    "PowerSchool Grades and Attendance": {
      name: "Grades and Attendance",
      icon: "/static/interstellar/assets/media/favicon/powerschool.png",
    },
    "PowerSchool Teacher Comments": { name: "Teacher Comments", icon: "/static/interstellar/assets/media/favicon/powerschool.png" },
    "PowerSchool Standards Grades": { name: "Standards Grades", icon: "/static/interstellar/assets/media/favicon/powerschool.png" },
    "PowerSchool Attendance": { name: "Attendance", icon: "/static/interstellar/assets/media/favicon/powerschool.png" },
    Nearpod: { name: "Nearpod", icon: "/static/interstellar/assets/media/favicon/nearpod.png" },
    StudentVUE: { name: "StudentVUE", icon: "/static/interstellar/assets/media/favicon/studentvue.ico" },
    "Quizlet Home": {
      name: "Flashcards, learning tools and textbook solutions | Quizlet",
      icon: "/static/interstellar/assets/media/favicon/quizlet.webp",
    },
    "Google Forms Locked Mode": { name: "Start your quiz", icon: "/static/interstellar/assets/media/favicon/googleforms.png" },
    DeltaMath: { name: "DeltaMath", icon: "/static/interstellar/assets/media/favicon/deltamath.png" },
    Kami: { name: "Kami", icon: "/static/interstellar/assets/media/favicon/kami.png" },
    "GoGuardian Admin Restricted": { name: "Restricted", icon: "/static/interstellar/assets/media/favicon/goguardian-lock.png" },
    "GoGuardian Teacher Block": { name: "Uh oh!", icon: "/static/interstellar/assets/media/favicon/goguardian.png" },
    "World History Encyclopedia": {
      name: "World History Encyclopedia",
      icon: "/static/interstellar/assets/media/favicon/worldhistoryencyclopedia.png",
    },
    "Big Ideas Math Assignment Player": { name: "Assignment Player", icon: "/static/interstellar/assets/media/favicon/bim.ico" },
    "Big Ideas Math": { name: "Big Ideas Math", icon: "/static/interstellar/assets/media/favicon/bim.ico" },
  }

  if (options[selectedValue]) {
    setCloak(options[selectedValue].name, options[selectedValue].icon)
  }
})
// Key
document.addEventListener("DOMContentLoaded", function () {
  const eventKey = JSON.parse(localStorage.getItem("eventKey")) || ["Ctrl", "E"]
  const pLink = localStorage.getItem("pLink") || "https://classroom.google.com/"
  let pressedKeys = []

  document.addEventListener("keydown", function (event) {
    pressedKeys.push(event.key)
    if (pressedKeys.length > eventKey.length) {
      pressedKeys.shift()
    }
    if (eventKey.every((key, index) => key === pressedKeys[index])) {
      window.location.href = pLink
      pressedKeys = []
    }
  })
})
// Background Image
document.addEventListener("DOMContentLoaded", function () {
  var savedBackgroundImage = localStorage.getItem("backgroundImage")
  if (savedBackgroundImage) {
    document.body.style.backgroundImage = "url('" + savedBackgroundImage + "')"
  }
})

