import { createContext, useEffect, useState } from "react"

// membuat context tema
export const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  // ambil tema dari localStorage (jika ada)
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  )

  // setiap tema berubah, simpan ke localStorage
  useEffect(() => {
    document.body.className = theme
    localStorage.setItem("theme", theme)
  }, [theme])

  // fungsi untuk toggle tema
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
