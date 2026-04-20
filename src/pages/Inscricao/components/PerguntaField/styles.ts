import styled, { css } from "styled-components";

export const Card = styled.section<{ $answered?: boolean }>`
  background: ${({ theme }) => theme.background};
  border: 1.5px solid
    ${({ theme, $answered }) =>
      $answered ? `${theme.primary}30` : theme.border};
  border-radius: 16px;
  padding: 18px;
  box-shadow: ${({ $answered }) =>
    $answered
      ? "0 6px 20px rgba(0,0,0,0.05)"
      : "0 4px 12px rgba(0,0,0,0.04)"};

  transition:
    transform 0.12s ease,
    box-shadow 0.12s ease,
    border-color 0.12s ease;

  &:hover {
    border-color: ${({ theme }) => `${theme.primary}44`};
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 14px;
    border-radius: 14px;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;

export const NumberBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 26px;
  height: 26px;
  border-radius: 8px;
  background: ${({ theme }) => theme.lightPrimary};
  color: ${({ theme }) => theme.primary};
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.02em;
  flex-shrink: 0;
  margin-top: 1px;
`;

export const TitleArea = styled.div`
  flex: 1;
  min-width: 0;
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex-wrap: wrap;
`;

export const Title = styled.h4`
  margin: 0;
  font-size: 14.5px;
  font-weight: 900;
  color: ${({ theme }) => theme.text};
  letter-spacing: -0.01em;
  min-width: 0;
  word-break: break-word;
  overflow-wrap: anywhere;
  line-height: 1.25;
  flex: 1;
`;

export const Required = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 900;
  line-height: 1;
  color: ${({ theme }) => theme["text-white"]};
  background: ${({ theme }) => theme.hoverDanger};
  flex-shrink: 0;
  margin-top: 1px;
`;

export const AttachmentStatus = styled.div<{ $ok: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 7px;
  padding: 5px 11px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.2;
  width: fit-content;

  ${({ $ok, theme }) =>
    $ok
      ? css`
          background: ${theme.statusDoneBg};
          color: ${theme.statusDoneText};
          border: 1px solid ${theme.statusDoneText}30;
        `
      : css`
          background: ${theme.warningBg};
          color: ${theme.warningText};
          border: 1px solid rgba(255, 195, 0, 0.4);
        `}
`;

export const Description = styled.p`
  margin: 7px 0 0;
  font-size: 13px;
  color: ${({ theme }) => theme.description};
  line-height: 1.6;
`;

export const Body = styled.div`
  margin-top: 14px;
`;

export const BooleanGroup = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

export const BooleanOption = styled.label<{
  $disabled?: boolean;
  $active?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid
    ${({ theme, $active }) => ($active ? theme.primary : theme.border)};
  background: ${({ theme, $active }) =>
    $active ? theme.lightPrimary : theme.backgroundInput};
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
  transition:
    background 0.12s ease,
    border-color 0.12s ease,
    transform 0.06s ease;

  &:hover {
    background: ${({ theme, $disabled }) =>
      $disabled ? theme.backgroundInput : theme.lightPrimary};
    border-color: ${({ theme, $disabled }) =>
      $disabled ? theme.border : `${theme.primary}66`};
  }

  &:active {
    transform: ${({ $disabled }) => ($disabled ? "none" : "scale(0.99)")};
  }

  input {
    accent-color: ${({ theme }) => theme.primary};
    transform: translateY(1px);
  }

  span {
    font-size: 13px;
    color: ${({ theme }) => theme.text};
    font-weight: 600;
  }
`;

export const DaysHelper = styled.div`
  margin-top: 6px;
  font-size: 12px;
  color: ${({ theme }) => theme.description};
`;

export const PointsBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  white-space: nowrap;
  flex-shrink: 0;
  background: ${({ theme }) => `${theme.secondary}18`};
  color: ${({ theme }) => theme.secondary};
  border: 1px solid ${({ theme }) => `${theme.secondary}30`};

  svg { flex-shrink: 0; }
`;

/* ── ANEXO picker ── */
export const AnexoPicker = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const AnexoZone = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1.5px dashed ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.description};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.12s, background 0.12s;
  width: 100%;
  text-align: left;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.lightPrimary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const AnexoHint = styled.span`
  font-size: 11px;
  font-weight: 400;
  color: ${({ theme }) => theme.description};
  margin-left: auto;
`;

export const AnexoSelected = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1.5px solid ${({ theme }) => `${theme.primary}40`};
  background: ${({ theme }) => theme.lightPrimary};
`;

export const AnexoFileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  flex: 1;
  min-width: 0;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.primary};

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  small {
    font-size: 11px;
    font-weight: 400;
    color: ${({ theme }) => theme.description};
    flex-shrink: 0;
  }

  svg { flex-shrink: 0; }
`;

export const AnexoClearBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.description};
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.1s, color 0.1s;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.hoverDanger}22;
    color: ${({ theme }) => theme.hoverDanger};
  }

  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;
