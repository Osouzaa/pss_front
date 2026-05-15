import styled, { css } from "styled-components";

/* ===== Layout Base ===== */
export const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
`;

/* ===== Skeleton ===== */
const shimmer = css`
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

export const SkeletonHeader = styled.div`
  ${shimmer}
  height: 200px;
  border-radius: 18px;
`;

export const SkeletonCard = styled.div`
  ${shimmer}
  height: 120px;
  border-radius: 18px;
`;

export const ErrorBox = styled.div`
  padding: 24px;
  border-radius: 18px;
  border: 1px solid ${({ theme }) => theme.danger};
  background: ${({ theme }) => theme.lightDanger};
  color: ${({ theme }) => theme.danger};
  text-align: center;
  font-size: 14px;
`;

/* ===== Header ===== */
export const Header = styled.header`
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 10px;
  padding: 16px;
  min-width: 0;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
`;

export const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;

  @media (max-width: 640px) {
    flex-wrap: wrap;
  }
`;

export const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bodyBg};
  color: ${({ theme }) => theme.text};
  font-size: 13px;
  cursor: pointer;
  transition: 0.15s ease;
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => theme.active};
    border-color: ${({ theme }) => theme.primary};
  }
`;

export const TitleArea = styled.div`
  flex: 1;
  min-width: 0;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.2;
  color: ${({ theme }) => theme.text};
`;

export const Subtitle = styled.p`
  margin: 4px 0 0;
  font-size: 13px;
  color: ${({ theme }) => theme.description};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const StatusBadge = styled.div<{ status: string }>`
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  white-space: nowrap;

  ${({ status, theme }) => {
    if (status === "ENVIADA") return css`background: ${theme.lightSuccess}; color: ${theme.statusDoneText};`;
    if (status === "CANCELADA") return css`background: ${theme.lightDanger}; color: ${theme.statusCancelText};`;
    return css`background: ${theme.active}; color: ${theme.primary};`;
  }}
`;

/* ===== Meta ===== */
export const MetaGrid = styled.div`
  margin-top: 14px;
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(4, minmax(0, 1fr));

  @media (max-width: 1024px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

export const MetaCard = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.lightDefault};
  min-width: 0;

  svg { flex: 0 0 auto; color: ${({ theme }) => theme.primary}; }
  div { min-width: 0; }
  span { display: block; font-size: 11px; color: ${({ theme }) => theme.description}; margin-bottom: 2px; }
  strong {
    display: block; font-size: 13px; font-weight: 800; color: ${({ theme }) => theme.text};
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
`;

export const MetaWide = styled.div`
  grid-column: 1 / -1;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  min-width: 0;
`;

export const ScoreRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

export const ScoreTitle = styled.div`
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  font-weight: 800;
`;

export const CandidatoNome = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: ${({ theme }) => theme.text};
  overflow-wrap: anywhere;
`;

export const CandidatoCPF = styled.p`
  margin: 3px 0 0;
  font-size: 12px;
  color: ${({ theme }) => theme.description};
`;

export const ScoreBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 999px;
  background: ${({ theme }) => theme.active};
  border: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.primary};
  font-size: 13px;
  font-weight: 800;
  white-space: nowrap;
`;

export const Obs = styled.p`
  margin: 10px 0 0;
  font-size: 13px;
  color: ${({ theme }) => theme.description};
  line-height: 1.5;
`;

/* ===== Analysis Summary ===== */
export const AnalysisGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 1024px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

export const AnalysisItem = styled.div<{ $tone?: "success" | "warning" }>`
  padding: 14px;
  border-radius: 14px;
  border: 1px solid
    ${({ theme, $tone }) => {
      if ($tone === "success") return theme.statusDoneText;
      if ($tone === "warning") return theme.warning;
      return theme.border;
    }};
  background: ${({ theme, $tone }) => {
    if ($tone === "success") return theme.lightSuccess;
    if ($tone === "warning") return theme.warningBg;
    return theme.background;
  }};
  min-width: 0;

  span {
    display: block;
    font-size: 11px;
    color: ${({ theme }) => theme.description};
    text-transform: uppercase;
    font-weight: 800;
    margin-bottom: 6px;
  }

  strong {
    display: block;
    font-size: 22px;
    line-height: 1;
    color: ${({ theme, $tone }) => {
      if ($tone === "success") return theme.statusDoneText;
      if ($tone === "warning") return theme.warningText;
      return theme.text;
    }};
  }

  small {
    display: block;
    margin-top: 6px;
    font-size: 12px;
    color: ${({ theme, $tone }) => ($tone === "warning" ? theme.warningText : theme.description)};
  }
`;

export const AnalysisBar = styled.div`
  width: 100%;
  height: 6px;
  margin-top: 12px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.1);
`;

export const AnalysisBarFill = styled.div<{ $percent: number }>`
  width: ${({ $percent }) => `${Math.max(0, Math.min(100, $percent))}%`};
  height: 100%;
  border-radius: inherit;
  background: ${({ theme }) => theme.primary};
`;

export const ReviewNotice = styled.div<{ $tone: "success" | "warning" }>`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid ${({ theme, $tone }) => ($tone === "warning" ? theme.warning : theme.statusDoneText)};
  background: ${({ theme, $tone }) => ($tone === "warning" ? theme.warningBg : theme.lightSuccess)};
  color: ${({ theme, $tone }) => ($tone === "warning" ? theme.warningText : theme.statusDoneText)};
  font-size: 13px;
  font-weight: 800;
  line-height: 1.45;

  svg {
    flex: 0 0 auto;
    margin-top: 1px;
  }
`;

export const ReviewPanel = styled.section`
  display: grid;
  grid-template-columns: minmax(180px, 240px) minmax(0, 1fr);
  gap: 12px;
  align-items: stretch;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 10px;
  background: ${({ theme }) => theme.background};

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const ScoreSummary = styled.div`
  min-width: 0;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid ${({ theme }) => theme.primary};
  background: ${({ theme }) => theme.lightDefault};

  span {
    display: block;
    margin-bottom: 10px;
    color: ${({ theme }) => theme.description};
    font-size: 11px;
    font-weight: 900;
    text-transform: uppercase;
  }

  strong {
    display: block;
    color: ${({ theme }) => theme.primary};
    font-size: 34px;
    font-weight: 900;
    line-height: 1;
  }

  small {
    display: block;
    margin-top: 8px;
    color: ${({ theme }) => theme.description};
    font-size: 12px;
    line-height: 1.35;
  }
`;

export const ReviewMetrics = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const SummaryMetric = styled.div<{ $tone?: "success" | "warning" }>`
  min-width: 0;
  padding: 14px;
  border-radius: 8px;
  border: 1px solid ${({ theme, $tone }) => {
    if ($tone === "warning") return theme.warning;
    if ($tone === "success") return theme.statusDoneText;
    return theme.border;
  }};
  background: ${({ theme, $tone }) => {
    if ($tone === "warning") return theme.warningBg;
    if ($tone === "success") return theme.lightSuccess;
    return theme.background;
  }};

  span {
    display: block;
    margin-bottom: 5px;
    color: ${({ theme }) => theme.description};
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
  }

  strong {
    display: block;
    color: ${({ theme, $tone }) => ($tone === "warning" ? theme.warningText : theme.text)};
    font-size: 20px;
    font-weight: 900;
    line-height: 1.15;
  }

  small {
    display: block;
    margin-top: 7px;
    color: ${({ theme, $tone }) => ($tone === "warning" ? theme.warningText : theme.description)};
    font-size: 12px;
    line-height: 1.35;
  }
`;

export const ReviewObservation = styled.div`
  grid-column: 1 / -1;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.lightDefault};

  span {
    display: block;
    margin-bottom: 4px;
    color: ${({ theme }) => theme.description};
    font-size: 11px;
    font-weight: 900;
    text-transform: uppercase;
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.text};
    font-size: 13px;
    line-height: 1.45;
  }
`;

export const MiniProgress = styled.div`
  height: 4px;
  margin-top: 8px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.12);
`;

export const MiniProgressFill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${({ $percent }) => `${Math.max(0, Math.min(100, $percent))}%`};
  border-radius: inherit;
  background: ${({ theme }) => theme.primary};
`;

export const SectionTabs = styled.div`
  display: flex;
  gap: 0;
  padding: 0;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  width: fit-content;
  max-width: 100%;
  overflow-x: auto;
`;

export const SectionTab = styled.button<{ $active?: boolean }>`
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 0 14px;
  border-radius: 0;
  border: 0;
  border-right: 1px solid ${({ theme }) => theme.border};
  border-bottom: 2px solid ${({ theme, $active }) => ($active ? theme.primary : "transparent")};
  background: ${({ theme, $active }) => ($active ? theme.lightDefault : "transparent")};
  color: ${({ theme, $active }) => ($active ? theme.primary : theme.description)};
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.bodyBg};
  }

  &:first-child {
    border-top-left-radius: 9px;
    border-bottom-left-radius: 9px;
  }

  &:last-child {
    border-right: 0;
    border-top-right-radius: 9px;
    border-bottom-right-radius: 9px;
  }
`;

/* ===== Card ===== */
export const Card = styled.section`
  border-radius: 10px;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  min-width: 0;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  h3 {
    margin: 0;
    font-size: 14px;
    font-weight: 700;
    color: ${({ theme }) => theme.text};
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
`;

export const QCount = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.description};
`;

/* ===== Candidato Grid ===== */
export const CandidatoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 1024px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

export const InfoItem = styled.div`
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bodyBg};
  min-width: 0;
  transition:
    background 120ms ease,
    border-color 120ms ease;

  &:hover {
    background: ${({ theme }) => theme.background};
    border-color: ${({ theme }) => theme.link};
  }
`;

export const InfoItemWide = styled(InfoItem)`
  grid-column: 1 / -1;
`;

export const InfoLabel = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.description};
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 4px;
`;

export const InfoValue = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  overflow-wrap: anywhere;
`;

/* ===== Table (Perguntas) ===== */
export const TableWrapper = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
`;

export const PerguntasTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  min-width: 700px;
`;

export const Th = styled.th`
  text-align: left;
  padding: 10px 12px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.description};
  background: ${({ theme }) => theme.bodyBg};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 1;
`;

export const Tr = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.border};
  transition: background 0.1s ease;

  &:last-child { border-bottom: none; }
  &:hover { background: ${({ theme }) => theme.lightDefault}; }
`;

export const Td = styled.td`
  padding: 12px;
  vertical-align: top;
  color: ${({ theme }) => theme.text};
`;

export const TdPergunta = styled(Td)`
  min-width: 200px;
`;

export const TdAnswer = styled(Td)<{ respondida?: boolean }>`
  color: ${({ theme, respondida }) => respondida ? theme.text : theme.description};
  font-style: ${({ respondida }) => respondida ? "normal" : "italic"};
  font-weight: ${({ respondida }) => respondida ? "600" : "400"};
  overflow-wrap: anywhere;
`;

export const TdMuted = styled.span`
  color: ${({ theme }) => theme.description};
`;

export const ComprovantLink = styled.a`
  color: ${({ theme }) => theme.primary};
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  overflow-wrap: anywhere;
  word-break: break-all;

  &:hover { text-decoration: underline; }
`;

/* ===== Empty ===== */
export const Empty = styled.div`
  border: 1px dashed ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bodyBg};
  border-radius: 14px;
  padding: 20px;
  text-align: center;
  color: ${({ theme }) => theme.description};
  font-size: 13px;
`;

/* ===================== DOCUMENTOS ===================== */
export const DocToolbar = styled.div`
  display: grid;
  grid-template-columns: minmax(220px, 1fr) minmax(180px, 260px) auto;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const SearchField = styled.label`
  height: 42px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.description};
  min-width: 0;

  input {
    width: 100%;
    min-width: 0;
    border: 0;
    outline: 0;
    background: transparent;
    color: ${({ theme }) => theme.text};
    font-size: 13px;
  }

  input::placeholder {
    color: ${({ theme }) => theme.placeholder};
  }

  &:focus-within {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.active};
    background: ${({ theme }) => theme.background};
  }
`;

export const FilterField = styled.label`
  height: 42px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.description};
  min-width: 0;

  select {
    width: 100%;
    min-width: 0;
    border: 0;
    outline: 0;
    background: transparent;
    color: ${({ theme }) => theme.text};
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
  }

  &:focus-within {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.active};
    background: ${({ theme }) => theme.background};
  }
`;

export const ClearFilterButton = styled.button`
  height: 42px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.primary};
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => theme.active};
    border-color: ${({ theme }) => theme.primary};
  }
`;

export const DocResultBar = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.description};
  font-size: 12px;

  strong {
    color: ${({ theme }) => theme.text};
    white-space: nowrap;
  }
`;

export const DocGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const DocItem = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bodyBg};
  border-radius: 14px;
  padding: 12px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const DocInfo = styled.div`
  min-width: 0;

  strong {
    display: block;
    font-size: 13px;
    font-weight: 700;
    color: ${({ theme }) => theme.text};
    margin-bottom: 2px;
  }

  div {
    font-size: 13px;
    color: ${({ theme }) => theme.text};
    overflow-wrap: anywhere;
  }

  small {
    display: block;
    margin-top: 4px;
    font-size: 11px;
    color: ${({ theme }) => theme.description};
  }
`;

export const DocPerguntaRef = styled.div`
  margin-top: 6px;
  font-size: 11px;
  color: ${({ theme }) => theme.description};
  font-style: italic;
  overflow-wrap: anywhere;
`;

export const DocLink = styled.a`
  border: 0;
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme["text-white"]};
  border-radius: 12px;
  padding: 10px 14px;
  text-decoration: none;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: 0.15s ease;
  flex: 0 0 auto;
  white-space: nowrap;

  @media (max-width: 640px) { width: 100%; justify-content: center; }

  &:hover { background: ${({ theme }) => theme.primaryHover}; }
`;

export const DocDisabled = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.description};
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;

  @media (max-width: 640px) { width: 100%; }
`;

export const DocPaginationWrap = styled.div`
  margin-top: 12px;

  > div {
    box-shadow: none;
    background: ${({ theme }) => theme.bodyBg};
  }
`;

/* ===================== PERGUNTAS ===================== */
export const QIndex = styled.div`
  flex: 0 0 auto;
  padding: 5px 10px;
  border-radius: 10px;
  background: ${({ theme }) => theme.lightPrimary};
  color: ${({ theme }) => theme.primary};
  font-weight: 900;
  font-size: 11px;
  letter-spacing: 0.5px;
  height: fit-content;
`;

export const QuestionTitle = styled.div`
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  font-size: 13px;
  line-height: 1.4;
  overflow-wrap: anywhere;
`;

export const QuestionDesc = styled.p`
  margin: 5px 0 0;
  font-size: 12px;
  color: ${({ theme }) => theme.description};
  line-height: 1.5;
  overflow-wrap: anywhere;
`;

export const Required = styled.span`
  color: ${({ theme }) => theme.danger};
  margin-left: 4px;
`;

export const TypePill = styled.div`
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 11px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.description};
  white-space: nowrap;
`;

export const Points = styled.div<{ positive?: boolean }>`
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  white-space: nowrap;
  border: 1px solid ${({ theme, positive }) => positive ? theme.border : theme.border};
  background: ${({ theme, positive }) => positive ? theme.active : theme.background};
  color: ${({ theme, positive }) => positive ? theme.primary : theme.description};
`;

export const DocMultiList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 5px;
`;

export const DocStatus = styled.div<{ type: "ok" | "missing" | "none" }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  overflow-wrap: anywhere;

  ${({ type, theme }) => {
    if (type === "ok") return css`color: ${theme.statusDoneText};`;
    if (type === "missing") return css`color: ${theme.danger};`;
    return css`color: ${theme.description};`;
  }}
`;

/* ===== Opções SELECT ===== */
export const OpcoesList = styled.div`
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const OpcaoItem = styled.div<{ selected?: boolean }>`
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 12px;
  border: 1px solid ${({ theme, selected }) => selected ? theme.primary : theme.border};
  background: ${({ theme, selected }) => selected ? theme.active : theme.background};
  color: ${({ theme, selected }) => selected ? theme.primary : theme.description};
  font-weight: ${({ selected }) => selected ? "700" : "400"};
  transition: 0.1s ease;
`;
