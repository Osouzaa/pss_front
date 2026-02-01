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

  width: min(520px, calc(100vw - 28px));
  max-height: min(80vh, 520px);
  overflow: auto;

  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 14px;
  box-shadow: 0 22px 56px rgba(0, 0, 0, 0.28);
  z-index: 9000001;
  animation: ${contentIn} 220ms cubic-bezier(0.16, 1, 0.3, 1);
`;

export const HeaderContent = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0.85rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  button {
    padding: 0.625rem;
    border: 1px solid ${({ theme }) => theme.border};
    color: ${({ theme }) => theme.text};
    background: transparent;
    font-size: 0.75rem;
    cursor: pointer;
    border-radius: 14px;
    transition: 0.15s ease;

    &:hover {
      background-color: ${({ theme }) => theme.link};
      color: ${({ theme }) => theme["text-white"]};
    }
  }
`;

export const Title = styled(Dialog.Title)`
  font-size: 1.1rem;
  font-weight: 900;
  color: ${({ theme }) => theme.text};
`;

export const Body = styled.div`
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: 12px;
  padding: 1rem;

  p {
    margin: 0.45rem 0;
    color: ${({ theme }) => theme.description};
    font-size: 0.95rem;
    line-height: 1.35rem;
  }

  b {
    color: ${({ theme }) => theme.text};
  }

  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`;

export const IconWrap = styled.div`
  height: 44px;
  width: 44px;
  border-radius: 14px;
  display: grid;
  place-items: center;

  background: ${({ theme }) => theme.lightSuccess};
  color: ${({ theme }) => theme.secondary};
`;

export const Subtitle = styled.div`
  font-size: 1rem;
  font-weight: 800;
  color: ${({ theme }) => theme.text};
`;

export const EmailBox = styled.div`
  margin-top: 0.35rem;
  width: 100%;
  padding: 0.7rem 0.8rem;

  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bodyBg};

  color: ${({ theme }) => theme.text};
  font-weight: 800;
  font-size: 0.95rem;

  word-break: break-word;
`;

export const Footer = styled.div`
  padding: 0.85rem;
  border-top: 1px solid ${({ theme }) => theme.border};

  display: flex;
  justify-content: flex-end;
  gap: 10px;

  button {
    height: 42px;
    padding: 0 14px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 900;
    border: 1px solid transparent;
    cursor: pointer;
    transition: 0.12s ease;

    &:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }
  }

  .secondary {
    background: ${({ theme }) => theme.lightPrimary};
    color: ${({ theme }) => theme.primary};
    border-color: ${({ theme }) => theme.active};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.active};
    }
  }

  .primary {
    background: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme["text-white"]};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.primaryHover};
    }
  }

  @media (max-width: 420px) {
    flex-direction: column;

    button {
      width: 100%;
    }
  }
`;
