import { StrictMode, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "styled-components";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import { queryClient } from "./lib/react-query";
import { theme } from "./styles/theme";
import { darkTheme } from "./styles/darkTheme";
import { GlobalStyles } from "./styles/global";
import Router from "./routes";

const THEME_KEY = "ps.theme";

function getStoredTheme(): "light" | "dark" {
  const v = localStorage.getItem(THEME_KEY);
  return v === "dark" ? "dark" : "light";
}

function AppProviders() {
  const [mode, _setMode] = useState<"light" | "dark">(getStoredTheme());

  useEffect(() => {
    localStorage.setItem(THEME_KEY, mode);
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  const currentTheme = useMemo(() => {
    return mode === "dark" ? darkTheme : theme;
  }, [mode]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={currentTheme}>
        <Toaster richColors position="top-center" duration={5000} />
        <GlobalStyles />
        <Router />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders />
  </StrictMode>
);
