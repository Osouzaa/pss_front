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
  background: rgba(17, 24, 39, 0.72);
  backdrop-filter: blur(2px);
  z-index: 9000000;
  animation: ${overlayIn} 160ms ease-out;
`;

export const Content = styled(Dialog.Content)`
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: min(760px, calc(100vw - 28px));
  max-height: min(85vh, 860px);
  overflow: auto;

  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 16px;
  box-shadow: 0 22px 56px rgba(0, 0, 0, 0.28);
  z-index: 9000001;
  animation: ${contentIn} 220ms cubic-bezier(0.16, 1, 0.3, 1);
`;

export const HeaderContent = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  .subtitle {
    margin-top: 4px;
    font-size: 13px;
    opacity: 0.8;
    color: ${({ theme }) => theme.text};
  }

  button {
    padding: 10px;
    border: 1px solid ${({ theme }) => theme.border};
    color: ${({ theme }) => theme.text};
    background: transparent;
    cursor: pointer;
    border-radius: 12px;
    transition: 0.15s ease;

    &:hover {
      background-color: ${({ theme }) => theme.BGlink ?? theme.active};
      color: ${({ theme }) => theme.text};
    }
  }
`;

export const Title = styled(Dialog.Title)`
  font-size: 18px;
  font-weight: 800;
  color: ${({ theme }) => theme.text};
`;

export const Body = styled.div`
  padding: 14px 16px 16px;
`;

export const FormStyles = styled.form`
  display: grid;
  gap: 14px;
`;

export const Section = styled.section`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 16px;
  padding: 14px;
  background: ${({ theme }) => theme.background};
`;

export const SectionTitle = styled.div`
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.2px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
  opacity: 0.9;
`;

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  @media (min-width: 680px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  @media (min-width: 560px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const UploadZone = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;

  border: 1px dashed ${({ theme }) => theme.border};
  border-radius: 16px;
  padding: 14px;
  background: ${({ theme }) => theme.bodyBg ?? "#f5f5f5"};
  cursor: pointer;
  transition: 0.15s ease;

  .icon {
    width: 40px;
    height: 40px;
    border-radius: 14px;
    display: grid;
    place-items: center;
    background: ${({ theme }) => theme.BGlink ?? theme.active};
    border: 1px solid ${({ theme }) => theme.border};
  }

  .text {
    text-align: left;
    display: grid;
    gap: 2px;
    flex: 1;
  }

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const UploadName = styled.div`
  font-size: 14px;
  font-weight: 900;
  color: ${({ theme }) => theme.text};
`;

export const UploadHint = styled.div`
  font-size: 12px;
  opacity: 0.8;
  color: ${({ theme }) => theme.text};
`;

export const UploadMeta = styled.div`
  margin-top: 10px;
  font-size: 13px;
  opacity: 0.9;
  display: grid;
  gap: 4px;
  color: ${({ theme }) => theme.text};
`;

export const Chip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  font-size: 12px;
  font-weight: 800;
`;

export const Footer = styled.div`
  margin-top: 2px;
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
    background: ${({ theme }) => theme.lightPrimary ?? theme.BGlink ?? "#e0e0ff"};
    color: ${({ theme }) => theme.primary};
    border-color: ${({ theme }) => theme.active ?? theme.border};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.active ?? "#e0e0ff"};
    }
  }

  .primary {
    background: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme["text-white"]};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.primaryHover ?? theme.primary};
    }
  }
`;
