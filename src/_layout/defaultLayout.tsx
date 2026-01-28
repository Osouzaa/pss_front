import { Outlet } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { ThemeProvider } from "styled-components";

import { ProcessoSidebar } from "../components/ProcessoSidebar";
import { theme } from "../styles/theme";
import { darkTheme } from "../styles/darkTheme";
import * as S from "./styles";

const THEME_KEY = "@processo:theme";

export function DefaultLayout() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const stored = localStorage.getItem(THEME_KEY);
    return stored === "dark";
  });

  useEffect(() => {
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  const currentTheme = useMemo(
    () => (isDark ? darkTheme : theme),
    [isDark]
  );

  return (
    <ThemeProvider theme={currentTheme}>
      <S.Layout>
        <ProcessoSidebar
          isDark={isDark}
          onToggleTheme={() => setIsDark((v) => !v)}
        />

        <S.Content>
          <Outlet />
        </S.Content>
      </S.Layout>
    </ThemeProvider>
  );
}
