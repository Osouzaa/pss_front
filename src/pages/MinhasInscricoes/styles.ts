// src/pages/MinhasInscricoes/styles.ts
import styled, { css } from "styled-components";

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
    md: "14px",
    lg: "18px",
    xl: "24px",
  },
  shadow: "0 10px 30px rgba(0,0,0,.06)",
  shadowSoft: "0 6px 20px rgba(0,0,0,.05)",
  controlH: "42px",
};

export const Page = styled.div`
  margin: 0 auto;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${ui.space.lg};
  margin-bottom: ${ui.space.lg};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const TitleWrap = styled.div`
  display: grid;
  gap: ${ui.space.xs};
`;

export const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.text};
  font-size: 22px;
  line-height: 1.2;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

export const Subtitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.description};
  font-size: 14px;
  line-height: 1.5;
`;

export const HeaderRight = styled.div`
  display: flex;
  gap: ${ui.space.sm};
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;

  @media (max-width: 768px) {
    justify-content: flex-start;
  }
`;

export const CounterPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  border-radius: ${ui.radius.pill};
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  font-size: 13px;
  box-shadow: ${ui.shadowSoft};
`;

const buttonBase = css`
  height: ${ui.controlH};
  padding: 0 14px;
  border-radius: ${ui.radius.md};
  font-weight: 800;
  letter-spacing: 0.01em;
  border: 1px solid transparent;
  cursor: pointer;
  transition:
    transform 0.08s ease,
    background 0.15s ease,
    border-color 0.15s ease,
    opacity 0.15s ease;

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const RefreshButton = styled.button`
  ${buttonBase};
  background: ${({ theme }) => theme.background};
  border-color: ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.primary};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.BGlink};
    border-color: ${({ theme }) => theme.primary};
  }
`;

export const Toolbar = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.6fr 0.7fr;
  gap: ${ui.space.md};
  align-items: end;
  margin-bottom: ${ui.space.lg};

  padding: ${ui.space.md};
  border-radius: ${ui.radius.xl};
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  box-shadow: ${ui.shadowSoft};

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    align-items: stretch;
  }
`;

export const SearchWrap = styled.div`
  display: grid;
  gap: 8px;
`;

export const SearchLabel = styled.label`
  color: ${({ theme }) => theme.description};
  font-size: 12px;
`;

export const SearchInput = styled.input`
  height: ${ui.controlH};
  border-radius: ${ui.radius.md};
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.backgroundInput};
  padding: 0 12px;
  color: ${({ theme }) => theme.text};
  outline: none;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    background 0.15s ease;

  &::placeholder {
    color: ${({ theme }) => theme.description};
  }

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 4px ${({ theme }) => theme.active};
    background: ${({ theme }) => theme.background};
  }
`;

export const SelectWrap = styled.div`
  display: grid;
  gap: 8px;
`;

export const SelectLabel = styled.label`
  color: ${({ theme }) => theme.description};
  font-size: 12px;
`;

export const Select = styled.select`
  height: ${ui.controlH};
  border-radius: ${ui.radius.md};
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.backgroundInput};
  padding: 0 12px;
  color: ${({ theme }) => theme.text};
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 4px ${({ theme }) => theme.active};
    background: ${({ theme }) => theme.background};
  }
`;

export const MetaRight = styled.div`
  display: grid;
  justify-items: end;
  gap: 6px;

  @media (max-width: 900px) {
    justify-items: start;
  }
`;

export const MetaText = styled.div`
  color: ${({ theme }) => theme.text};
  font-size: 13px;
`;

export const MetaMuted = styled.div`
  color: ${({ theme }) => theme.description};
  font-size: 12px;
`;

export const State = styled.div<{ $variant?: "error" }>`
  padding: ${ui.space.lg};
  border-radius: ${ui.radius.xl};
  border: 1px dashed ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.description};

  ${({ $variant, theme }) =>
    $variant === "error" &&
    css`
      border-style: solid;
      border-color: ${theme.danger};
      background: ${theme.lightDanger};
      color: ${theme.statusCancelText};
    `}
`;

export const StateTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.text};
  font-size: 16px;
`;

export const StateText = styled.p`
  margin: 8px 0 0;
  color: ${({ theme }) => theme.description};
  font-size: 13px;
  line-height: 1.5;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${ui.space.md};

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  border-radius: ${ui.radius.xl};
  box-shadow: ${ui.shadow};
  overflow: hidden;
`;

export const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${ui.space.md};

  padding: ${ui.space.lg};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

export const CardTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.text};
  font-size: 15px;
  letter-spacing: -0.01em;
  line-height: 1.3;
`;

export const StatusPill = styled.span<{ $status?: string }>`
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: ${ui.radius.pill};
  font-weight: 800;
  font-size: 12px;
  letter-spacing: 0.02em;
  white-space: nowrap;

  ${({ theme, $status }) => {
    const s = ($status ?? "").toUpperCase();

    if (s === "RASCUNHO")
      return css`
        background: ${theme.lightPrimary};
        color: ${theme.primary};
      `;

    if (s === "ENVIADA")
      return css`
        background: ${theme.statusDoneBg};
        color: ${theme.statusDoneText};
      `;

    if (s === "EM_ANALISE")
      return css`
        background: ${theme.statusAnalyzeBg};
        color: ${theme.statusAnalyzeText};
      `;

    if (s === "DEFERIDA")
      return css`
        background: ${theme.statusDoneBg};
        color: ${theme.statusDoneText};
      `;

    if (s === "INDEFERIDA")
      return css`
        background: ${theme.statusCancelBg};
        color: ${theme.statusCancelText};
      `;

    return css`
      background: ${theme.lightDefault};
      color: ${theme.text};
    `;
  }}
`;

export const MetaRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${ui.space.md};
  padding: ${ui.space.lg};

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

export const MetaItem = styled.div`
  display: grid;
  gap: 6px;
`;

export const MetaLabel = styled.div`
  color: ${({ theme }) => theme.description};
  font-size: 12px;
`;

export const MetaValue = styled.div`
  color: ${({ theme }) => theme.text};
  font-size: 13px;
  font-weight: 700;
  word-break: break-word;
`;

export const CardFooter = styled.div`
  display: flex;
  gap: ${ui.space.sm};
  padding: ${ui.space.lg};
  border-top: 1px solid ${({ theme }) => theme.border};
  justify-content: flex-end;

  @media (max-width: 520px) {
    flex-direction: column;

    button {
      width: 100%;
    }
  }
`;

export const PrimaryButton = styled.button`
  ${buttonBase};
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme["text-white"]};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.primaryHover};
  }
`;

export const SecondaryButton = styled.button`
  ${buttonBase};
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.primary};
  border-color: ${({ theme }) => theme.border};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.BGlink};
    border-color: ${({ theme }) => theme.primary};
  }
`;

export const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${ui.space.md};
  margin-top: ${ui.space.lg};

  padding: ${ui.space.md};
  border-radius: ${ui.radius.xl};
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  box-shadow: ${ui.shadowSoft};

  @media (max-width: 520px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const PageButton = styled.button`
  ${buttonBase};
  background: ${({ theme }) => theme.background};
  border-color: ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.bodyBg};
    border-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.primary};
  }
`;

export const PageInfo = styled.div`
  color: ${({ theme }) => theme.description};
  font-size: 13px;

  b {
    color: ${({ theme }) => theme.text};
  }
`;
