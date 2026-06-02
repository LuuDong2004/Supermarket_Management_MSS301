// context/ThemeContext.jsx
import { createContext, useState, useCallback, useEffect } from 'react';
import { storage, SESSION_KEYS } from '../utils/storage';
import { THEME_MODES } from '../configs/constants';

export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return storage.get(SESSION_KEYS.THEME) || THEME_MODES.LIGHT;
  });

  // Sync theme with html element's data-bs-theme and data-sidebar-colors attributes (Bootstrap)
  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
    document.documentElement.setAttribute('data-sidebar-colors', theme);
    storage.set(SESSION_KEYS.THEME, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) =>
      prev === THEME_MODES.LIGHT ? THEME_MODES.DARK : THEME_MODES.LIGHT
    );
  }, []);

  const isDark = theme === THEME_MODES.DARK;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
