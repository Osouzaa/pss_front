import styled, { keyframes } from "styled-components";
import * as Dialog from "@radix-ui/react-dialog";

const overlayIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const contentIn = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -50%) translateY(10px) scale(0.985);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) translateY(0) scale(1);
  }
`;

export const Overlay = styled(Dialog.Overlay)`
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.7);
  backdrop-filter: blur(2px);
  z-index: 9000000;
  animation: ${overlayIn} 160ms ease-out;
`;

export const Content = styled(Dialog.Content)`
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: min(780px, calc(100vw - 28px));
  max-height: min(80vh, 860px);
  overflow: hidden;

  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 14px;
  box-shadow: 0 22px 56px rgba(0, 0, 0, 0.28);
  z-index: 9000001;
  animation: ${contentIn} 220ms cubic-bezier(0.16, 1, 0.3, 1);
  overflow: auto;
`;

export const HeaderContent = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  border-bottom: 1px solid ${(props) => props.theme["border"]};

  button {
    padding: 0.625rem;
    border: 1px solid ${(props) => props.theme["border"]};
    color: ${(props) => props.theme["text"]};
    background: transparent;
    font-size: 0.75rem;
    cursor: pointer;
    border-radius: 14px;

    &:hover {
      background-color: ${(props) => props.theme["link"]};
      color: ${(props) => props.theme["text-white"]};
      transition: 0.5s all;
    }
  }
`;

export const Title = styled(Dialog.Title)`
  font-size: 1.25rem;
  color: ${(props) => props.theme["text"]};
`;

export const FormStyles = styled.form`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  @media (min-width: 560px) {
    grid-template-columns: 1fr 1fr;
  }

  &.row-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
`;

export const Footer = styled.div`
  margin-top: 6px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;

  button {
    height: 42px;
    padding: 0 14px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 800;
    border: 1px solid transparent;
    cursor: pointer;
    transition: 0.12s ease;

    &:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }
  }

  .secondary {
    background: ${(props) => props.theme.lightPrimary};
    color: ${(props) => props.theme.primary};
    border-color: ${(props) => props.theme.active};

    &:hover:not(:disabled) {
      background: ${(props) => props.theme.active};
    }
  }

  .primary {
    background: ${(props) => props.theme.primary};
    color: ${(props) => props.theme["text-white"]};

    &:hover:not(:disabled) {
      background: ${(props) => props.theme.primaryHover};
    }
  }
`;
