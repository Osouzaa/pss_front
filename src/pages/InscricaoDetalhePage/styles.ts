import styled, { css } from "styled-components";

/* ===== Layout Base ===== */
export const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  border-radius: 18px;
  padding: 16px;
  min-width: 0;
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
  padding: 12px;
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bodyBg};
  min-width: 0;

  svg { flex: 0 0 auto; color: ${({ theme }) => theme.primary}; }
  div { min-width: 0; }
  span { display: block; font-size: 11px; color: ${({ theme }) => theme.description}; margin-bottom: 2px; }
  strong {
    display: block; font-size: 13px; color: ${({ theme }) => theme.text};
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
`;

export const MetaWide = styled.div`
  grid-column: 1 / -1;
  padding: 14px;
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bodyBg};
  min-width: 0;
`;

export const ScoreRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

export const CandidatoNome = styled.h2`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
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

/* ===== Card ===== */
export const Card = styled.section`
  border-radius: 18px;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  min-width: 0;
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;

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
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bodyBg};
  min-width: 0;
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

/* ===== Scroll ===== */
export const ScrollArea = styled.div`
  max-height: 65vh;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-right: 4px;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
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

/* ===================== FICHA (PERGUNTAS) ===================== */
export const Ficha = styled.div<{ respondida?: boolean }>`
  border-radius: 16px;
  border: 1px solid ${({ theme, respondida }) => respondida ? theme.border : theme.border};
  padding: 14px 14px 14px 18px;
  background: ${({ theme }) => theme.bodyBg};
  position: relative;
  min-width: 0;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 10px;
    bottom: 10px;
    width: 4px;
    border-radius: 999px;
    background: ${({ theme, respondida }) => respondida ? theme.primary : theme.border};
    opacity: ${({ respondida }) => respondida ? 0.7 : 0.4};
  }
`;

export const FichaHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

export const FichaLeft = styled.div`
  display: flex;
  gap: 10px;
  min-width: 0;
  flex: 1;
`;

export const FichaRight = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-start;
  flex-wrap: wrap;
  flex: 0 0 auto;
`;

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

export const FichaBody = styled.div`
  margin-top: 10px;
  display: grid;
  grid-template-columns: 1fr 200px;
  gap: 10px;
  min-width: 0;

  @media (max-width: 860px) { grid-template-columns: 1fr; }
`;

export const AnswerBlock = styled.div<{ respondida?: boolean }>`
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  padding: 10px 12px;
  min-width: 0;

  span { font-size: 11px; color: ${({ theme }) => theme.description}; }

  strong {
    display: block;
    margin-top: 5px;
    font-size: 13px;
    color: ${({ theme, respondida }) => respondida ? theme.text : theme.description};
    overflow-wrap: anywhere;
    line-height: 1.4;
    font-style: ${({ respondida }) => respondida ? "normal" : "italic"};
  }
`;

export const DocBlock = styled(AnswerBlock)``;

export const DocStatus = styled.div<{ type: "ok" | "missing" | "none" }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 5px;
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