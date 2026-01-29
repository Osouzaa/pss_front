import styled from "styled-components";

const bp = {
  md: "48rem", // 768px
};

const sidebarW = "17.5rem"; // 280px
const bottomBarH = "5.75rem"; // ~92px

export const Sidebar = styled.aside`
  display: none;

  @media (min-width: ${bp.md}) {
    display: flex;
    position: sticky;
    top: 0;
    height: 100vh;
    width: ${sidebarW};

    background: ${({ theme }) => theme.background};
    border-right: 1px solid ${({ theme }) => theme.border};

    flex-direction: column;
    padding: 1rem;
  }
`;

export const Brand = styled.div`
  padding: 0.75rem;
  border-radius: 1rem;

  background: ${({ theme }) => theme.bodyBg};
  border: 1px solid ${({ theme }) => theme.border};
`;

export const BrandLogoWrap = styled.div`
  max-width: 50rem;
  width: 100%;
  border-radius: 14px;
  display: grid;
  place-items: center;
  overflow: hidden;
  margin-bottom: 10px;

  img {
    width: 90%;
    height: 100px;
    object-fit: contain;
  }

  /* opcional: não mostrar no mobile */
  @media (max-width: 768px) {
    display: none;
  }
`;

export const BrandTitle = styled.h3`
  font-weight: 600;
  font-size: clamp(0.95rem, 0.8rem + 0.4vw, 1.05rem);
  letter-spacing: -0.01em;
  white-space: nowrap;
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
`;

export const BrandSubtitle = styled.span`
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.description};
  font-weight: 500;
`;

export const Nav = styled.nav`
  margin-top: 0.875rem;
  display: grid;
  gap: 0.5rem;
`;

export const NavItem = styled.div``;

export const NavLinkStyled = styled.a`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.625rem;

  padding: 0.75rem;
  border-radius: 0.875rem;

  text-decoration: none;
  color: ${({ theme }) => theme.text};

  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};

  transition:
    background 120ms ease,
    border-color 120ms ease,
    transform 120ms ease;

  &:hover {
    background: ${({ theme }) => theme.BGlink};
    border-color: ${({ theme }) => theme.link};
  }

  &:active {
    transform: translateY(0.0625rem);
  }

  &.active {
    background: ${({ theme }) => theme.active};
    border-color: ${({ theme }) => theme.primary};
  }
`;

export const IconWrap = styled.span`
  width: 2.375rem;
  height: 2.375rem;
  border-radius: 0.875rem;

  display: grid;
  place-items: center;

  background: ${({ theme }) => theme.lightDefault};
  border: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.primary};

  ${NavLinkStyled}.active & {
    background: ${({ theme }) => theme.lightPrimary};
    border-color: ${({ theme }) => theme.primary};
  }
`;

export const NavLabel = styled.span`
  font-size: 0.95rem;
  font-weight: 500;
`;

export const ActivePill = styled.span`
  margin-left: auto;
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 999px;
  background: transparent;

  ${NavLinkStyled}.active & {
    background: ${({ theme }) => theme.secondary};
  }
`;

export const SidebarFooter = styled.footer`
  margin-top: auto;
  padding-top: 0.875rem;
  display: grid;
  gap: 0.625rem;
`;

export const FooterRow = styled.div`
  padding: 0.75rem;
  border-radius: 1rem;

  background: ${({ theme }) => theme.bodyBg};
  border: 1px solid ${({ theme }) => theme.border};

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
`;

export const FooterLabel = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.description};
  font-weight: 500;
`;

export const ThemeToggleFooter = styled.button`
  height: 2.5rem;
  padding: 0.25rem 0.75rem;

  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.border};

  background: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.text};

  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  span {
    font-size: 0.8rem;
    font-weight: 600;
  }

  &:active {
    transform: translateY(0.0625rem);
  }
`;

export const LogoutButton = styled.button`
  width: 100%;
  height: 2.75rem;

  border: 0;
  border-radius: 0.875rem;

  background: ${({ theme }) => theme.logoutBg};
  color: ${({ theme }) => theme["text-white"]};

  font-weight: 600;
  letter-spacing: 0.01em;

  &:hover {
    background: ${({ theme }) => theme.logoutBgHover};
  }

  &:active {
    transform: translateY(0.0625rem);
  }
`;

/* =========================
   MOBILE BOTTOM BAR
========================= */

export const BottomBar = styled.nav`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;

  z-index: 70;

  background: ${({ theme }) => theme.background};
  border-top: 1px solid ${({ theme }) => theme.border};

  padding: 0.5rem 0.625rem calc(0.5rem + env(safe-area-inset-bottom));
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;

  @media (min-width: ${bp.md}) {
    display: none;
  }
`;

export const BottomItem = styled.a`
  text-decoration: none;
  color: ${({ theme }) => theme.description};

  display: grid;
  justify-items: center;
  gap: 0.25rem;

  padding: 0.5rem 0.375rem;
  border-radius: 0.875rem;

  transition:
    background 120ms ease,
    color 120ms ease,
    transform 120ms ease;

  &:active {
    transform: translateY(0.0625rem);
  }

  &.active {
    background: ${({ theme }) => theme.active};
    color: ${({ theme }) => theme.primary};
  }
`;

export const BottomAction = styled.button`
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.description};

  display: grid;
  justify-items: center;
  gap: 0.25rem;

  padding: 0.5rem 0.375rem;
  border-radius: 0.875rem;

  transition:
    background 120ms ease,
    color 120ms ease,
    transform 120ms ease;

  &:active {
    transform: translateY(0.0625rem);
  }

  &:hover {
    background: ${({ theme }) => theme.BGlink};
    color: ${({ theme }) => theme.primary};
  }
`;

export const BottomIcon = styled.span`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.875rem;

  display: grid;
  place-items: center;

  background: ${({ theme }) => theme.lightDefault};
  border: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.primary};

  ${BottomItem}.active & {
    background: ${({ theme }) => theme.lightPrimary};
    border-color: ${({ theme }) => theme.primary};
  }
`;

export const BottomLabel = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: -0.01em;
`;

/* Exporta a altura do BottomBar pra você usar no layout */
export const MOBILE_BOTTOM_BAR_HEIGHT = bottomBarH;
