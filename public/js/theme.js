function changeTheme() {
  const element = document.documentElement
  const isHome = window.location.pathname === "/"
  const currentUserTheme = localStorage.theme === "dark" ? "dark" : "light"
  const newUserTheme = currentUserTheme === "dark" ? "light" : "dark"
  // The home page hero is always dark; only the stored preference changes there.
  const theme = isHome ? "dark" : newUserTheme

  const css = document.createElement("style")

  css.appendChild(
    document.createTextNode(
      `* {
           -webkit-transition: none !important;
           -moz-transition: none !important;
           -o-transition: none !important;
           -ms-transition: none !important;
           transition: none !important;
        }`,
    ),
  )
  document.head.appendChild(css)

  if (theme === "dark") {
    element.classList.add("dark")
  } else {
    element.classList.remove("dark")
  }

  window.getComputedStyle(css).opacity
  document.head.removeChild(css)
  // Persist the user's actual preference, not the home page's forced dark value.
  localStorage.theme = newUserTheme
}

function preloadTheme() {
  const isHome = window.location.pathname === "/"
  const theme = (() => {
    if (isHome) return "dark"
    const userTheme = localStorage.theme

    if (userTheme === "light" || userTheme === "dark") {
      return userTheme
    } else {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    }
  })()

  const element = document.documentElement

  if (theme === "dark") {
    element.classList.add("dark")
  } else {
    element.classList.remove("dark")
  }

  // Only persist a real user preference; never force "dark" for the home page.
  if (!isHome) {
    localStorage.theme = theme
  }
}

window.onload = () => {
  function initializeThemeButtons() {
    const headerThemeButton = document.getElementById("header-theme-button")
    const drawerThemeButton = document.getElementById("drawer-theme-button")
    headerThemeButton?.addEventListener("click", changeTheme)
    drawerThemeButton?.addEventListener("click", changeTheme)
  } 
  
  document.addEventListener("astro:after-swap", initializeThemeButtons)
  initializeThemeButtons()
}

document.addEventListener("astro:after-swap", preloadTheme)

preloadTheme()
