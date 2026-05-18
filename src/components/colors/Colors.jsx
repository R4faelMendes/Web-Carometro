import { createContext, useState, useContext, useEffect } from "react";
import { lightTheme, darkTheme } from "../../theme/theme";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");

    if (saved === "dark") return true;
    if (saved === "light") return false;

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const theme = darkMode ? darkTheme : lightTheme;

  function toggleTheme() {
    setDarkMode((prev) => {
      const newValue = !prev;

      localStorage.setItem("theme", newValue ? "dark" : "light");

      return newValue;
    });
  }

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