import styled from "styled-components";

export const Page = styled.div`
  padding: 18px;
  background: ${({ theme }) => theme.bodyBg};
  min-height: calc(100vh - 64px);
`;

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
`;

export const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 20px;
  line-height: 1.2;
  color: ${({ theme }) => theme.text};
`;

export const Subtitle = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${({ theme }) => theme.textMuted};
`;

export const Pills = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  background: ${({ theme }) => theme.lightPrimary};
  color: ${({ theme }) => theme.primary};
  font-size: 12px;
  border: 1px solid ${({ theme }) => theme.surfaceBorder};
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.surfaceBorder};
  box-shadow: ${({ theme }) => theme.shadowSoft};
  border-radius: 14px;
  padding: 14px;
`;

export const Filters = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr 1fr auto auto;
  gap: 10px;
  align-items: end;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.textMuted};
`;

export const Input = styled.input`
  height: 40px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.text};
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.placeholder};
  }

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.lightPrimary};
  }
`;

export const Select = styled.select`
  height: 40px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.text};
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.lightPrimary};
  }
`;

export const Button = styled.button<{ $variant?: "primary" | "ghost" | "danger" }>`
  height: 40px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.surfaceBorder};
  cursor: pointer;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${({ $variant, theme }) => {
    if ($variant === "primary") {
      return `
        background: ${theme.primary};
        color: ${theme["text-white"]};
        border-color: ${theme.primary};
        &:hover { background: ${theme.primaryHover}; }
      `;
    }
    if ($variant === "danger") {
      return `
        background: ${theme.danger};
        color: ${theme["text-white"]};
        border-color: ${theme.danger};
        &:hover { background: ${theme.hoverDanger}; }
      `;
    }
    return `
      background: rgba(255,255,255,0.5);
      color: ${theme.text};
      &:hover { background: rgba(255,255,255,0.75); }
    `;
  }}
`;

export const TableWrap = styled.div`
  margin-top: 12px;
  overflow: auto;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.surfaceBorder};
  background: rgba(255,255,255,0.6);
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 980px;

  thead th {
    position: sticky;
    top: 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(6px);
    text-align: left;
    font-size: 12px;
    color: ${({ theme }) => theme.textMuted};
    padding: 10px 10px;
    border-bottom: 1px solid ${({ theme }) => theme.surfaceBorder};
    white-space: nowrap;
  }

  tbody td {
    padding: 10px 10px;
    border-bottom: 1px solid ${({ theme }) => theme.surfaceBorder};
    font-size: 13px;
    color: ${({ theme }) => theme.text};
    white-space: nowrap;
  }

  tbody tr:hover td {
    background: rgba(0, 0, 155, 0.04);
  }
`;

export const Badge = styled.span<{ $tone?: "success" | "warning" | "danger" | "default" }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 700;
  border: 1px solid ${({ theme }) => theme.surfaceBorder};

  ${({ $tone, theme }) => {
    if ($tone === "success") return `background:${theme.statusDoneBg}; color:${theme.statusDoneText};`;
    if ($tone === "warning") return `background:${theme.warningBg}; color:${theme.warningText};`;
    if ($tone === "danger") return `background:${theme.statusCancelBg}; color:${theme.statusCancelText};`;
    return `background:${theme.lightDefault}; color:${theme.text};`;
  }}
`;

export const Footer = styled.div`
  margin-top: 12px;
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

export const Muted = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.textMuted};
`;

export const Empty = styled.div`
  margin-top: 12px;
  padding: 18px;
  border-radius: 12px;
  border: 1px dashed ${({ theme }) => theme.surfaceBorder};
  color: ${({ theme }) => theme.textMuted};
  background: rgba(255,255,255,0.5);
  font-size: 13px;
`;