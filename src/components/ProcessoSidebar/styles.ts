import styled from "styled-components";

const bp = {
  md: "48rem",
};

const mobileHeaderH = "4.25rem";
const mobileHeaderSpace = `calc(${mobileHeaderH} + env(safe-area-inset-top, 0px))`;

export const MOBILE_BOTTOM_BAR_SPACE = mobileHeaderSpace;
export const MOBILE_BOTTOM_BAR_HEIGHT = mobileHeaderH;

export const Sidebar = styled.aside`
  display: none;

  @media (min-width: ${bp.md}) {
    display: flex;
    position: sticky;
    top: 0;
    height: 100vh;
    width: 100%;
    flex-direction: column;
    padding: 1rem;
    background: ${({ theme }) => theme.background};
    border-right: 1px solid ${({ theme }) => theme.border};
  }
`;

export const BrandLogoWrap = styled.div`
  width: 100%;
  display: grid;
  place-items: center;
  overflow: hidden;
  margin-bottom: 10px;

  img {
    width: 90%;
    height: 100px;
    object-fit: contain;
  }
`;

export const Brand = styled.div`
  padding: 0.75rem;
  border-radius: 0.85rem;
  background: ${({ theme }) => theme.bodyBg};
  border: 1px solid ${({ theme }) => theme.border};
`;

export const BrandTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.25;
`;

export const BrandSubtitle = styled.span`
  display: block;
  margin-top: 0.25rem;
  color: ${({ theme }) => theme.description};
  font-size: 0.8rem;
  font-weight: 600;
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
  padding: 0.72rem;
  border-radius: 0.75rem;
  text-decoration: none;
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  transition:
    background 140ms ease,
    border-color 140ms ease,
    transform 140ms ease;

  &:hover {
    background: ${({ theme }) => theme.BGlink};
    border-color: ${({ theme }) => theme.link};
  }

  &:active {
    transform: translateY(1px);
  }

  &.active {
    background: ${({ theme }) => theme.active};
    border-color: ${({ theme }) => theme.primary};
  }
`;

export const IconWrap = styled.span`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.65rem;
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
  font-size: 0.94rem;
  font-weight: 650;
`;

export const ActivePill = styled.span`
  margin-left: auto;
  width: 0.55rem;
  height: 0.55rem;
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
  border-radius: 0.85rem;
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
  font-weight: 600;
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
    font-weight: 700;
  }
`;

export const LogoutButton = styled.button`
  width: 100%;
  height: 2.75rem;
  border: 0;
  border-radius: 0.75rem;
  background: ${({ theme }) => theme.logoutBg};
  color: ${({ theme }) => theme["text-white"]};
  font-weight: 700;

  &:hover {
    background: ${({ theme }) => theme.logoutBgHover};
  }
`;

export const MobileHeader = styled.header`
  position: sticky;
  top: 0;
  z-index: 80;
  height: ${mobileHeaderSpace};
  padding: calc(env(safe-area-inset-top, 0px) + 0.55rem) 0.75rem 0.55rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background: color-mix(in srgb, ${({ theme }) => theme.background} 94%, transparent);
  backdrop-filter: blur(14px);

  @media (min-width: ${bp.md}) {
    display: none;
  }
`;

export const MobileBrand = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  color: ${({ theme }) => theme.text};
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

export const MobileBrandMark = styled.strong`
  width: 2.45rem;
  height: 2.45rem;
  display: grid;
  place-items: center;
  border-radius: 0.55rem;
  background: ${({ theme }) => theme.text};
  color: ${({ theme }) => theme.background};
  font-size: 0.78rem;
  letter-spacing: 0.08em;
`;

export const MobileMenuButton = styled.button`
  width: 2.75rem;
  height: 2.75rem;
  display: grid;
  place-items: center;
  border-radius: 0.6rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.text};
  transition:
    transform 140ms ease,
    border-color 140ms ease,
    background 140ms ease;

  &:active {
    transform: scale(0.96);
  }

  &[aria-expanded="true"] {
    border-color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.active};
  }
`;

export const MobileScrim = styled.div`
  position: fixed;
  inset: 0;
  z-index: 85;
  background: rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(2px);

  @media (min-width: ${bp.md}) {
    display: none;
  }
`;

export const MobileDrawer = styled.aside`
  position: fixed;
  z-index: 90;
  top: calc(env(safe-area-inset-top, 0px) + 0.75rem);
  right: 0.75rem;
  width: min(22rem, calc(100vw - 1.5rem));
  max-height: calc(100dvh - 1.5rem - env(safe-area-inset-top, 0px));
  overflow: auto;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.9rem;
  background: ${({ theme }) => theme.background};
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.24);
  transform: translateY(-0.5rem) scale(0.98);
  opacity: 0;
  pointer-events: none;
  transition:
    transform 180ms ease,
    opacity 180ms ease;

  &[data-open="true"] {
    transform: translateY(0) scale(1);
    opacity: 1;
    pointer-events: auto;
  }

  @media (min-width: ${bp.md}) {
    display: none;
  }
`;

export const MobileDrawerHeader = styled.div`
  padding: 1rem 1rem 0.8rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

export const MobileDrawerTitle = styled.div`
  color: ${({ theme }) => theme.text};
  font-size: 1.35rem;
  font-weight: 900;
  letter-spacing: -0.01em;
`;

export const MobileDrawerSubtitle = styled.div`
  margin-top: 0.25rem;
  color: ${({ theme }) => theme.description};
  font-size: 0.82rem;
`;

export const MobileNav = styled.nav`
  display: grid;
  padding: 0.65rem;
  gap: 0.35rem;
`;

export const MobileNavLink = styled.a`
  display: grid;
  grid-template-columns: 2.2rem 1fr;
  align-items: center;
  gap: 0.65rem;
  min-height: 3.1rem;
  padding: 0.45rem 0.55rem;
  border-radius: 0.55rem;
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  font-size: 0.94rem;
  font-weight: 750;
  transition:
    background 140ms ease,
    transform 140ms ease;

  &:active {
    transform: translateX(2px);
  }

  &.active {
    background: ${({ theme }) => theme.active};
    color: ${({ theme }) => theme.primary};
  }
`;

export const MobileNavIcon = styled.span`
  width: 2.2rem;
  height: 2.2rem;
  display: grid;
  place-items: center;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.backgroundInput};
`;

export const MobileDrawerActions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.55rem;
  padding: 0.75rem;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

export const MobileUtilityButton = styled.button`
  min-height: 2.8rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  border-radius: 0.55rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.text};
  font-weight: 800;
`;

export const MobileLogoutButton = styled(MobileUtilityButton)`
  background: ${({ theme }) => theme.logoutBg};
  border-color: ${({ theme }) => theme.logoutBg};
  color: ${({ theme }) => theme["text-white"]};
`;
