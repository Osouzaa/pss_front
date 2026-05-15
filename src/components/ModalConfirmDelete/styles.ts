import styled, { keyframes } from "styled-components";
import * as Dialog from "@radix-ui/react-dialog";

const overlayShow = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const contentShow = keyframes`
  from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const DialogOverlay = styled(Dialog.Overlay)`
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.68);
  backdrop-filter: blur(2px);
  animation: ${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 90000000;
`;

export const DialogContent = styled(Dialog.Content)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(440px, calc(100vw - 28px));
  padding: 22px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.28);
  animation: ${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 999999999;

  &:focus {
    outline: none;
  }
`;

export const DialogHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding-right: 34px;
`;

export const DialogIcon = styled.div`
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border-radius: 12px;
  color: ${({ theme }) => theme.danger ?? "#dc2626"};
  background: ${({ theme }) => `${theme.danger ?? "#dc2626"}14`};
  border: 1px solid ${({ theme }) => `${theme.danger ?? "#dc2626"}33`};
`;

export const DialogTitle = styled(Dialog.Title)`
  margin: 0;
  font-weight: 800;
  color: ${({ theme }) => theme.text};
  font-size: 18px;
`;

export const DialogDescription = styled(Dialog.Description)`
  margin: 8px 0 0;
  color: ${({ theme }) => theme.description};
  font-size: 14px;
  line-height: 1.55;

  strong {
    color: ${({ theme }) => theme.text};
    font-weight: 900;
  }
`;

export const IconButton = styled(Dialog.Close)`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.description};
  background: ${({ theme }) => theme.backgroundInput ?? theme.background};
  cursor: pointer;
  transition: 0.15s ease;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.active};
    color: ${({ theme }) => theme.text};
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;

  @media (max-width: 420px) {
    flex-direction: column-reverse;
  }
`;

export const Button = styled.button<{ variant?: "primary" | "secondary" | "danger" }>`
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0.65rem 1.15rem;
  border: 1px solid transparent;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
  transition: 0.15s ease;

  background-color: ${({ theme, variant = "primary" }) => {
    if (variant === "danger") return theme.danger ?? "#dc2626";
    if (variant === "secondary") return theme.lightPrimary;
    return theme.primary;
  }};

  color: ${({ theme, variant = "primary" }) =>
    variant === "secondary" ? theme.primary : theme["text-white"]};

  border-color: ${({ theme, variant = "primary" }) =>
    variant === "secondary" ? theme.active : "transparent"};

  &:hover:not(:disabled) {
    filter: brightness(1.04);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .spin {
    animation: ${spin} 0.8s linear infinite;
  }

  @media (max-width: 420px) {
    width: 100%;
  }
`;
