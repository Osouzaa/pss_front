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
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: ${({ theme }) => theme.bodyBg};

`;

/* =========================
   BREADCRUMBS
========================= */
export const Breadcrumbs = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.description};
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

  @media (max-width: 820px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const HeaderLeft = styled.div`
  display: grid;
  gap: 6px;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 18px;
  line-height: 1.25;
  font-weight: 700;
  color: ${({ theme }) => theme.text};

  @media (min-width: 768px) {
    font-size: 20px;
  }
`;

export const Subtitle = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${({ theme }) => theme.description};
`;

export const BadgesRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 420px) {
    flex-direction: column;
    align-items: stretch;
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
  font-weight: 700;

  cursor: pointer;
  box-shadow: 0 16px 34px ${({ theme }) => theme.active};

  transition: transform 0.14s ease, background 0.14s ease,
    opacity 0.14s ease, box-shadow 0.14s ease;

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
`;

export const TabButton = styled.button<{ $active: boolean }>`
  height: 38px;
  padding: 0 14px;
  border-radius: ${ui.radius.pill};
  border: 1px solid ${({ theme }) => theme.border};
  cursor: pointer;
  font-weight: 700;

  background: ${({ $active, theme }) => ($active ? theme.active : theme.lightDefault)};
  color: ${({ $active, theme }) => ($active ? theme.primary : theme.text)};

  transition: transform 0.12s ease, background 0.12s ease, border-color 0.12s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: ${({ theme }) => theme.primary};
  }

  &:active {
    transform: translateY(0px);
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
`;

export const SectionHeader = styled.div`
  display: grid;
  gap: 4px;
  margin-bottom: 12px;
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
`;

/* =========================
   INPUT (para buscar vaga)
========================= */
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

/* =========================
   EDITAL
========================= */
export const EditalCard = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.lightDefault};
  border-radius: ${ui.radius.xl};
  padding: 12px;
  box-shadow: ${ui.shadow.sm};

  display: grid;
  gap: 10px;
`;

export const EditalTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;

  @media (max-width: 520px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const EditalInfo = styled.div`
  display: grid;
  gap: 3px;
`;

export const EditalTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`;

export const EditalMeta = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${({ theme }) => theme.description};
`;

export const FileRow = styled.div`
  display: grid;
  grid-template-columns: 52px 1fr auto;
  align-items: center;
  gap: 10px;

  padding: 10px;
  border-radius: ${ui.radius.lg};
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};

  @media (max-width: 620px) {
    grid-template-columns: 52px 1fr;
  }
`;

export const FileBadge = styled.span`
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  border-radius: ${ui.radius.pill};
  background: ${({ theme }) => theme.lightPrimary};
  color: ${({ theme }) => theme.primary};
  font-weight: 700;
  font-size: 12px;
`;

export const FileName = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const FileLink = styled.a`
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.link};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 620px) {
    display: none;
  }
`;

export const Notes = styled.div`
  padding: 10px;
  border-radius: ${ui.radius.lg};
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
`;

export const NotesTitle = styled.h4`
  margin: 0 0 6px 0;
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`;

export const NotesText = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.45;
  color: ${({ theme }) => theme.description};
`;

export const VagasToolbar = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-end;
  justify-content: space-between;

  margin-bottom: 12px;

  @media (max-width: 720px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

/* wrapper para permitir scroll horizontal quando faltar espaço */
export const VagasTableWrap = styled.div`
  width: 100%;
  border-radius: ${ui.radius.xl};
  overflow: hidden;

  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};

  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

export const VagasTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 760px; /* força tabela a não “quebrar” feio no mobile */

  thead tr {
    background: ${({ theme }) => theme.lightDefault};
  }

  tbody tr + tr td {
    border-top: 1px solid ${({ theme }) => theme.border};
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
`;

export const Td = styled.td`
  padding: 12px;
  vertical-align: middle;
  color: ${({ theme }) => theme.description};
`;

export const Tr = styled.tr`
  background: ${({ theme }) => theme.background};

  &:hover {
    background: ${({ theme }) => theme.active};
  }
`;

export const VagaName = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  line-height: 1.25;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 520px;
`;

export const VagaSubText = styled.div`
  margin-top: 4px;
  font-size: 12px;
  color: ${({ theme }) => theme.description};

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 520px;
`;

export const RowActions = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
`;

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

/* chips de info */
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
`;

/* =========================
   STATUS PILL (vaga)
========================= */
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
`;

/* =========================
   META ITEM (reuso)
========================= */
export const MetaItem = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.lightDefault};
  border-radius: ${ui.radius.lg};
  padding: 10px;

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
  font-weight: 700;
  color: ${({ theme }) => theme.text};

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;


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
  font-weight: 700;
`;

export const EmptyText = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${({ theme }) => theme.description};
`;