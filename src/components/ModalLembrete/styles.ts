// src/pages/Perfil/components/ModalLembrete/styles.ts
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

const pulse = keyframes`
  0%   { transform: scale(1);   box-shadow: 0 0 0 0 rgba(133, 31, 44, 0.0); }
  55%  { transform: scale(1.02); box-shadow: 0 0 0 8px rgba(133, 31, 44, 0.10); }
  100% { transform: scale(1);   box-shadow: 0 0 0 0 rgba(133, 31, 44, 0.0); }
`;

export const Overlay = styled(Dialog.Overlay)`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.66);
  backdrop-filter: blur(3px);
  z-index: 9000000;
  animation: ${overlayIn} 160ms ease-out;
`;

export const Content = styled(Dialog.Content)`
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: min(680px, calc(100vw - 28px));
  max-height: min(82vh, 760px);
  overflow: auto;

  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 18px;
  box-shadow: 0 26px 70px rgba(0, 0, 0, 0.35);
  z-index: 9000001;
  animation: ${contentIn} 220ms cubic-bezier(0.16, 1, 0.3, 1);

  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.border};
    border-radius: 999px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

export const AccentBar = styled.div`
  height: 6px;
  width: 100%;
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;

  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.primary} 0%,
    ${({ theme }) => theme.primaryHover ?? theme.primary} 45%,
    ${({ theme }) => theme.primary} 100%
  );
`;

export const HeaderContent = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px 12px;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  .subtitle {
    margin-top: 4px;
    font-size: 13px;
    line-height: 1.35;
    opacity: 0.82;
    color: ${({ theme }) => theme.text};
  }

  button {
    padding: 9px;
    border: 1px solid ${({ theme }) => theme.border};
    color: ${({ theme }) => theme.text};
    background: ${({ theme }) => theme.background};
    cursor: pointer;
    border-radius: 12px;
    transition: 0.14s ease;

    &:hover {
      transform: translateY(-1px);
      background-color: ${({ theme }) => theme.BGlink ?? theme.active};
    }

    &:active {
      transform: translateY(0px);
    }
  }
`;

export const Title = styled(Dialog.Title)`
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 0.2px;
  color: ${({ theme }) => theme.text};
`;

export const Body = styled.div`
  padding: 14px 16px 16px;
`;

export const Section = styled.section`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 16px;
  padding: 14px;
  background: ${({ theme }) => theme.background};

  box-shadow: 0 0 0 4px rgba(133, 31, 44, 0.08);
  border-color: ${({ theme }) => theme.primary ?? theme.active};
`;

export const TextBlock = styled.div`
  display: grid;
  grid-template-columns: 38px 1fr;
  gap: 12px;

  .icon {
    display: grid;
    place-items: center;
    width: 38px;
    height: 38px;
    border-radius: 14px;

    color: ${({ theme }) => theme["text-white"]};
    background: ${({ theme }) => theme.warning};
    color: ${(props) => props.theme["text"]};
    border: 1px solid ${({ theme }) => theme.warningBg};
    animation: ${pulse} 2.4s ease-in-out 1;
  }

  .content {
    display: grid;
    gap: 12px;
    min-width: 0;
  }

  p {
    margin: 0;
    font-size: 13px;
    line-height: 1.55;
    color: ${({ theme }) => theme.text};
    opacity: 0.95;
  }
`;

export const CardsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const CardInfo = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 16px;
  padding: 12px;
  background: ${({ theme }) =>
    theme.bodyBg ?? theme.BGlink ?? theme.background};
`;

export const CardTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 13px;
  font-weight: 800;
  color: ${({ theme }) => theme.text};

  .i {
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;
    border-radius: 12px;
    color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.background};
    border: 1px solid ${({ theme }) => theme.border};
  }
`;

export const CardDesc = styled.div`
  margin-top: 10px;
`;

export const List = styled.ul`
  margin: 0;
  padding-left: 16px;
  display: grid;
  gap: 8px;

  li {
    font-size: 13px;
    line-height: 1.5;
    color: ${({ theme }) => theme.text};
    opacity: 0.95;
  }
`;

export const ListItem = styled.li``;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 10px;
  border-radius: 999px;

  font-size: 12px;
  font-weight: 800;

  color: ${({ theme }) => theme.primary};
  background: rgba(133, 31, 44, 0.1);
  border: 1px solid rgba(133, 31, 44, 0.22);
`;

export const Muted = styled.div`
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) =>
    theme.bodyBg ?? theme.BGlink ?? theme.background};

  font-size: 12.5px;
  line-height: 1.5;
  color: ${({ theme }) => theme.text};
  opacity: 0.9;

  strong {
    font-weight: 800;
  }
`;

export const LinkInline = styled.a`
  color: ${({ theme }) => theme.primary};
  text-decoration: none;
  font-weight: 750;
  padding: 1px 3px;
  border-radius: 6px;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 2px;
  }
`;

export const CheckRow = styled.div`
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid ${({ theme }) => theme.border};

  display: flex;
  align-items: center;
  gap: 10px;

  input {
    width: 16px;
    height: 16px;
    accent-color: ${({ theme }) => theme.primary};
    cursor: pointer;
  }

  label {
    font-size: 13px;
    color: ${({ theme }) => theme.text};
    opacity: 0.88;
    cursor: pointer;
    user-select: none;
  }
`;

export const Footer = styled.div`
  margin-top: 14px;
  display: flex;
  justify-content: flex-end;

  button {
    height: 42px;
    padding: 0 16px;
    border-radius: 14px;
    font-size: 13px;
    font-weight: 800;
    border: 1px solid transparent;
    cursor: pointer;
    transition: 0.14s ease;

    &:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }
  }

  .primary {
    background: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme["text-white"]};
    box-shadow: 0 12px 28px rgba(133, 31, 44, 0.22);

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      background: ${({ theme }) => theme.primaryHover ?? theme.primary};
      box-shadow: 0 16px 34px rgba(133, 31, 44, 0.28);
    }

    &:active:not(:disabled) {
      transform: translateY(0px);
    }

    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.primary};
      outline-offset: 2px;
    }
  }
`;
