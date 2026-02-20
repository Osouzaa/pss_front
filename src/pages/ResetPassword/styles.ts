import styled from "styled-components";

export const Page = styled.div`
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: clamp(1rem, 3vw, 1.5rem);
  background: ${({ theme }) => theme.bodyBg};

  /* ajuda muito em telas pequenas (teclado mobile) */
  padding-bottom: clamp(1.25rem, 6vh, 2.5rem);
`;

export const Card = styled.div`
  width: min(36rem, 100%);
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: clamp(1rem, 1.8vw, 1.25rem);
  padding: clamp(1rem, 2.2vw, 1.25rem);

  box-shadow:
    0 1px 0 rgba(15, 23, 42, 0.04),
    0 18px 44px rgba(15, 23, 42, 0.12);

  /* “borda viva” discreta */
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    border-radius: inherit;
    background: radial-gradient(
      60rem 18rem at 10% 0%,
      ${({ theme }) => theme.lightPrimary} 0%,
      rgba(0, 0, 0, 0) 45%
    );
    opacity: 0.85;
  }

  /* garante que conteúdo fique acima do glow */
  > * {
    position: relative;
    z-index: 1;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: clamp(0.75rem, 2vw, 1rem);
  margin-bottom: clamp(0.75rem, 2vw, 1rem);
`;

export const Title = styled.h1`
  margin: 0;
  font-size: clamp(1.05rem, 1.5vw, 1.25rem);
  font-weight: 900;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.text};
`;

export const Subtitle = styled.p`
  margin: 0.4rem 0 0;
  font-size: clamp(0.8rem, 1.1vw, 0.9rem);
  line-height: 1.35;
  color: ${({ theme }) => theme.description};
`;

export const BackBtn = styled.button`
  height: 2.5rem;
  padding: 0 0.85rem;
  border-radius: 0.9rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.lightPrimary};
  color: ${({ theme }) => theme.primary};
  font-weight: 900;
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition:
    transform 120ms ease,
    background 120ms ease,
    border-color 120ms ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.active};
    border-color: ${({ theme }) => theme.primary};
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0px);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => theme.active};
    border-color: ${({ theme }) => theme.primary};
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
  }
`;

export const Form = styled.form`
  display: grid;
  gap: clamp(0.75rem, 1.6vw, 0.9rem);

  /* melhor “respiro” no último botão */
  padding-top: 0.15rem;
`;

export const Hint = styled.div`
  font-size: clamp(0.78rem, 1.05vw, 0.85rem);
  color: ${({ theme }) => theme.description};
  padding: 0.15rem 0.15rem 0;

  /* detalhe visual */
  display: flex;
  gap: 0.5rem;
  align-items: center;

  &::before {
    content: "";
    width: 0.45rem;
    height: 0.45rem;
    border-radius: 999px;
    background: ${({ theme }) => theme.secondary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.lightSuccess};
    flex: 0 0 auto;
  }
`;

export const Alert = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.warningBg};
  color: ${({ theme }) => theme.warningText};
  border-radius: 1rem;
  padding: 0.75rem 0.85rem;
  font-size: clamp(0.82rem, 1.1vw, 0.92rem);
  font-weight: 900;
  line-height: 1.35;

  /* “barra” do lado para chamar atenção */
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0 auto 0 0;
    width: 0.35rem;
    background: ${({ theme }) => theme.warning};
  }
`;

export const Primary = styled.button`
  height: 48px;
  border-radius: 14px;
  border: 0;
  cursor: pointer;
  font-weight: 900;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme["text-white"]};

  &:hover {
    background: ${({ theme }) => theme.primaryHover};
    color: ${({ theme }) => theme["text-white"]};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;
