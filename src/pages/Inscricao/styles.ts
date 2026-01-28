// src/pages/Inscricao/styles.ts
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
  max-width: 920px;
  margin: 0 auto;
  padding: ${ui.space.xl};

  @media (max-width: 768px) {
    padding: ${ui.space.lg};
  }
`;

export const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
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
  align-items: center;
  gap: ${ui.space.sm};
  flex-wrap: wrap;
`;

export const StatusPill = styled.span<{ $status?: string }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: ${ui.radius.pill};
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.02em;

  ${({ theme, $status }) => {
    const s = ($status ?? "").toUpperCase();

    if (s === "ENVIADA")
      return css`
        background: ${theme.statusDoneBg};
        color: ${theme.statusDoneText};
      `;

    if (s === "RASCUNHO")
      return css`
        background: ${theme.lightPrimary};
        color: ${theme.primary};
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

export const Badge = styled.div`
  display: grid;
  gap: ${ui.space.xs};
  padding: ${ui.space.md};
  border-radius: ${ui.radius.lg};
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  box-shadow: ${ui.shadowSoft};
  min-width: 260px;

  @media (max-width: 768px) {
    min-width: unset;
  }
`;

export const BadgeRow = styled.div`
  display: flex;
  gap: ${ui.space.md};
  align-items: baseline;
  justify-content: space-between;
`;

export const BadgeLabel = styled.span`
  color: ${({ theme }) => theme.description};
  font-size: 12px;
`;

export const BadgeValue = styled.span`
  color: ${({ theme }) => theme.text};
  font-weight: 800;
  font-size: 14px;
`;

export const Card = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  border-radius: ${ui.radius.xl};
  box-shadow: ${ui.shadow};
  overflow: hidden;
`;

export const CardHeader = styled.div`
  padding: ${ui.space.lg};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.background} 0%,
    ${({ theme }) => theme.bodyBg} 100%
  );
`;

export const CardHeaderTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.text};
  font-size: 15px;
  letter-spacing: -0.01em;
`;

export const CardHeaderText = styled.p`
  margin: 6px 0 0;
  color: ${({ theme }) => theme.description};
  font-size: 13px;
  line-height: 1.5;
`;

export const Form = styled.form`
  padding: ${ui.space.lg};

  @media (max-width: 768px) {
    padding: ${ui.space.md};
  }
`;

export const Fieldset = styled.fieldset`
  border: 0;
  padding: 0;
  margin: 0;

  &[disabled] {
    opacity: 0.78;
    cursor: not-allowed;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${ui.space.md};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Section = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${ui.space.md};
  margin-top: ${ui.space.sm};
  padding-top: ${ui.space.sm};
  border-top: 1px solid ${({ theme }) => theme.border};
`;

export const SectionTitle = styled.h4`
  margin: 0;
  color: ${({ theme }) => theme.text};
  font-size: 13px;
  letter-spacing: 0.02em;
  text-transform: uppercase;
`;

export const Field = styled.label`
  display: grid;
  gap: 8px;
  color: ${({ theme }) => theme.text};
  font-size: 13px;
`;

export const Input = styled.input`
  height: ${ui.controlH};
  border-radius: ${ui.radius.md};
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.backgroundInput};
  padding: 0 12px;
  color: ${({ theme }) => theme.text};
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;

  &::placeholder {
    color: ${({ theme }) => theme.description};
  }

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 4px ${({ theme }) => theme.active};
    background: ${({ theme }) => theme.background};
  }
`;

export const TextArea = styled.textarea`
  min-height: 120px;
  border-radius: ${ui.radius.md};
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.backgroundInput};
  padding: 10px 12px;
  color: ${({ theme }) => theme.text};
  outline: none;
  resize: vertical;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;

  &::placeholder {
    color: ${({ theme }) => theme.description};
  }

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 4px ${({ theme }) => theme.active};
    background: ${({ theme }) => theme.background};
  }
`;

export const Helper = styled.small`
  color: ${({ theme }) => theme.description};
  font-size: 12px;
  line-height: 1.3;
`;

export const ErrorText = styled.small`
  color: ${({ theme }) => theme.danger};
  font-size: 12px;
  line-height: 1.3;
`;

export const CheckRow = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${ui.radius.md};
  background: ${({ theme }) => theme.background};
  cursor: pointer;
  transition: transform 0.08s ease, background 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    background: ${({ theme }) => theme.bodyBg};
  }
`;

export const Checkbox = styled.input.attrs({ type: "checkbox" })`
  width: 18px;
  height: 18px;
  accent-color: ${({ theme }) => theme.primary};
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${ui.space.sm};
  margin-top: ${ui.space.lg};
  padding-top: ${ui.space.md};
  border-top: 1px solid ${({ theme }) => theme.border};

  @media (max-width: 768px) {
    justify-content: stretch;

    button {
      width: 100%;
    }
  }
`;

const buttonBase = css`
  height: ${ui.controlH};
  padding: 0 14px;
  border-radius: ${ui.radius.md};
  font-weight: 800;
  letter-spacing: 0.01em;
  border: 1px solid transparent;
  cursor: pointer;
  transition: transform 0.08s ease, background 0.15s ease, border-color 0.15s ease,
    opacity 0.15s ease;
  user-select: none;

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
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

export const LoadingState = styled.div`
  padding: ${ui.space.lg};
  border: 1px dashed ${({ theme }) => theme.border};
  border-radius: ${ui.radius.xl};
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.description};
`;

export const ErrorBox = styled.div`
  margin-top: ${ui.space.md};
  padding: ${ui.space.md};
  border-radius: ${ui.radius.lg};
  border: 1px solid ${({ theme }) => theme.danger};
  background: ${({ theme }) => theme.lightDanger};
  color: ${({ theme }) => theme.statusCancelText};
  font-size: 13px;
`;
