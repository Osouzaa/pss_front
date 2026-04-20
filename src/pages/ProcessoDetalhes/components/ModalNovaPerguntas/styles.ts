import styled, { keyframes } from "styled-components";
import * as Dialog from "@radix-ui/react-dialog";

const overlayIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const contentIn = keyframes`
  from { opacity: 0; transform: translate(-50%, -50%) translateY(10px) scale(0.985); }
  to   { opacity: 1; transform: translate(-50%, -50%) translateY(0) scale(1); }
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
  width: min(780px, calc(100vw - 28px));
  max-height: min(88vh, 900px);
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
  padding: 14px 18px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  position: sticky;
  top: 0;
  background: ${({ theme }) => theme.background};
  z-index: 2;

  button {
    padding: 10px;
    border: 1px solid ${({ theme }) => theme.border};
    color: ${({ theme }) => theme.text};
    background: transparent;
    cursor: pointer;
    border-radius: 12px;
    transition: 0.15s ease;
    flex-shrink: 0;
    &:hover { background-color: ${({ theme }) => theme.active}; }
  }
`;

export const Title = styled(Dialog.Title)`
  font-size: 18px;
  font-weight: 800;
  color: ${({ theme }) => theme.text};
`;

export const Subtitle = styled.p`
  margin: 3px 0 0;
  font-size: 13px;
  opacity: 0.65;
  color: ${({ theme }) => theme.text};
`;

export const FormStyles = styled.form`
  padding: 16px 18px 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  @media (min-width: 540px) {
    grid-template-columns: 1fr 1fr;
  }

  &.row-3 {
    @media (min-width: 540px) {
      grid-template-columns: 1fr 1fr 1fr;
    }
  }
`;

/* ── Seção ──────────────────────────────────────────────────────────────── */

export const Section = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 14px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SectionTitle = styled.div`
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.description};
`;

/* ── Cards de tipo ──────────────────────────────────────────────────────── */

export const TypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 8px;
`;

export const TypeCard = styled.button<{ $active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1.5px solid ${({ theme, $active }) => $active ? theme.primary : theme.border};
  background: ${({ theme, $active }) => $active ? theme.lightPrimary : theme.backgroundInput ?? theme.background};
  cursor: pointer;
  text-align: left;
  transition: border-color 0.12s, background 0.12s;

  &:hover:not([disabled]) {
    border-color: ${({ theme }) => theme.primary};
  }
`;

export const TypeCardName = styled.div<{ $active?: boolean }>`
  font-size: 13px;
  font-weight: 800;
  color: ${({ theme, $active }) => $active ? theme.primary : theme.text};
`;

export const TypeCardDesc = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.description};
  line-height: 1.4;
`;

/* ── Info banner ────────────────────────────────────────────────────────── */

export const InfoNote = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 12px;
  background: ${({ theme }) => theme.lightPrimary};
  border: 1px solid ${({ theme }) => theme.active};
  border-radius: 10px;
  color: ${({ theme }) => theme.primary};
  font-size: 12px;
  line-height: 1.5;

  svg { flex-shrink: 0; margin-top: 1px; }
  strong { font-weight: 800; }
`;

/* ── Tabela de faixas ───────────────────────────────────────────────────── */

export const FaixasTable = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  overflow: hidden;
`;

export const FaixasHeader = styled.div`
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr;
  padding: 8px 14px;
  background: ${({ theme }) => theme.backgroundInput ?? theme.active};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  font-size: 11px;
  font-weight: 800;
  color: ${({ theme }) => theme.description};
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

export const FaixaRow = styled.div<{ $muted?: boolean }>`
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr;
  align-items: center;
  gap: 0;
  padding: 10px 14px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme, $muted }) => $muted ? theme.backgroundInput ?? theme.active : "transparent"};

  &:last-child { border-bottom: none; }
`;

export const FaixaLabel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const FaixaLabelMain = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`;

export const FaixaLabelSub = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.description};
`;

export const FaixaInput = styled.input`
  width: calc(100% - 12px);
  height: 34px;
  border-radius: 8px;
  border: 1.5px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  padding: 0 10px;
  font-size: 13px;
  outline: none;
  transition: border-color 0.12s, box-shadow 0.12s;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.active};
  }

  &::placeholder { color: ${({ theme }) => theme.description}; opacity: 0.7; }
`;

export const ZeroBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  width: 54px;
  border-radius: 8px;
  background: ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.description};
  font-size: 12px;
  font-weight: 700;
`;

/* ── Footer ─────────────────────────────────────────────────────────────── */

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 4px;

  button {
    height: 42px;
    padding: 0 18px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 900;
    border: 1px solid transparent;
    cursor: pointer;
    transition: 0.12s ease;

    &:disabled { opacity: 0.55; cursor: not-allowed; }
  }

  .secondary {
    background: ${({ theme }) => theme.lightPrimary};
    color: ${({ theme }) => theme.primary};
    border-color: ${({ theme }) => theme.active};
    &:hover:not(:disabled) { background: ${({ theme }) => theme.active}; }
  }

  .primary {
    background: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme["text-white"]};
    &:hover:not(:disabled) { background: ${({ theme }) => theme.primaryHover ?? theme.primary}; }
  }
`;
