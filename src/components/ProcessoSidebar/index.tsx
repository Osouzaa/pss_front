import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import * as S from "./styles";

import {
  FiClipboard,
  FiUsers,
  FiUser,
  FiSun,
  FiMoon,
  FiLogOut,
} from "react-icons/fi";
import { toast } from "sonner";
import { TokenSistems } from "../../constants/env.constantes";

type Props = {
  brandTitle?: string;
  brandSubtitle?: string;
  isDark: boolean;
  onToggleTheme: () => void;
};

export function ProcessoSidebar({
  brandTitle = "Processo Seletivo",
  brandSubtitle = "Painel",
  isDark,
  onToggleTheme,
}: Props) {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const nav = useMemo(
    () => [
      { to: "/processos", label: "Processo", icon: <FiClipboard size={18} /> },
      {
        to: "/minhas-inscricoes",
        label: "Inscrições",
        icon: <FiUsers size={18} />,
      },
      { to: "/perfil", label: "Perfil", icon: <FiUser size={18} /> },
    ],
    [],
  );

  const handleSignOut = () => {
    toast.success("Saindo do sistema!");
    localStorage.removeItem(TokenSistems.TOKEN_PSS);
    localStorage.removeItem(TokenSistems.TOKEN_USER);

    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* ===== Desktop sidebar ===== */}
      <S.Sidebar data-open={open}>
        <S.Brand>
          <S.BrandTitle>{brandTitle}</S.BrandTitle>
          <S.BrandSubtitle>{brandSubtitle}</S.BrandSubtitle>
        </S.Brand>

        <S.Nav>
          {nav.map((item) => (
            <S.NavItem key={item.to}>
              <S.NavLinkStyled as={NavLink} to={item.to} end={item.to === "/"}>
                <S.IconWrap>{item.icon}</S.IconWrap>
                <S.NavLabel>{item.label}</S.NavLabel>
                <S.ActivePill aria-hidden />
              </S.NavLinkStyled>
            </S.NavItem>
          ))}
        </S.Nav>

        <S.SidebarFooter>
          <S.FooterRow>
            <S.FooterLabel>Tema</S.FooterLabel>
            <S.ThemeToggleFooter
              type="button"
              onClick={onToggleTheme}
              aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
            >
              <span aria-hidden>
                {isDark ? <FiMoon size={16} /> : <FiSun size={16} />}
              </span>
              <span>{isDark ? "Dark" : "Light"}</span>
            </S.ThemeToggleFooter>
          </S.FooterRow>

          <S.LogoutButton type="button" onClick={handleSignOut}>
            Sair
          </S.LogoutButton>
        </S.SidebarFooter>
      </S.Sidebar>

      <S.BottomBar role="navigation" aria-label="Menu principal">
        {nav.map((item) => (
          <S.BottomItem
            key={item.to}
            as={NavLink}
            to={item.to}
            end={item.to === "/"}
          >
            <S.BottomIcon>{item.icon}</S.BottomIcon>
            <S.BottomLabel>{item.label}</S.BottomLabel>
          </S.BottomItem>
        ))}
        <S.BottomAction
          type="button"
          onClick={handleSignOut}
          aria-label="Sair do sistema"
          title="Sair"
        >
          <S.BottomIcon>
            <FiLogOut size={18} />
          </S.BottomIcon>
          <S.BottomLabel>Sair</S.BottomLabel>
        </S.BottomAction>

        <S.BottomAction
          type="button"
          onClick={onToggleTheme}
          aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
          title={isDark ? "Claro" : "Escuro"}
        >
          <S.BottomIcon>
            {isDark ? <FiMoon size={18} /> : <FiSun size={18} />}
          </S.BottomIcon>
          <S.BottomLabel>Tema</S.BottomLabel>
        </S.BottomAction>
      </S.BottomBar>
    </>
  );
}
