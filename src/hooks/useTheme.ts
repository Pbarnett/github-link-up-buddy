
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'analyst';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const useThemeProvider = () => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check localStorage first
    const stored = localStorage.getItem('autopilot-theme');
    if (stored === 'light' || stored === 'analyst') {
      return stored;
    }
    
    // Default to analyst theme for new users, but respect system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'analyst' : 'light';
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('autopilot-theme', newTheme);
    
    // Update document theme
    if (newTheme === 'analyst') {
      document.documentElement.setAttribute('data-theme', 'analyst');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.documentElement.classList.add('light');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'analyst' : 'light');
  };

  useEffect(() => {
    // Apply theme on mount
    setTheme(theme);
  }, []);

  return {
    theme,
    setTheme,
    toggleTheme,
  };
};
