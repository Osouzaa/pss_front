import styled, { keyframes } from "styled-components";
import * as Dialog from "@radix-ui/react-dialog";

const overlayIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const contentIn = keyframes`
  from { opacity: 0; transform: translate(-50%, -50%) translateY(10px) scale(0.985); }
  to   { opacity: 1; transform: translate(-50%, -50%) translateY(0) scale(1); }
`;
const popIn = keyframes`
  from { opacity: 0; transform: scale(0.96); }
  to   { opacity: 1; transform: scale(1); }
`;
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
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
  width: min(640px, calc(100vw - 28px));
  max-height: min(90vh, 760px);
  overflow: auto;
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 14px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.28);
  z-index: 9000001;
  animation: ${contentIn} 220ms cubic-bezier(0.16, 1, 0.3, 1);
`;

export const HeaderContent = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  padding: 18px 20px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  position: sticky;
  top: 0;
  background: ${({ theme }) => theme.background};
  z-index: 1;

  .subtitle {
    margin-top: 6px;
    font-size: 13px;
    line-height: 1.45;
    color: ${({ theme }) => theme.description};
  }

  > button {
    width: 38px;
    height: 38px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid ${({ theme }) => theme.border};
    color: ${({ theme }) => theme.text};
    background: ${({ theme }) => theme.backgroundInput ?? theme.background};
    cursor: pointer;
    border-radius: 10px;
    transition: 0.15s ease;
    flex-shrink: 0;

    &:hover {
      background-color: ${({ theme }) => theme.active};
    }
  }
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const TitleIcon = styled.span`
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  color: ${({ theme }) => theme.primary};
  background: ${({ theme }) => theme.lightPrimary};
  border: 1px solid ${({ theme }) => theme.active};
`;

export const Title = styled(Dialog.Title)`
  font-size: 18px;
  font-weight: 800;
  color: ${({ theme }) => theme.text};
`;

export const Body = styled.div`
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const Section = styled.section`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  padding: 16px;
  background: ${({ theme }) => theme.background};
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const SectionTitle = styled.div`
  font-size: 12px;
  font-weight: 900;
  color: ${({ theme }) => theme.text};
`;

export const SectionDesc = styled.div`
  font-size: 12px;
  line-height: 1.45;
  color: ${({ theme }) => theme.description};
`;

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  @media (min-width: 560px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const UploadNote = styled.div`
  color: ${({ theme }) => theme.text};
`;

export const FormatList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const FormatPill = styled.span`
  min-height: 28px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 999px;
  background: ${({ theme }) => theme.backgroundInput ?? theme.background};
  color: ${({ theme }) => theme.description};
  font-size: 12px;
  font-weight: 800;

  svg {
    color: ${({ theme }) => theme.primary};
  }
`;

export const UploadZone = styled.div<{ $hasFile?: boolean; $isDragging?: boolean; $disabled?: boolean }>`
  width: 100%;
  min-height: 104px;
  display: flex;
  align-items: center;
  gap: 14px;
  border: 1.5px dashed
    ${({ theme, $hasFile, $isDragging }) =>
      $hasFile || $isDragging ? theme.secondary : theme.border};
  border-radius: 12px;
  padding: 16px;
  background: ${({ theme, $hasFile, $isDragging }) =>
    $hasFile || $isDragging ? `${theme.secondary}0f` : theme.backgroundInput ?? theme.background};
  cursor: pointer;
  transition: 0.15s ease;
  text-align: left;

  .icon {
    width: 46px;
    height: 46px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    flex-shrink: 0;
    background: ${({ theme, $hasFile }) => ($hasFile ? `${theme.secondary}22` : theme.active)};
    color: ${({ theme, $hasFile }) => ($hasFile ? theme.secondary : theme.primary)};
  }

  .text {
    flex: 1;
    min-width: 0;
  }

  &:hover:not([aria-disabled="true"]) {
    border-color: ${({ theme }) => theme.primary};
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => `${theme.primary}33`};
    outline-offset: 2px;
  }

  &[aria-disabled="true"] {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

export const UploadName = styled.div`
  font-size: 14px;
  font-weight: 800;
  color: ${({ theme }) => theme.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const UploadHint = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.description};
  margin-top: 3px;
`;

export const RemoveFileButton = styled.button`
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  border: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.description};
  background: ${({ theme }) => theme.background};
  cursor: pointer;
  transition: 0.15s ease;
  flex-shrink: 0;

  &:hover {
    color: ${({ theme }) => theme.danger ?? "#dc2626"};
    border-color: ${({ theme }) => theme.danger ?? "#dc2626"};
  }
`;

export const SuccessBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 34px 24px;
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
  max-width: 320px;
`;

export const SuccessFileName = styled.div`
  font-size: 13px;
  font-weight: 800;
  color: ${({ theme }) => theme.text};
  padding: 9px 14px;
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
  max-width: 360px;

  button {
    flex: 1;
    height: 42px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border-radius: 10px;
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

    &:hover {
      background: ${({ theme }) => theme.active};
    }
  }

  .primary {
    background: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme["text-white"]};

    &:hover {
      background: ${({ theme }) => theme.primaryHover ?? theme.primary};
    }
  }

  @media (max-width: 420px) {
    flex-direction: column-reverse;
  }
`;

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 20px;
  border-top: 1px solid ${({ theme }) => theme.border};
  position: sticky;
  bottom: 0;
  background: ${({ theme }) => theme.background};

  button {
    height: 42px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 0 18px;
    border-radius: 10px;
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
    min-width: 158px;
    background: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme["text-white"]};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.primaryHover ?? theme.primary};
    }
  }

  .spin {
    animation: ${spin} 0.8s linear infinite;
  }

  @media (max-width: 420px) {
    flex-direction: column-reverse;

    button {
      width: 100%;
    }
  }
`;
