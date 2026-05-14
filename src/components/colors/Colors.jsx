import { createContext, useState, useContext, useEffect } from "react";
import { lightTheme, darkTheme } from "../../theme/theme";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {

  // 🔥 CARREGA DO LOCALSTORAGE ANTES DE RENDERIZAR
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");

    if (saved === "dark") return true;
    if (saved === "light") return false;

    // fallback: preferência do sistema
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const theme = darkMode ? darkTheme : lightTheme;

  function toggleTheme() {
    setDarkMode((prev) => {
      const newValue = !prev;

      // 🔥 SALVA NA HORA
      localStorage.setItem("theme", newValue ? "dark" : "light");

      return newValue;
    });
  }

  // 🔥 GARANTE que sempre esteja salvo (backup)
  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, darkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}