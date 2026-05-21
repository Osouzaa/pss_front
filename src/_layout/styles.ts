import styled from "styled-components";

const bp = {
  md: "48rem",
  xl: "81.25rem",
};

export const Layout = styled.div`
  min-height: 100dvh;

  @media (min-width: ${bp.md}) and (orientation: portrait) {
    display: grid;
    grid-template-columns: 30% 70%;
  }

  @media (min-width: ${bp.md}) and (orientation: landscape) {
    display: grid;
    grid-template-columns: 30% 70%;
  }

  @media (min-width: ${bp.xl}) {
    grid-template-columns: 20% 80%;
  }
`;

export const Content = styled.main`
  padding: 1rem;
  min-width: 0;

  /* ✅ reserva espaço no MOBILE (sempre funciona) */
  @media (max-width: ${bp.md}) {
    padding: 0.875rem;
    padding-bottom: 1.25rem;
  }

  @media (min-width: ${bp.xl}) {
    padding: 1.25rem 1.5rem;
  }
`;
