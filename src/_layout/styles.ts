import styled from "styled-components";

const bp = {
  md: "48rem", // 768px (tablet)
  xl: "81.25rem", // 1300px (desktop grande)
};

export const Layout = styled.div`
  min-height: 100dvh;

  @media (min-width: ${bp.md}) and (orientation: portrait) {
    display: grid;
    grid-template-columns: 30% 70%;
  }

  /* Tablet em paisagem */
  @media (min-width: ${bp.md}) and (orientation: landscape) {
    display: grid;
    grid-template-columns: 30% 70%;
  }

  /* Desktop grande */
  @media (min-width: ${bp.xl}) {
    grid-template-columns: 20% 80%;
  }
`;

export const Content = styled.main`
  padding: 1rem;
  min-width: 0; /* evita overflow em grids */

  @media (min-width: ${bp.xl}) {
    padding: 1.25rem 1.5rem;
  }
`;
