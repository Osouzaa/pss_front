import styled, { css, keyframes } from "styled-components";

type Phase = "idle" | "selected" | "uploading" | "success" | "error";

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

export const Label = styled.label`
  color: ${({ theme }) => theme.text};
  font-size: 0.95rem;
  font-weight: 600;
`;

export const Zone = styled.div<{ $phase: Phase; $disabled: boolean }>`
  width: 100%;
  min-height: 2.875rem;
  border-radius: 0.5rem;
  border: 1px solid
    ${({ theme, $phase }) => {
      if ($phase === "success") return theme.statusDoneText;
      if ($phase === "error") return theme.warningText;
      return theme.border;
    }};
  background: ${({ theme, $phase }) => {
    if ($phase === "success") return theme.statusDoneBg;
    if ($phase === "error") return theme.warningBg;
    return theme.backgroundInput;
  }};
  padding: 0 0.75rem;
  display: flex;
  align-items: center;
  cursor: ${({ $disabled, $phase }) =>
    $disabled || $phase === "success" ? "default" : "pointer"};
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    background 0.15s;
  outline: none;
  gap: 10px;
  user-select: none;

  ${({ $phase, $disabled, theme }) =>
    !$disabled &&
    $phase !== "success" &&
    css`
      &:hover {
        border-color: ${theme.primary};
        background: ${theme.background};
      }
      &:focus {
        border-color: ${theme.primary};
        box-shadow: 0 0 0 4px ${theme.active};
        background: ${theme.background};
      }
    `}
`;

export const IconWrap = styled.span<{ $phase: Phase }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  flex-shrink: 0;
  color: ${({ theme, $phase }) => {
    if ($phase === "success") return theme.statusDoneText;
    if ($phase === "error") return theme.warningText;
    return theme.primary;
  }};
  background: ${({ theme, $phase }) => {
    if ($phase === "success") return `${theme.statusDoneText}18`;
    if ($phase === "error") return `${theme.warningText}18`;
    return theme.lightPrimary;
  }};
`;

/* ── Idle ── */

export const IdleContent = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
  padding: 10px 0;
`;

export const IdleText = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  white-space: nowrap;
`;

export const HintText = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.description};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

/* ── File selected / uploading ── */

export const FileContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex: 1;
  min-width: 0;
  padding: 8px 0;
`;

export const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex: 1;
`;

export const FileName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
`;

export const FileSize = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.description};
  white-space: nowrap;
  flex-shrink: 0;
`;

export const FileActions = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
`;

export const ClearBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background: transparent;
  color: ${({ theme }) => theme.description};
  cursor: pointer;
  transition: 0.12s ease;

  &:hover {
    background: ${({ theme }) => theme.active};
    color: ${({ theme }) => theme.text};
  }
`;

export const SendBtn = styled.button`
  height: 28px;
  padding: 0 14px;
  border-radius: 8px;
  border: none;
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme["text-white"]};
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.12s ease;

  &:hover { opacity: 0.88; }
`;

export const Spinner = styled.span`
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2.5px solid ${({ theme }) => theme.border};
  border-top-color: ${({ theme }) => theme.primary};
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`;

/* ── Success / Error ── */

export const StatusContent = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
  padding: 10px 0;
`;

export const StatusText = styled.span<{ $error?: boolean }>`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme, $error }) =>
    $error ? theme.warningText : theme.statusDoneText};
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ResetBtn = styled.button`
  height: 26px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: 0.12s ease;

  &:hover { background: ${({ theme }) => theme.active}; }
`;
