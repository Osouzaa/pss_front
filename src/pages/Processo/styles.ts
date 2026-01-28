// styles.ts (COMPLETO) — usando somente as variáveis do seu theme
import styled from "styled-components";

/* =========================
   TOKENS LOCAIS (não cores)
========================= */
const ui = {
  radius: {
    md: "14px",
    lg: "18px",
    xl: "20px",
    pill: "999px",
  },
  space: {
    xs: "6px",
    sm: "10px",
    md: "12px",
    lg: "16px",
  },
  h: {
    btn: "40px",
    input: "40px",
  },
  shadow: {
    sm: "0 10px 30px rgba(0,0,0,0.08)",
    md: "0 16px 50px rgba(0,0,0,0.12)",
  },
};

/* =========================
   LAYOUT
========================= */
export const ContainerProcesso = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: .75rem;
  background: ${({ theme }) => theme.bodyBg};

`;

export const PageHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;

  @media (max-width: 560px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const TitleArea = styled.div`
  display: grid;
  gap: 4px;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 22px;
  line-height: 1.15;
  color: ${({ theme }) => theme.text};
  font-weight: 900;
`;

export const Subtitle = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.4;
  color: ${({ theme }) => theme.description};
  max-width: 720px;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 560px) {
    justify-content: flex-start;
  }
`;

export const CreateButton = styled.button`
  height: ${ui.h.btn};
  padding: 0 14px;
  border-radius: ${ui.radius.md};
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme["text-white"]};
  font-weight: 900;
  cursor: pointer;

  transition: transform 0.14s ease, background 0.14s ease, opacity 0.14s ease;

  &:hover {
    background: ${({ theme }) => theme.primaryHover};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0px);
    opacity: 0.92;
  }
`;

/* =========================
   TOOLBAR
========================= */
export const Toolbar = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;

  padding: 12px;
  border-radius: ${ui.radius.lg};
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};

  @media (max-width: 720px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const SearchWrap = styled.div`
  display: grid;
  gap: 6px;
  flex: 1;
  min-width: 240px;
`;

export const SearchLabel = styled.label`
  font-size: 12px;
  color: ${({ theme }) => theme.description};
`;

export const SearchInput = styled.input`
  height: ${ui.h.input};
  width: 100%;
  border-radius: ${ui.radius.md};
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.text};
  padding: 0 12px;
  outline: none;

  transition: border-color 0.14s ease, box-shadow 0.14s ease;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.active};
  }

  &::placeholder {
    color: ${({ theme }) => theme.description};
  }
`;

export const Counter = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
  gap: 8px;

  font-size: 13px;
  color: ${({ theme }) => theme.description};

  @media (max-width: 720px) {
    justify-content: flex-start;
  }
`;

export const CounterMuted = styled.span`
  font-size: 12px;
  opacity: 0.85;
`;

/* =========================
   GRID / CARDS
========================= */
export const Grid = styled.div`
  display: grid;
  gap: 14px;
  grid-template-columns: 1fr;

  @media (min-width: 740px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: 1100px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

export const Card = styled.article`
  position: relative;
  overflow: hidden;

  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  border-radius: ${ui.radius.xl};
  padding: 14px;

  display: flex;
  flex-direction: column;
  gap: 12px;

  box-shadow: ${ui.shadow.sm};
  transition: transform 0.18s ease, box-shadow 0.18s ease,
    border-color 0.18s ease;

  /* brilho suave usando cor do tema */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(
      900px 240px at 20% 0%,
      ${({ theme }) => theme.lightPrimary},
      transparent 55%
    );
    pointer-events: none;
    opacity: 0.65;
  }

  &:hover {
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.primary};
    box-shadow: ${ui.shadow.md};
  }

  &:active {
    transform: translateY(-1px);
  }
`;

export const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
`;

export const CardTitle = styled.h3`
  margin: 0;
  font-size: 15px;
  line-height: 1.25;
  color: ${({ theme }) => theme.text};
  font-weight: 900;

  /* clamp 2 linhas */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const CardDesc = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.45;
  color: ${({ theme }) => theme.description};
`;

/* =========================
   META (chips bonitos)
========================= */
export const MetaRow = styled.div`
  display: grid;
  gap: .75rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;

export const MetaItem = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.lightDefault};
  border-radius: ${ui.radius.lg};
  padding: 10px 10px;

  display: grid;
  gap: 4px;
`;

export const MetaLabel = styled.span`
  font-size: 11px;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.description};
`;

export const MetaValue = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/* =========================
   FOOTER / BUTTONS
========================= */
export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  padding-top: 10px;
  border-top: 1px solid ${({ theme }) => theme.border};

  @media (max-width: 420px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const SecondaryButton = styled.button`
  height: ${ui.h.btn};
  padding: 0 14px;
  border-radius: ${ui.radius.md};

  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.lightDefault};
  color: ${({ theme }) => theme.text};
  font-weight: 900;

  cursor: pointer;
  transition: transform 0.14s ease, background 0.14s ease,
    border-color 0.14s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.active};
  }

  &:active {
    transform: translateY(0px);
    opacity: 0.92;
  }
`;

export const PrimaryButton = styled.button`
  height: ${ui.h.btn};
  padding: 0 14px;
  border-radius: ${ui.radius.md};

  border: 1px solid transparent;
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme["text-white"]};
  font-weight: 900;

  cursor: pointer;

  /* sombra “premium” sem inventar cor fora do tema (usa active) */
  box-shadow: 0 14px 28px ${({ theme }) => theme.active};
  transition: transform 0.14s ease, background 0.14s ease,
    opacity 0.14s ease, box-shadow 0.14s ease;

  &:hover {
    transform: translateY(-1px);
    background: ${({ theme }) => theme.primaryHover};
    box-shadow: 0 18px 34px ${({ theme }) => theme.active};
  }

  &:active {
    transform: translateY(0px);
    opacity: 0.92;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
    transform: none;
    box-shadow: none;
  }
`;

/* =========================
   STATUS PILL (com suas cores)
========================= */
const statusTokens = (status: string, theme: any) => {
  switch (status) {
    case "ABERTO":
      return { bg: theme.statusOpenBg, fg: theme.statusOpenText };
    case "EM_ANALISE":
      return { bg: theme.statusAnalyzeBg, fg: theme.statusAnalyzeText };
    case "EM_ANDAMENTO":
      return { bg: theme.statusExecutionBg, fg: theme.statusExecutionText };
    case "ENCERRADO":
      return { bg: theme.statusDoneBg, fg: theme.statusDoneText };
    case "CANCELADO":
      return { bg: theme.statusCancelBg, fg: theme.statusCancelText };
    case "RASCUNHO":
    default:
      return { bg: theme.lightDefault, fg: theme.text };
  }
};

export const StatusPill = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;

  padding: 6px 10px;
  border-radius: ${ui.radius.pill};

  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.03em;
  white-space: nowrap;

  ${({ $status, theme }) => {
    const c = statusTokens($status, theme);
    return `
      background: ${c.bg};
      color: ${c.fg};
      border: 1px solid ${theme.border};
    `;
  }}
`;

/* =========================
   EMPTY / LOADING
========================= */
export const EmptyState = styled.div`
  border: 1px dashed ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  border-radius: ${ui.radius.xl};
  padding: 18px;

  display: grid;
  gap: 6px;
`;

export const EmptyTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  font-weight: 900;
`;

export const EmptyText = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${({ theme }) => theme.description};
`;

export const LoadingState = styled(EmptyState)``;
export const LoadingTitle = styled(EmptyTitle)``;
export const LoadingText = styled(EmptyText)``;

/* =========================
   PAGINATION
========================= */
export const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  padding: 12px;
  border-radius: ${ui.radius.lg};
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
`;

export const PageButton = styled.button`
  height: ${ui.h.btn};
  padding: 0 14px;
  border-radius: ${ui.radius.md};

  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.lightDefault};
  color: ${({ theme }) => theme.text};
  font-weight: 900;

  cursor: pointer;
  transition: transform 0.14s ease, background 0.14s ease;

  &:hover {
    background: ${({ theme }) => theme.active};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0px);
    opacity: 0.92;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
    transform: none;
  }
`;

export const PageInfo = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.description};
`;
