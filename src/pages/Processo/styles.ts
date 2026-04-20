import styled, { css } from "styled-components";

const ui = {
  radius: { sm: "10px", md: "14px", lg: "18px", xl: "20px", pill: "999px" },
  space: { xs: "6px", sm: "10px", md: "12px", lg: "16px" },
  h: { btn: "38px", input: "38px" },
  mobileBottomBar: "90px",
};

/* ===================== Layout ===================== */
export const ContainerProcesso = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (max-width: 768px) {
    padding-bottom: calc(
      ${ui.mobileBottomBar} + env(safe-area-inset-bottom, 0px)
    );
  }
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
  padding: 0 16px;
  border-radius: ${ui.radius.md};
  border: 1px solid transparent;
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme["text-white"]};
  font-weight: 800;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.14s ease, transform 0.1s ease;

  &:hover {
    background: ${({ theme }) => theme.primaryHover};
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0);
  }
`;

/* ===================== Toolbar / Filtros ===================== */
export const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 10px;

  padding: 12px 14px;
  border-radius: ${ui.radius.lg};
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 180px;

  @media (max-width: 600px) {
    min-width: unset;
  }
`;

export const FilterLabel = styled.label`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
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
  font-size: 13px;
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

export const FilterSelect = styled.select`
  height: ${ui.h.input};
  border-radius: ${ui.radius.md};
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.text};
  padding: 0 10px;
  font-size: 13px;
  outline: none;
  cursor: pointer;
  transition: border-color 0.14s ease, box-shadow 0.14s ease;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.active};
  }
`;

export const FilterActions = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;

  @media (max-width: 600px) {
    justify-content: flex-end;
  }
`;

export const FilterButton = styled.button`
  height: ${ui.h.btn};
  padding: 0 16px;
  border-radius: ${ui.radius.md};
  border: 1px solid transparent;
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme["text-white"]};
  font-weight: 800;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.14s ease, transform 0.1s ease;

  &:hover {
    background: ${({ theme }) => theme.primaryHover};
    transform: translateY(-1px);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const ClearButton = styled.button`
  height: ${ui.h.btn};
  padding: 0 14px;
  border-radius: ${ui.radius.md};
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.text};
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.14s ease, border-color 0.14s ease;

  &:hover {
    background: ${({ theme }) => theme.active};
    border-color: ${({ theme }) => theme.primary};
  }
  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

export const Counter = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.description};
  white-space: nowrap;

  @media (max-width: 600px) {
    margin-left: 0;
    justify-content: flex-end;
  }
`;

export const CounterMuted = styled.span`
  opacity: 0.75;
`;

/* ===================== Table Card ===================== */
export const TableCard = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  border-radius: ${ui.radius.xl};
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

export const TableScrollWrap = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 760px;
`;

export const Thead = styled.thead`
  background: ${({ theme }) => theme.bodyBg};
  border-bottom: 2px solid ${({ theme }) => theme.border};
`;

export const Th = styled.th<{ $center?: boolean; $small?: boolean }>`
  padding: 11px 14px;
  text-align: ${({ $center }) => ($center ? "center" : "left")};
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.description};
  white-space: nowrap;
  width: ${({ $small }) => ($small ? "1px" : "auto")};
`;

export const Tbody = styled.tbody``;

export const Tr = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.border};
  transition: background 0.12s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${({ theme }) => `${theme.lightPrimary}55`};
  }
`;

export const Td = styled.td<{ $center?: boolean; $muted?: boolean }>`
  padding: 13px 14px;
  font-size: 13px;
  color: ${({ theme, $muted }) => ($muted ? theme.description : theme.text)};
  text-align: ${({ $center }) => ($center ? "center" : "left")};
  vertical-align: middle;
`;

export const TdTitle = styled.td`
  padding: 13px 14px;
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  vertical-align: middle;
  max-width: 280px;
`;

export const TitleText = styled.span`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.35;
`;

export const TdActions = styled.td`
  padding: 10px 14px;
  vertical-align: middle;
  white-space: nowrap;
  width: 1px;
`;

export const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

/* ===================== Status Pill ===================== */
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
    case "PRORROGADO":
      return { bg: theme.statusProrrogadoBg, fg: theme.statusProrrogadoText };
    case "RASCUNHO":
      return { bg: theme.lightDefault, fg: theme.description };
    default:
      return { bg: theme.lightDefault, fg: theme.text };
  }
};

export const StatusPill = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: ${ui.radius.pill};
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.04em;
  white-space: nowrap;

  ${({ $status, theme }) => {
    const c = statusTokens($status, theme);
    return css`
      background: ${c.bg};
      color: ${c.fg};
    `;
  }}
`;

/* ===================== Botões ações tabela ===================== */
export const SecondaryButton = styled.button`
  height: 32px;
  padding: 0 12px;
  border-radius: ${ui.radius.sm};
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.text};
  font-weight: 700;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.12s ease, border-color 0.12s ease;

  &:hover {
    background: ${({ theme }) => theme.active};
    border-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.primary};
  }
`;

export const PrimaryButton = styled.button`
  height: 32px;
  padding: 0 12px;
  border-radius: ${ui.radius.sm};
  border: 1px solid transparent;
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme["text-white"]};
  font-weight: 700;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.12s ease, opacity 0.12s ease;

  &:hover {
    background: ${({ theme }) => theme.primaryHover};
  }
  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

/* ===================== Empty / Loading ===================== */
export const EmptyState = styled.div`
  padding: 40px 24px;
  text-align: center;
  display: grid;
  gap: 6px;
  justify-items: center;
`;

export const EmptyTitle = styled.h3`
  margin: 0;
  font-size: 15px;
  color: ${({ theme }) => theme.text};
  font-weight: 800;
`;

export const EmptyText = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${({ theme }) => theme.description};
`;

/* ===================== Pagination ===================== */
export const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  padding: 12px;
  border-radius: ${ui.radius.lg};
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};

  @media (max-width: 768px) {
    margin-bottom: calc(
      ${ui.mobileBottomBar} + env(safe-area-inset-bottom, 0px)
    );
  }
`;

export const PageButton = styled.button`
  height: ${ui.h.btn};
  padding: 0 14px;
  border-radius: ${ui.radius.md};
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.text};
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.12s ease, transform 0.1s ease;

  &:hover {
    background: ${({ theme }) => theme.active};
    border-color: ${({ theme }) => theme.primary};
    transform: translateY(-1px);
  }
  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    transform: none;
  }
`;

export const PageInfo = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.description};
`;

/* ===================== Profile Warn ===================== */
export const ProfileWarn = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid rgba(250, 204, 21, 0.35);
  background: rgba(250, 204, 21, 0.08);
`;

export const ProfileWarnInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ProfileWarnTitle = styled.div`
  font-weight: 800;
  font-size: 13px;
  color: ${({ theme }) => theme.text};
`;

export const ProfileWarnText = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.description};
`;

export const ProfileWarnButton = styled.button`
  flex: 0 0 auto;
  border-radius: 999px;
  padding: 8px 14px;
  border: 1px solid rgba(250, 204, 21, 0.45);
  background: rgba(250, 204, 21, 0.14);
  cursor: pointer;
  font-weight: 800;
  font-size: 13px;
  white-space: nowrap;

  &:hover {
    filter: brightness(1.04);
  }
`;

/* manter para compatibilidade com outros imports existentes */
export const ContainerButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

/* Skeleton para carregamento */
export const SkeletonRow = styled.tr`
  td {
    padding: 13px 14px;
  }
`;

export const SkeletonCell = styled.div<{ $w?: string }>`
  height: 14px;
  border-radius: 6px;
  width: ${({ $w }) => $w ?? "80%"};
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.border} 25%,
    ${({ theme }) => theme.bodyBg} 50%,
    ${({ theme }) => theme.border} 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

/* Campo busca (alias para SearchWrap) */
export const SearchWrap = FilterGroup;
export const SearchLabel = FilterLabel;

/* Mantém Grid e Card caso seja importado em algum lugar */
export const Grid = styled.div``;
export const Card = styled.article``;
