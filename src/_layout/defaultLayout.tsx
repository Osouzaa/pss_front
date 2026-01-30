import { Outlet } from "react-router";

import { ProcessoSidebar } from "../components/ProcessoSidebar";

import * as S from "./styles";
import { useTheme } from "../contexts/ThemeContext";
import { ModalLembrete } from "../components/ModalLembrete";

export function DefaultLayout() {
  const { mode, toggleTheme } = useTheme();

  return (
    <S.Layout>
      <ProcessoSidebar isDark={mode === "dark"} onToggleTheme={toggleTheme} />

      <S.Content>
        <ModalLembrete />

        <Outlet />
      </S.Content>
    </S.Layout>
  );
}
