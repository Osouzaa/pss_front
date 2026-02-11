import styled from "styled-components";

export const Section = styled.section`
  padding: 14px;
  border-radius: 14px;
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

export const EmptyState = styled.div`
  border: 1px dashed ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  border-radius: 14px;
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

export const InscricoesTableWrap = styled.div`
  width: 100%;
  max-width: 100%;
  border-radius: 14px;
  overflow: hidden;

  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};

  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-gutter: stable both-edges;
`;

export const InscricoesTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;

  min-width: 860px;

  thead tr {
    background: ${({ theme }) => theme.lightDefault};
  }

  tbody tr + tr td {
    border-top: 1px solid ${({ theme }) => theme.border};
  }

  @media (max-width: 520px) {
    min-width: 780px;
  }

  @media (max-width: 420px) {
    min-width: 720px;
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

export const Tr = styled.tr`
  background: ${({ theme }) => theme.background};

  &:hover {
    background: ${({ theme }) => theme.active};
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

export const Muted = styled.span`
  color: ${({ theme }) => theme.description};
  font-size: 12px;
`;

export const CellStrong = styled.div`
  font-size: 13px;
  font-weight: 800;
  color: ${({ theme }) => theme.text};
  line-height: 1.25;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  max-width: clamp(180px, 34vw, 360px);
`;

export const CellSub = styled.div`
  margin-top: 4px;
  font-size: 12px;
  color: ${({ theme }) => theme.description};

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  max-width: clamp(180px, 34vw, 360px);
`;

export const CellMono = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  white-space: nowrap;
`;

export const CellClamp2 = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.description};
  line-height: 1.35;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  overflow: hidden;
  text-overflow: ellipsis;

  max-width: clamp(220px, 46vw, 560px);
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

export const SecondaryButton = styled.button`
  height: 2rem;
  padding: 0 14px;
  border-radius: 14px;

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

export const BtnInline = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

export const PerguntaOrderPill = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 6px 10px;
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.border};

  background: ${({ theme }) => theme.lightPrimary};
  color: ${({ theme }) => theme.primary};
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;
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
  border-radius: 14px;
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

export const YesPill = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;

  border-radius: 14px;
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

  border-radius: 14px;
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
  border-radius: 0.75rem;
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
export const PerguntasTableWrap = styled.div`
  width: 100%;
  max-width: 100%;
  border-radius: 0.85rem;
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

export const IconButton = styled.button`
  height: 2rem;
  width: 2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  border-radius: 0.75rem;
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
