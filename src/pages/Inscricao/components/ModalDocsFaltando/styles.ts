import styled, { keyframes } from "styled-components";
import * as Dialog from "@radix-ui/react-dialog";

const overlayIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const contentIn = keyframes`
  from { opacity: 0; transform: translate(-50%, -50%) translateY(12px) scale(0.97); }
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
  width: min(520px, calc(100vw - 28px));
  max-height: min(88vh, 700px);
  overflow: auto;
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 18px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.3);
  z-index: 9000001;
  animation: ${contentIn} 220ms cubic-bezier(0.16, 1, 0.3, 1);
`;

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 20px 14px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

export const IconWrap = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  background: ${({ theme }) => `${theme.danger}18`};
  border: 1px solid ${({ theme }) => `${theme.danger}30`};
  color: ${({ theme }) => theme.danger};
`;

export const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const Title = styled(Dialog.Title)`
  margin: 0;
  font-size: 17px;
  font-weight: 800;
  color: ${({ theme }) => theme.text};
`;

export const Subtitle = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${({ theme }) => theme.description};
  line-height: 1.4;
`;

export const CloseBtn = styled.button`
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text};
  background: transparent;
  cursor: pointer;
  border-radius: 10px;
  transition: background 0.15s;
  flex-shrink: 0;

  &:hover { background: ${({ theme }) => theme.active}; }
`;

export const Body = styled.div`
  padding: 16px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const InfoBanner = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  background: ${({ theme }) => theme.lightPrimary};
  border: 1px solid ${({ theme }) => theme.active};
  border-radius: 12px;
  color: ${({ theme }) => theme.primary};
  font-size: 13px;
  line-height: 1.5;

  svg { flex-shrink: 0; margin-top: 1px; }
  strong { font-weight: 800; }
`;

export const DocList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const DocCard = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 14px;
  overflow: hidden;
`;

export const DocCardTop = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: ${({ theme }) => theme.backgroundInput ?? theme.background};
`;

export const DocIconWrap = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  background: ${({ theme }) => `${theme.danger}14`};
  color: ${({ theme }) => theme.danger};
`;

export const DocInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const DocName = styled.div`
  font-size: 14px;
  font-weight: 800;
  color: ${({ theme }) => theme.text};
`;

export const DocContext = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.description};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const DocCardBottom = styled.div`
  padding: 10px 14px;
  border-top: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
`;

export const AddBtn = styled.button`
  width: 100%;
  height: 36px;
  border-radius: 8px;
  border: 1.5px solid ${({ theme }) => theme.primary};
  background: ${({ theme }) => theme.lightPrimary};
  color: ${({ theme }) => theme.primary};
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: background 0.12s, transform 0.1s;

  &:hover { background: ${({ theme }) => theme.active}; transform: translateY(-1px); }
  &:active { transform: translateY(0); }
`;

export const Footer = styled.div`
  padding: 14px 20px;
  border-top: 1px solid ${({ theme }) => theme.border};
  display: flex;
  justify-content: flex-end;
`;

export const DismissBtn = styled.button`
  height: 40px;
  padding: 0 20px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.12s;

  &:hover { background: ${({ theme }) => theme.active}; }
`;
