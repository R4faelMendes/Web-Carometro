import { createContext, useState, useContext } from "react";
import { lightTheme, darkTheme } from "./theme";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  const theme = darkMode ? darkTheme : lightTheme;

  function toggleTheme() {
    setDarkMode(prev => !prev);
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, darkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}