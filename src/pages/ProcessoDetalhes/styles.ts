import styled from "styled-components";

/* =========================
   TOKENS LOCAIS
========================= */
const ui = {
  radius: {
    md: "14px",
    lg: "18px",
    xl: "22px",
    pill: "999px",
  },
  space: {
    xs: "6px",
    sm: "10px",
    md: "12px",
    lg: "16px",
    xl: "20px",
  },
  h: {
    btn: "40px",
    input: "40px",
  },
  shadow: {
    sm: "0 10px 30px rgba(0,0,0,0.08)",
    md: "0 18px 60px rgba(0,0,0,0.14)",
  },
};

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;

  overflow-x: hidden;
`;

export const Breadcrumbs = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 12px;
  color: ${({ theme }) => theme.description};
  max-width: 100%;
`;

export const BreadcrumbLink = styled.a`
  color: ${({ theme }) => theme.link};
  background: ${({ theme }) => theme.BGlink};
  padding: 6px 10px;
  border-radius: ${ui.radius.pill};
  text-decoration: none;
  font-weight: 800;

  &:hover {
    text-decoration: underline;
  }
`;

export const BreadcrumbSep = styled.span`
  opacity: 0.7;
`;

export const BreadcrumbCurrent = styled.span`
  font-weight: 800;
  color: ${({ theme }) => theme.text};
`;

/* =========================
   HEADER
========================= */
export const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;

  padding: 14px;
  border-radius: ${ui.radius.xl};
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};

  max-width: 100%;

  @media (max-width: 820px) {
    flex-direction: column;
    align-items: stretch;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

export const HeaderLeft = styled.div`
  display: grid;
  gap: 6px;
  min-width: 0; /* importante para truncar textos dentro */
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 18px;
  line-height: 1.25;
  font-weight: 700;
  color: ${({ theme }) => theme.text};

  /* não deixar estourar em telas estreitas */
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (min-width: 768px) {
    font-size: 20px;
  }

  @media (max-width: 520px) {
    white-space: normal;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
`;

export const Subtitle = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${({ theme }) => theme.description};

  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 520px) {
    white-space: normal;
  }
`;

export const BadgesRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  max-width: 100%;
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
  max-width: 100%;

  @media (max-width: 420px) {
    flex-direction: column;
    align-items: stretch;

    & > button {
      width: 100%;
    }
  }
`;

/* =========================
   BUTTONS
========================= */
export const SecondaryButton = styled.button`
  height: ${ui.h.btn};
  padding: 0 14px;
  border-radius: ${ui.radius.md};

  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.lightDefault};
  color: ${({ theme }) => theme.text};
  font-weight: 700;

  cursor: pointer;
  transition:
    transform 0.14s ease,
    background 0.14s ease,
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
  font-weight: 700;

  cursor: pointer;
  box-shadow: 0 16px 34px ${({ theme }) => theme.active};

  transition:
    transform 0.14s ease,
    background 0.14s ease,
    opacity 0.14s ease,
    box-shadow 0.14s ease;

  &:hover {
    transform: translateY(-1px);
    background: ${({ theme }) => theme.primaryHover};
    box-shadow: 0 18px 44px ${({ theme }) => theme.active};
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

export const LinkButton = styled.button`
  height: ${ui.h.btn};
  padding: 0 12px;
  border-radius: ${ui.radius.md};
  border: 1px solid transparent;
  background: transparent;
  color: ${({ theme }) => theme.link};
  font-weight: 700;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

/* =========================
   TABS
========================= */
export const Tabs = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;

  padding: 10px;
  border-radius: ${ui.radius.xl};
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};

  max-width: 100%;
`;

export const TabButton = styled.button<{ $active: boolean }>`
  height: 38px;
  padding: 0 14px;
  border-radius: ${ui.radius.pill};
  border: 1px solid ${({ theme }) => theme.border};
  cursor: pointer;
  font-weight: 700;

  background: ${({ $active, theme }) =>
    $active ? theme.active : theme.lightDefault};
  color: ${({ $active, theme }) => ($active ? theme.primary : theme.text)};

  transition:
    transform 0.12s ease,
    background 0.12s ease,
    border-color 0.12s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: ${({ theme }) => theme.primary};
  }

  &:active {
    transform: translateY(0px);
  }

  @media (max-width: 420px) {
    flex: 1;
    min-width: 140px;
  }
`;

/* =========================
   SECTION
========================= */
export const Section = styled.section`
  padding: 14px;
  border-radius: ${ui.radius.xl};
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  max-width: 100%;

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

export const SectionHeader = styled.div`
  display: grid;
  gap: 4px;
  margin-bottom: 12px;
  min-width: 0;
`;

export const SectionTitle = styled.h2`
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`;

export const SectionHint = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${({ theme }) => theme.description};
`;

/* =========================
   CONTENT GRID
========================= */
export const ContentGrid = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr;

  @media (min-width: 920px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const Card = styled.article`
  position: relative;
  overflow: hidden;

  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.lightDefault};
  border-radius: ${ui.radius.xl};
  padding: 12px;

  display: flex;
  flex-direction: column;
  gap: 8px;

  box-shadow: ${ui.shadow.sm};
  min-width: 0;
`;

export const CardTitle = styled.h3`
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`;

export const CardText = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.45;
  color: ${({ theme }) => theme.description};
`;

export const CardActions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 4px;
`;

/* =========================
   KV
========================= */
export const KV = styled.div`
  display: grid;
  gap: 8px;
`;

export const KVRow = styled.div`
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 10px;
  min-width: 0;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

export const K = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`;

export const V = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.description};
  min-width: 0;
`;

/* =========================
   INPUT (buscar vaga)
========================= */
export const SearchWrap = styled.div`
  display: grid;
  gap: 6px;
  flex: 1;
  min-width: 0; /* deixa o input encolher sem estourar */
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
  min-width: 0;

  transition:
    border-color 0.14s ease,
    box-shadow 0.14s ease;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.active};
  }

  &::placeholder {
    color: ${({ theme }) => theme.description};
  }
`;

export const VagasToolbar = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-end;
  justify-content: space-between;

  margin-bottom: 12px;
  max-width: 100%;

  @media (max-width: 720px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

/* =========================
   TABLE WRAPPERS
========================= */
export const VagasTableWrap = styled.div`
  width: 100%;
  max-width: 100%;
  border-radius: ${ui.radius.xl};
  overflow: hidden;

  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};

  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  /* melhora a leitura no mobile */
  scrollbar-gutter: stable both-edges;
`;

export const VagasTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;

  /* era 760px fixo — agora fica mais flexível e não “estoura” tanto */
  min-width: 640px;

  thead tr {
    background: ${({ theme }) => theme.lightDefault};
  }

  tbody tr + tr td {
    border-top: 1px solid ${({ theme }) => theme.border};
  }

  @media (max-width: 420px) {
    min-width: 560px;
  }
`;

export const PerguntasTableWrap = styled.div`
  width: 100%;
  max-width: 100%;
  border-radius: ${ui.radius.xl};
  overflow: hidden;

  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};

  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-gutter: stable both-edges;
`;

export const PerguntasTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;

  /* era 980px fixo — agora mais responsivo */
  min-width: 780px;

  thead tr {
    background: ${({ theme }) => theme.lightDefault};
  }

  tbody tr + tr td {
    border-top: 1px solid ${({ theme }) => theme.border};
  }

  @media (max-width: 520px) {
    min-width: 720px;
  }

  @media (max-width: 420px) {
    min-width: 680px;
  }
`;

export const Th = styled.th`
  text-align: left;
  padding: 12px;
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  white-space: nowrap;

  @media (max-width: 520px) {
    padding: 10px;
  }
`;

export const Td = styled.td`
  padding: 12px;
  vertical-align: middle;
  color: ${({ theme }) => theme.description};
  min-width: 0;

  @media (max-width: 520px) {
    padding: 10px;
  }
`;

export const Tr = styled.tr`
  background: ${({ theme }) => theme.background};

  &:hover {
    background: ${({ theme }) => theme.active};
  }
`;

export const RowActions = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
  max-width: 100%;

  @media (max-width: 520px) {
    gap: 8px;
  }
`;

/* =========================
   TEXT CELLS (anti overflow)
========================= */
export const VagaName = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  line-height: 1.25;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  /* antes era max-width: 520px fixo */
  max-width: clamp(180px, 40vw, 520px);
`;

export const VagaSubText = styled.div`
  margin-top: 4px;
  font-size: 12px;
  color: ${({ theme }) => theme.description};

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  max-width: clamp(180px, 40vw, 520px);
`;

export const PerguntaTitleCell = styled.div`
  font-size: 13px;
  font-weight: 800;
  color: ${({ theme }) => theme.text};
  line-height: 1.25;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  max-width: clamp(180px, 46vw, 520px);
`;

export const PerguntaDescCell = styled.div`
  margin-top: 4px;
  font-size: 12px;
  color: ${({ theme }) => theme.description};
  line-height: 1.35;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  overflow: hidden;
  text-overflow: ellipsis;

  max-width: clamp(180px, 46vw, 520px);
`;

/* =========================
   STATUS / PILLS
========================= */
const processoStatusTokens = (status: string, theme: any) => {
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
  font-weight: 700;
  letter-spacing: 0.03em;
  white-space: nowrap;

  ${({ $status, theme }) => {
    const c = processoStatusTokens($status, theme);
    return `
      background: ${c.bg};
      color: ${c.fg};
      border: 1px solid ${theme.border};
    `;
  }}
`;

export const InfoChip = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: ${ui.radius.pill};
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.lightDefault};
  color: ${({ theme }) => theme.text};
  font-size: 12px;
  font-weight: 700;

  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 520px) {
    white-space: normal;
  }
`;

const vagaStatusTokens = (status: string, theme: any) => {
  switch (status) {
    case "ATIVA":
      return { bg: theme.statusDoneBg, fg: theme.statusDoneText };
    case "PAUSADA":
      return { bg: theme.statusAnalyzeBg, fg: theme.statusAnalyzeText };
    case "ENCERRADA":
    default:
      return { bg: theme.statusCancelBg, fg: theme.statusCancelText };
  }
};

export const VagaStatusPill = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: ${ui.radius.pill};
  border: 1px solid ${({ theme }) => theme.border};

  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.03em;
  white-space: nowrap;

  ${({ $status, theme }) => {
    const c = vagaStatusTokens($status, theme);
    return `
      background: ${c.bg};
      color: ${c.fg};
    `;
  }}
`;

export const CountPill = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: ${ui.radius.pill};
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.lightPrimary};
  color: ${({ theme }) => theme.primary};
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
`;

export const PerguntaOrderPill = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 6px 10px;
  border-radius: ${ui.radius.pill};
  border: 1px solid ${({ theme }) => theme.border};

  background: ${({ theme }) => theme.lightPrimary};
  color: ${({ theme }) => theme.primary};
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;
`;

export const YesPill = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;

  border-radius: ${ui.radius.pill};
  border: 1px solid ${({ theme }) => theme.border};

  background: ${({ theme }) => theme.statusDoneBg};
  color: ${({ theme }) => theme.statusDoneText};
  font-size: 11px;
  font-weight: 800;
  white-space: nowrap;
`;

export const NoPill = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;

  border-radius: ${ui.radius.pill};
  border: 1px solid ${({ theme }) => theme.border};

  background: ${({ theme }) => theme.statusCancelBg};
  color: ${({ theme }) => theme.statusCancelText};
  font-size: 11px;
  font-weight: 800;
  white-space: nowrap;
`;

export const OpcoesCountPill = styled.span<{ "data-has"?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-width: 44px;
  padding: 6px 10px;
  border-radius: ${ui.radius.pill};
  border: 1px solid ${({ theme }) => theme.border};

  background: ${({ theme }) => theme.lightDefault};
  color: ${({ theme }) => theme.text};
  font-size: 11px;
  font-weight: 900;

  &[data-has="true"] {
    background: ${({ theme }) => theme.lightPrimary};
    color: ${({ theme }) => theme.primary};
  }
`;

export const Muted = styled.span`
  color: ${({ theme }) => theme.description};
  font-size: 12px;
`;

/* =========================
   ICON BUTTON (ações)
========================= */
export const IconButton = styled.button`
  height: ${ui.h.btn};
  width: ${ui.h.btn};
  display: inline-flex;
  align-items: center;
  justify-content: center;

  border-radius: ${ui.radius.md};
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.lightDefault};
  color: ${({ theme }) => theme.text};

  cursor: pointer;
  transition: 0.12s ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.active};
    border-color: ${({ theme }) => theme.primary};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
  }

  &.danger {
    color: ${({ theme }) => theme.danger};
  }

  &.danger:hover:not(:disabled) {
    background: ${({ theme }) => theme.hoverDanger};
    border-color: ${({ theme }) => theme.hoverDanger};
    color: ${({ theme }) => theme["text-white"]};
  }
`;

/* =========================
   EMPTY STATE
========================= */
export const EmptyState = styled.div`
  border: 1px dashed ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  border-radius: ${ui.radius.xl};
  padding: 18px;

  display: grid;
  gap: 6px;
  max-width: 100%;

  @media (max-width: 480px) {
    padding: 14px;
  }
`;

export const EmptyTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  font-weight: 700;
`;

export const EmptyText = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${({ theme }) => theme.description};
`;

/* =========================
   (mantive seus estilos extras
   de grid/card de perguntas
   caso você use depois)
========================= */
export const PerguntasGrid = styled.div`
  display: grid;
  gap: 14px;
  grid-template-columns: 1fr;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

export const PerguntaCard = styled.article`
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
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${ui.shadow.md};
  }
`;

export const PerguntaHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
`;

export const PerguntaOrderBadge = styled.div`
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: ${ui.radius.md};

  display: flex;
  align-items: center;
  justify-content: center;

  background: ${({ theme }) => theme.lightPrimary};
  color: ${({ theme }) => theme.primary};
  font-size: 13px;
  font-weight: 800;
  border: 1px solid ${({ theme }) => theme.border};
`;

export const PerguntaBadgesRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
`;

const perguntaTipoTokens = (tipo: string, theme: any) => {
  const tipoUpper = tipo?.toUpperCase() || "";
  switch (tipoUpper) {
    case "BOOLEAN":
      return { bg: "#E3F2FD", fg: "#1976D2", label: "Booleano" };
    case "NUMERO":
      return { bg: "#FFF3E0", fg: "#F57C00", label: "Número" };
    case "TEXTO":
      return { bg: "#F3E5F5", fg: "#7B1FA2", label: "Texto" };
    case "SELECT":
      return { bg: theme.lightPrimary, fg: theme.primary, label: "Seleção" };
    case "MULTISELECT":
      return { bg: "#E8F5E9", fg: "#388E3C", label: "Múltipla Escolha" };
    case "DATA":
      return { bg: "#FFEBEE", fg: "#C62828", label: "Data" };
    default:
      return { bg: theme.lightDefault, fg: theme.text, label: tipo };
  }
};

export const PerguntaTipoPill = styled.span<{ $tipo: string }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: ${ui.radius.pill};
  border: 1px solid ${({ theme }) => theme.border};

  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.03em;
  white-space: nowrap;
  text-transform: uppercase;

  ${({ $tipo, theme }) => {
    const c = perguntaTipoTokens($tipo, theme);
    return `
      background: ${c.bg};
      color: ${c.fg};
      &::after { content: "${c.label}"; }
    `;
  }}
`;

export const PerguntaObrigatoriaPill = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: ${ui.radius.pill};
  border: 1px solid ${({ theme }) => theme.border};

  background: #ffebee;
  color: #c62828;

  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.03em;
  white-space: nowrap;
`;

export const PerguntaInativaPill = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: ${ui.radius.pill};
  border: 1px solid ${({ theme }) => theme.border};

  background: ${({ theme }) => theme.statusCancelBg};
  color: ${({ theme }) => theme.statusCancelText};

  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.03em;
  white-space: nowrap;
`;

export const PerguntaTitulo = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.4;
  color: ${({ theme }) => theme.text};

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const PerguntaDescricao = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: ${({ theme }) => theme.description};

  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const PerguntaFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

export const PerguntaMetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
`;

export const PerguntaMetaItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: ${ui.radius.pill};
  background: ${({ theme }) => theme.lightDefault};
  border: 1px solid ${({ theme }) => theme.border};
`;

export const PerguntaMetaIcon = styled.span`
  font-size: 12px;
  line-height: 1;
`;

export const PerguntaMetaText = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.description};
  white-space: nowrap;
`;

export const PerguntaActions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;
