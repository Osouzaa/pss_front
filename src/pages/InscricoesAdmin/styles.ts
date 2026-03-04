import styled, { keyframes } from "styled-components";

// ─── animations ───────────────────────────────────────────────
const shimmer = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position:  400px 0; }
`;

const fetchSlide = keyframes`
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
`;

// ─── layout ───────────────────────────────────────────────────
export const Page = styled.div``;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`;

export const StatusBadge = styled.span<{ $status: string }>`
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.4px;
  text-transform: uppercase;

  ${({ $status, theme }) => {
    if ($status === "ABERTO")
      return `background: ${theme.statusDoneBg}; color: ${theme.statusDoneText};`;
    if ($status === "ENCERRADO")
      return `background: ${theme.statusCancelBg}; color: ${theme.statusCancelText};`;
    if ($status === "RASCUNHO")
      return `background: ${theme.warningBg}; color: ${theme.warningText};`;
    return `background: ${theme.lightDefault}; color: ${theme.textMuted};`;
  }}
`;

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

export const MetaItem = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.textMuted};

  & + &::before {
    content: "·";
    margin-right: 6px;
    color: ${({ theme }) => theme.border};
  }
`;

export const HeaderStats = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.surfaceBorder};
  border-radius: 12px;
  padding: 10px 18px;
`;

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-width: 52px;
`;

export const StatValue = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  line-height: 1;
`;

export const StatLabel = styled.span`
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.textMuted};
`;

export const StatDivider = styled.div`
  width: 1px;
  height: 28px;
  background: ${({ theme }) => theme.surfaceBorder};
`;

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
`;

export const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Breadcrumb = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.textMuted};
  letter-spacing: 0.3px;
`;

export const MetaChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 6px;
  background: ${({ theme }) => theme.lightPrimary};
  color: ${({ theme }) => theme.primary};
  font-size: 12px;
  font-weight: 500;
  border: 1px solid ${({ theme }) => theme.surfaceBorder};
`;

export const Pills = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: 999px;
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.textMuted};
  font-size: 12px;
  border: 1px solid ${({ theme }) => theme.surfaceBorder};

  b {
    color: ${({ theme }) => theme.text};
  }
`;

// ─── card ─────────────────────────────────────────────────────
export const Card = styled.div`
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.surfaceBorder};
  box-shadow: ${({ theme }) => theme.shadowSoft};
  border-radius: 16px;
  padding: 16px;
  overflow: hidden;
  position: relative;
`;

export const FetchingBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: ${({ theme }) => theme.primary};
  transform-origin: left;
  animation: ${fetchSlide} 1.2s ease-in-out infinite alternate;
  border-radius: 0 2px 2px 0;
`;

// ─── filters ──────────────────────────────────────────────────
export const FiltersBar = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 4px;
`;

export const FiltersLeft = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 10px;
  flex-wrap: wrap;
  flex: 1;
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 140px;
`;

export const Label = styled.span`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.textMuted};
`;

export const Input = styled.input`
  height: 38px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.text};
  font-size: 13px;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;

  &::placeholder { color: ${({ theme }) => theme.placeholder}; }

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.lightPrimary};
  }

  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const Select = styled.select`
  height: 38px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.text};
  font-size: 13px;
  outline: none;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.lightPrimary};
  }

  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const Button = styled.button<{
  $variant?: "primary" | "ghost" | "danger";
}>`
  height: 38px;
  padding: 0 16px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.surfaceBorder};
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: background 0.15s, opacity 0.15s;
  white-space: nowrap;
  text-decoration: none; /* para quando usado como <a> */

  &:disabled { opacity: 0.5; cursor: not-allowed; }

  ${({ $variant, theme }) => {
    if ($variant === "primary")
      return `
        background: ${theme.primary};
        color: ${theme["text-white"]};
        border-color: ${theme.primary};
        &:hover:not(:disabled) { background: ${theme.primaryHover}; }
      `;
    if ($variant === "danger")
      return `
        background: ${theme.danger};
        color: ${theme["text-white"]};
        border-color: ${theme.danger};
        &:hover:not(:disabled) { background: ${theme.hoverDanger}; }
      `;
    return `
      background: ${theme.backgroundInput};
      color: ${theme.text};
      &:hover:not(:disabled) { background: ${theme.lightPrimary}; color: ${theme.primary}; }
    `;
  }}
`;

// ─── feedback ─────────────────────────────────────────────────
export const ErrorBox = styled.div`
  margin: 12px 0;
  padding: 12px 16px;
  border-radius: 10px;
  background: ${({ theme }) => theme.lightDanger};
  color: ${({ theme }) => theme.danger};
  font-size: 13px;
  border: 1px solid ${({ theme }) => theme.statusCancelBg};

  code {
    background: rgba(0, 0, 0, 0.06);
    padding: 1px 6px;
    border-radius: 4px;
    font-size: 12px;
  }
`;

export const Empty = styled.div`
  margin: 4px 0;
  padding: 16px;
  border-radius: 10px;
  border: 1px dashed ${({ theme }) => theme.surfaceBorder};
  color: ${({ theme }) => theme.textMuted};
  background: ${({ theme }) => theme.backgroundInput};
  font-size: 13px;
  text-align: center;
`;

// ─── skeleton ─────────────────────────────────────────────────
export const Skeleton = styled.span`
  display: block;
  height: 14px;
  border-radius: 6px;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.backgroundInput} 25%,
    ${({ theme }) => theme.lightPrimary} 50%,
    ${({ theme }) => theme.backgroundInput} 75%
  );
  background-size: 400px 100%;
  animation: ${shimmer} 1.2s infinite linear;
  min-width: 60px;
`;

// ─── table ────────────────────────────────────────────────────
export const TableWrap = styled.div`
  margin-top: 14px;
  overflow: auto;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.surfaceBorder};

  &::-webkit-scrollbar { height: 6px; }
  &::-webkit-scrollbar-track { background: ${({ theme }) => theme.scrollbarTrack}; }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.scrollbarThumb};
    border-radius: 999px;
    &:hover { background: ${({ theme }) => theme.scrollbarThumbHover}; }
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 920px;

  thead th {
    position: sticky;
    top: 0;
    z-index: 1;
    background: ${({ theme }) => theme.backgroundInput};
    text-align: left;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: ${({ theme }) => theme.textMuted};
    padding: 10px 12px;
    border-bottom: 1px solid ${({ theme }) => theme.surfaceBorder};
    white-space: nowrap;
  }

  tbody td {
    padding: 10px 12px;
    border-bottom: 1px solid ${({ theme }) => theme.surfaceBorder};
    font-size: 13px;
    color: ${({ theme }) => theme.text};
    white-space: nowrap;
  }

  tbody tr:last-child td { border-bottom: none; }
  tbody tr:hover td { background: ${({ theme }) => theme.lightPrimary}44; }
`;

export const Rank = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ theme }) => theme.lightPrimary};
  color: ${({ theme }) => theme.primary};
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
`;

export const Mono = styled.span`
  font-family: ui-monospace, "Cascadia Code", monospace;
  font-size: 12px;
  color: ${({ theme }) => theme.textMuted};
`;

export const Score = styled.span`
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
`;

export const Badge = styled.span<{
  $tone?: "success" | "warning" | "danger" | "default";
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  border: 1px solid transparent;

  ${({ $tone, theme }) => {
    if ($tone === "success")
      return `background:${theme.statusDoneBg}; color:${theme.statusDoneText}; border-color:${theme.statusDoneBg};`;
    if ($tone === "warning")
      return `background:${theme.warningBg}; color:${theme.warningText}; border-color:${theme.warningBg};`;
    if ($tone === "danger")
      return `background:${theme.statusCancelBg}; color:${theme.statusCancelText}; border-color:${theme.statusCancelBg};`;
    return `background:${theme.lightDefault}; color:${theme.textMuted};`;
  }}
`;

// ─── footer / paginação ───────────────────────────────────────
export const Footer = styled.div`
  margin-top: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

export const Pagination = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const PageInfo = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  min-width: 60px;
  text-align: center;
`;

export const Muted = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.textMuted};
`;

// ─── modal ────────────────────────────────────────────────────
export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(3px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

export const Modal = styled.div`
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.surfaceBorder};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadowSoft};
  width: 100%;
  max-width: 560px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 20px 14px;
  border-bottom: 1px solid ${({ theme }) => theme.surfaceBorder};
  flex-shrink: 0;
`;

export const ModalTitle = styled.h2`
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`;

export const ModalSub = styled.p`
  margin: 4px 0 0;
  font-size: 12px;
  color: ${({ theme }) => theme.textMuted};
`;

export const ModalClose = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: ${({ theme }) => theme.textMuted};
  padding: 2px 6px;
  border-radius: 6px;
  line-height: 1;
  flex-shrink: 0;
  &:hover { background: ${({ theme }) => theme.backgroundInput}; }
`;

export const ModalBody = styled.div`
  overflow-y: auto;
  padding: 16px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.scrollbarThumb};
    border-radius: 999px;
  }
`;

export const ModalScoreRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const ModalScoreBox = styled.div`
  flex: 1;
  min-width: 90px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.surfaceBorder};
  background: ${({ theme }) => theme.backgroundInput};
`;

export const ModalSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ModalSectionTitle = styled.span`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.textMuted};
`;

export const TieList = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const TieItem = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: ${({ theme }) => theme.text};
`;

export const TieNum = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: ${({ theme }) => theme.lightPrimary};
  color: ${({ theme }) => theme.primary};
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
`;

export const DetalheTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead th {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    color: ${({ theme }) => theme.textMuted};
    padding: 6px 8px;
    border-bottom: 1px solid ${({ theme }) => theme.surfaceBorder};
    text-align: left;
  }

  tbody td {
    padding: 8px;
    font-size: 13px;
    color: ${({ theme }) => theme.text};
    border-bottom: 1px solid ${({ theme }) => theme.surfaceBorder};
  }

  tbody tr:last-child td { border-bottom: none; }
  tbody tr:hover td { background: ${({ theme }) => theme.lightPrimary}44; }
`;

// ─── documentos ───────────────────────────────────────────────
export const DocList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const DocItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  background: ${({ theme }) => theme.backgroundInput};
  border: 1px solid ${({ theme }) => theme.surfaceBorder};
  transition: border-color 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.primary}66;
  }
`;

export const DocInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

export const DocIcon = styled.span`
  font-size: 20px;
  line-height: 1;
  flex-shrink: 0;
`;

export const DocNome = styled.p`
  margin: 0;
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
`;

export const DocMeta = styled.p`
  margin: 2px 0 0;
  font-size: 11px;
  color: ${({ theme }) => theme.textMuted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
`;

// ─── avaliação ────────────────────────────────────────────────
export const AvaliacaoBox = styled.div<{ $decisao: "DEFERIDA" | "INDEFERIDA" }>`
  padding: 14px 16px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 13px;

  ${({ $decisao, theme }) =>
    $decisao === "DEFERIDA"
      ? `
        background: ${theme.statusDoneBg};
        color: ${theme.statusDoneText};
        border: 1px solid ${theme.statusDoneText}22;
      `
      : `
        background: ${theme.statusCancelBg};
        color: ${theme.statusCancelText};
        border: 1px solid ${theme.statusCancelText}22;
      `}
`;

export const AvaliacaoConfirmText = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
`;

export const AvaliacaoBtns = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid ${({ theme }) => theme.surfaceBorder};
  margin-top: 4px;
`;