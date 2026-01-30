// src/contexts/theme-context.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type ThemeMode = "light" | "dark";

type ThemeContextData = {
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
};

const THEME_KEY = "ps.theme";

export const ThemeContext = createContext<ThemeContextData>(
  {} as ThemeContextData,
);

function getStoredTheme(): ThemeMode {
  const t = localStorage.getItem(THEME_KEY);
  return t === "dark" ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => getStoredTheme());

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
    localStorage.setItem(THEME_KEY, mode);
  }, [mode]);

  const setTheme = (next: ThemeMode) => {
    setMode(next);
  };

  const toggleTheme = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const value = useMemo(() => ({ mode, toggleTheme, setTheme }), [mode]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
