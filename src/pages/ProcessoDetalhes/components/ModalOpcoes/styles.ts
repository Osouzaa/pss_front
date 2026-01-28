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

  width: min(980px, calc(100vw - 28px));
  max-height: min(82vh, 900px);
  overflow: hidden;

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
  gap: 12px;

  padding: 0.85rem 0.9rem;
  border-bottom: 1px solid ${(props) => props.theme["border"]};

  .subtitle {
    display: block;
    font-size: 0.8rem;
    opacity: 0.75;
    margin-top: 2px;
    color: ${(props) => props.theme["text"]};
  }

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
  font-size: 1.2rem;
  color: ${(props) => props.theme["text"]};
  font-weight: 900;
`;

/** ====== Layout 2 colunas ====== */
export const Body = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;

  max-height: calc(82vh - 70px);
  overflow: auto;

  @media (min-width: 880px) {
    grid-template-columns: 1fr 1px 1.15fr;
  }
`;

export const LeftCol = styled.div`
  padding: 1rem;
`;

export const RightCol = styled.div`
  padding: 1rem;
`;

export const Divider = styled.div`
  display: none;
  background: ${(props) => props.theme["border"]};

  @media (min-width: 880px) {
    display: block;
  }
`;

/** ====== Form ====== */
export const FormStyles = styled.form`
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

/** ====== Listagem ====== */
export const OptionsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  margin-bottom: 0.75rem;

  strong {
    color: ${(props) => props.theme.text};
    font-size: 0.95rem;
  }

  .meta {
    font-size: 0.8rem;
    opacity: 0.75;
    color: ${(props) => props.theme.text};
  }
`;

export const EmptyState = styled.div`
  border: 1px dashed ${(props) => props.theme.border};
  background: ${(props) => props.theme.bodyBg};
  border-radius: 12px;
  padding: 14px;
  color: ${(props) => props.theme.text};
  opacity: 0.8;
  font-size: 0.9rem;
`;

export const OptionsTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;

  border: 1px solid ${(props) => props.theme.border};
  border-radius: 12px;
  overflow: hidden;

  thead th {
    text-align: left;
    font-size: 0.78rem;
    letter-spacing: 0.3px;
    text-transform: uppercase;
    padding: 10px 12px;

    background: ${(props) => props.theme.bodyBg};
    color: ${(props) => props.theme.text};
    border-bottom: 1px solid ${(props) => props.theme.border};
  }

  th.small,
  td.small {
    width: 90px;
    text-align: center;
  }

  th.actions,
  td.actions {
    width: 120px;
    text-align: right;
  }

  tbody td {
    padding: 10px 12px;
    border-bottom: 1px solid ${(props) => props.theme.border};
    color: ${(props) => props.theme.text};
    font-size: 0.92rem;
    vertical-align: middle;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  .value {
    font-family:
      ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
      "Courier New", monospace;
    font-size: 0.85rem;
    opacity: 0.9;
  }

  .label .main {
    font-weight: 800;
  }
`;

export const OptionRow = styled.tr<{ "data-active"?: boolean }>`
  background: transparent;

  &[data-active="true"] td {
    background: ${(props) => props.theme.BGlink};
  }
`;

export const Badge = styled.span<{ "data-on"?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 900;

  color: ${(props) => props.theme.text};
  border: 1px solid ${(props) => props.theme.border};
  background: ${(props) => props.theme.background};

  &[data-on="true"] {
    border-color: ${(props) => props.theme.secondary};
  }
`;

export const ActionButton = styled.button`
  height: 34px;
  width: 38px;
  border-radius: 10px;
  border: 1px solid ${(props) => props.theme.border};
  background: transparent;
  color: ${(props) => props.theme.text};
  cursor: pointer;
  transition: 0.12s ease;
  margin-left: 8px;

  &:hover {
    background: ${(props) => props.theme.link};
    color: ${(props) => props.theme["text-white"]};
    border-color: ${(props) => props.theme.link};
  }

  &.danger:hover {
    background: ${(props) => props.theme.danger};
    border-color: ${(props) => props.theme.danger};
    color: ${(props) => props.theme["text-white"]};
  }
`;
