import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import * as S from "./styles";

import {
  ClipboardList,
  FileText,
  LogOut,
  Menu,
  Moon,
  Shield,
  Sun,
  User,
  UserRoundSearch,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import logo_pmi_negativa from "../../assets/logo-pmi-negativa.png";
import logo_pmi_positiva from "../../assets/logo-pmi-positiva.png";
import { useAuth } from "../../contexts/auth-context";

type Props = {
  isDark: boolean;
  onToggleTheme: () => void;
};

export function ProcessoSidebar({ isDark, onToggleTheme }: Props) {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, isAdmin, isCandidato, isSuperAdmin } = useAuth();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const nav = useMemo(
    () => [
      { to: "/processos", label: "Processo", icon: <ClipboardList size={18} /> },
      ...(isCandidato
        ? [
            {
              to: "/minhas-inscricoes",
              label: "Inscricoes",
              icon: <Users size={18} />,
            },
            { to: "/perfil", label: "Perfil", icon: <User size={18} /> },
          ]
        : []),
      ...(isAdmin
        ? [
            { to: "/admin/tipos-documento", label: "Documentos", icon: <FileText size={18} /> },
          ]
        : []),
      ...(isSuperAdmin
        ? [
            { to: "/admin/usuarios", label: "Usuarios", icon: <Shield size={18} /> },
            {
              to: "/super-admin/candidatos",
              label: "Candidatos",
              icon: <UserRoundSearch size={18} />,
            },
          ]
        : []),
    ],
    [isAdmin, isCandidato, isSuperAdmin],
  );

  const handleSignOut = () => {
    toast.success("Saindo do sistema!");

    logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <S.Sidebar data-open={open}>
        <S.BrandLogoWrap aria-hidden>
          <img src={isDark ? logo_pmi_negativa : logo_pmi_positiva} />
        </S.BrandLogoWrap>
        <S.Brand>
          <S.BrandTitle>Processo Seletivo Simplificado</S.BrandTitle>
          <S.BrandSubtitle>
            {isSuperAdmin
              ? "Painel Super Admin"
              : isAdmin
                ? "Painel Admin"
                : "Painel Candidato"}
          </S.BrandSubtitle>
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
                {isDark ? <Moon size={16} /> : <Sun size={16} />}
              </span>
              <span>{isDark ? "Dark" : "Light"}</span>
            </S.ThemeToggleFooter>
          </S.FooterRow>

          <S.LogoutButton type="button" onClick={handleSignOut}>
            Sair
          </S.LogoutButton>
        </S.SidebarFooter>
      </S.Sidebar>

      <S.MobileHeader>
        <S.MobileBrand>
          <S.MobileBrandMark>PSS</S.MobileBrandMark>
          <span>{isSuperAdmin ? "Super Admin" : isAdmin ? "Admin" : "Candidato"}</span>
        </S.MobileBrand>
        <S.MobileMenuButton
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </S.MobileMenuButton>
      </S.MobileHeader>

      {open && <S.MobileScrim onClick={() => setOpen(false)} />}

      <S.MobileDrawer data-open={open}>
        <S.MobileDrawerHeader>
          <S.MobileDrawerTitle>Menu</S.MobileDrawerTitle>
          <S.MobileDrawerSubtitle>
            Processo Seletivo Simplificado
          </S.MobileDrawerSubtitle>
        </S.MobileDrawerHeader>

        <S.MobileNav role="navigation" aria-label="Menu principal">
          {nav.map((item) => (
            <S.MobileNavLink
              key={item.to}
              as={NavLink}
              to={item.to}
              end={item.to === "/"}
            >
              <S.MobileNavIcon>{item.icon}</S.MobileNavIcon>
              <span>{item.label}</span>
            </S.MobileNavLink>
          ))}
        </S.MobileNav>

        <S.MobileDrawerActions>
          <S.MobileUtilityButton
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
          >
            {isDark ? <Moon size={18} /> : <Sun size={18} />}
            <span>{isDark ? "Tema escuro" : "Tema claro"}</span>
          </S.MobileUtilityButton>
          <S.MobileLogoutButton type="button" onClick={handleSignOut}>
            <LogOut size={18} />
            <span>Sair</span>
          </S.MobileLogoutButton>
        </S.MobileDrawerActions>
      </S.MobileDrawer>
    </>
  );
}
