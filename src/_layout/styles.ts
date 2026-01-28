import styled from "styled-components";
import { MOBILE_BOTTOM_BAR_HEIGHT } from "../components/ProcessoSidebar/styles";

const bp = {
  md: "48rem",
};

const sidebarW = "17.5rem";

export const Layout = styled.div`
  min-height: 100dvh;
  background: ${({ theme }) => theme.bodyBg};

  @media (min-width: ${bp.md}) {
    display: grid;
    grid-template-columns: ${sidebarW} 1fr;
  }
`;

export const Content = styled.main`
  padding: 0.875rem 0.75rem calc(${MOBILE_BOTTOM_BAR_HEIGHT} + 0.75rem);

  @media (min-width: ${bp.md}) {
    padding: 1.25rem 1.5rem 2rem;
  }
`;
