import styled, { keyframes } from "styled-components";
import * as Dialog from "@radix-ui/react-dialog";

const overlayIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const contentIn = keyframes`
  from { opacity: 0; transform: translate(-50%, -50%) translateY(10px) scale(0.985); }
  to   { opacity: 1; transform: translate(-50%, -50%) translateY(0) scale(1); }
`;
const popIn = keyframes`
  from { opacity: 0; transform: scale(0.92); }
  to   { opacity: 1; transform: scale(1); }
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
  width: min(520px, calc(100vw - 28px));
  max-height: min(88vh, 720px);
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
  position: sticky;
  top: 0;
  background: ${({ theme }) => theme.background};
  z-index: 1;

  .subtitle {
    margin-top: 3px;
    font-size: 13px;
    opacity: 0.65;
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
    flex-shrink: 0;
    &:hover { background-color: ${({ theme }) => theme.active}; }
  }
`;

export const Title = styled(Dialog.Title)`
  font-size: 18px;
  font-weight: 800;
  color: ${({ theme }) => theme.text};
`;

export const Body = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Section = styled.section`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 14px;
  padding: 14px;
  background: ${({ theme }) => theme.background};
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

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  @media (min-width: 480px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const UploadNote = styled.div`
  font-size: 12px;
  opacity: 0.8;
  color: ${({ theme }) => theme.text};
  strong { font-weight: 900; }
`;

export const UploadZone = styled.button<{ $hasFile?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1.5px dashed ${({ theme, $hasFile }) => $hasFile ? theme.secondary : theme.border};
  border-radius: 12px;
  padding: 14px;
  background: ${({ theme, $hasFile }) =>
    $hasFile ? `${theme.secondary}0d` : theme.backgroundInput ?? theme.background};
  cursor: pointer;
  transition: 0.15s ease;
  text-align: left;

  .icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: grid;
    place-items: center;
    flex-shrink: 0;
    background: ${({ theme, $hasFile }) => $hasFile ? `${theme.secondary}22` : theme.active};
    color: ${({ theme, $hasFile }) => $hasFile ? theme.secondary : theme.primary};
  }

  .text { flex: 1; min-width: 0; }

  &:hover:not(:disabled) { transform: translateY(-1px); }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

export const UploadName = styled.div`
  font-size: 13px;
  font-weight: 800;
  color: ${({ theme }) => theme.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const UploadHint = styled.div`
  font-size: 11px;
  opacity: 0.7;
  color: ${({ theme }) => theme.text};
  margin-top: 2px;
`;

/* ── Estado de sucesso ──────────────────────────────────────────────────── */

export const SuccessBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px 24px;
  text-align: center;
  animation: ${popIn} 280ms cubic-bezier(0.16, 1, 0.3, 1);
`;

export const SuccessCircle = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: ${({ theme }) => `${theme.secondary}1a`};
  border: 2px solid ${({ theme }) => `${theme.secondary}40`};
  color: ${({ theme }) => theme.secondary};
`;

export const SuccessTitle = styled.div`
  font-size: 18px;
  font-weight: 800;
  color: ${({ theme }) => theme.text};
`;

export const SuccessDesc = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.description};
  line-height: 1.5;
  max-width: 300px;
`;

export const SuccessFileName = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  padding: 8px 14px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.backgroundInput ?? theme.background};
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const SuccessActions = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  max-width: 340px;

  button {
    flex: 1;
    height: 42px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 800;
    cursor: pointer;
    border: 1px solid transparent;
    transition: 0.12s ease;
  }

  .secondary {
    background: ${({ theme }) => theme.lightPrimary};
    color: ${({ theme }) => theme.primary};
    border-color: ${({ theme }) => theme.active};
    &:hover { background: ${({ theme }) => theme.active}; }
  }

  .primary {
    background: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme["text-white"]};
    &:hover { background: ${({ theme }) => theme.primaryHover ?? theme.primary}; }
  }
`;

/* ── Footer do formulário ───────────────────────────────────────────────── */

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 12px 16px;
  border-top: 1px solid ${({ theme }) => theme.border};
  position: sticky;
  bottom: 0;
  background: ${({ theme }) => theme.background};

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
