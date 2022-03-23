import React from 'react'

const getInitialTheme = () => {
let theme = 'dark'
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedPrefs = window.localStorage.getItem('color-theme')
    if (typeof storedPrefs === 'string') {
      theme = storedPrefs
    }
    const userMedia = window.matchMedia('(prefers-color-scheme: dark)')
    if (userMedia.matches) {
        theme = 'dark'
    }
  }
  // If you want to use dark theme as the default, return 'dark' instead
  return theme
}

export const ThemeContext = React.createContext(undefined)

export const ThemeProvider = ({ initialTheme, children }) => {
  const [theme, setTheme] = React.useState(getInitialTheme)

  React.useEffect(() => {
    const rawSetTheme = (rawTheme) => {
      const root = typeof window !== 'undefined' ? window.document.documentElement : null

      const isDark = rawTheme === 'dark'
      root.classList.remove(isDark ? 'light' : 'dark')
      root.classList.add(rawTheme)
      localStorage.setItem('color-theme', rawTheme)
    }
    if (initialTheme) {
      rawSetTheme(initialTheme)
    }

    rawSetTheme(theme)
  }, [initialTheme, theme])
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}
