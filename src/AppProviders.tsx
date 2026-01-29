import { useEffect, useMemo, useState } from "react";
import { ThemeProvider } from "styled-components";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import { queryClient } from "./lib/react-query";
import { theme } from "./styles/theme";
import { darkTheme } from "./styles/darkTheme";
import { GlobalStyles } from "./styles/global";
import Router from "./routes";

import { ThemeContext, type ThemeMode } from "./contexts/ThemeContext";

const THEME_KEY = "ps.theme";

function getStoredTheme(): ThemeMode {
  const v = localStorage.getItem(THEME_KEY);
  return v === "dark" ? "dark" : "light";
}

export function AppProviders() {
  const [mode, setMode] = useState<ThemeMode>(getStoredTheme());

  useEffect(() => {
    localStorage.setItem(THEME_KEY, mode);
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const currentTheme = useMemo(() => {
    return mode === "dark" ? darkTheme : theme;
  }, [mode]);

  return (
    <ThemeContext.Provider
      value={{
        mode,
        toggleTheme,
        setTheme: setMode,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={currentTheme}>
          <Toaster richColors position="top-center" duration={5000} />
          <GlobalStyles />
          <Router />
        </ThemeProvider>
      </QueryClientProvider>
    </ThemeContext.Provider>
  );
}
