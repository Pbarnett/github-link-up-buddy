import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "app-theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = typeof window !== 'undefined' ? (localStorage.getItem(storageKey) as Theme | null) : null;
    return stored ?? defaultTheme;
  });

  // Apply theme to document element and persist to storage
  useEffect(() => {
    const root = window.document.documentElement;
    const next = theme === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : theme;

    root.classList.remove("light", "dark");
    root.classList.add(next);
    try {
      localStorage.setItem(storageKey, theme);
    } catch {
      // ignore storage errors (private mode, etc.)
    }
  }, [theme, storageKey]);

  const value = useMemo<ThemeContextValue>(() => ({
    theme,
    setTheme: (t: Theme) => setThemeState(t),
  }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}

