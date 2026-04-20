import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; }`;

const ui = {
  radius: { sm: "10px", md: "14px", lg: "18px", pill: "999px" },
  h: { btn: "40px", input: "42px" },
};

/* ── page shell ─────────────────────────────────────────────────────────── */

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: ${fadeIn} 220ms ease;
`;

export const PageHeader = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

export const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 22px;
  font-weight: 900;
  color: ${({ theme }) => theme.text};
`;

export const Subtitle = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${({ theme }) => theme.description};
`;

export const CountBadge = styled.span`
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 12px;
  border-radius: ${ui.radius.pill};
  background: ${({ theme }) => theme.lightPrimary};
  color: ${({ theme }) => theme.primary};
  font-size: 12px;
  font-weight: 800;
`;

/* ── two-column body ─────────────────────────────────────────────────────── */

export const Body = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  align-items: start;

  @media (min-width: 860px) {
    grid-template-columns: 360px 1fr;
  }
`;

/* ── card ────────────────────────────────────────────────────────────────── */

export const Card = styled.div`
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${ui.radius.lg};
  overflow: hidden;
`;

export const CardHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const CardTitle = styled.h2`
  margin: 0;
  font-size: 14px;
  font-weight: 800;
  color: ${({ theme }) => theme.text};
`;

export const CardBody = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

/* ── form ────────────────────────────────────────────────────────────────── */

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.label`
  font-size: 12px;
  font-weight: 800;
  color: ${({ theme }) => theme.text};
`;

export const InputWrap = styled.div`
  position: relative;
`;

export const Input = styled.input<{ $error?: boolean }>`
  height: ${ui.h.input};
  width: 100%;
  border-radius: ${ui.radius.md};
  border: 1.5px solid ${({ theme, $error }) => ($error ? theme.danger : theme.border)};
  background: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.text};
  padding: 0 44px 0 42px;
  font-size: 13px;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.14s, box-shadow 0.14s;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.active};
  }
  &::placeholder { color: ${({ theme }) => theme.description}; opacity: 0.8; }
`;

export const Select = styled.select<{ $error?: boolean }>`
  height: ${ui.h.input};
  width: 100%;
  border-radius: ${ui.radius.md};
  border: 1.5px solid ${({ theme, $error }) => ($error ? theme.danger : theme.border)};
  background: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.text};
  padding: 0 14px;
  font-size: 13px;
  outline: none;
  cursor: pointer;
  box-sizing: border-box;
  transition: border-color 0.14s, box-shadow 0.14s;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.active};
  }
`;

export const InputIcon = styled.div`
  position: absolute;
  left: 13px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.description};
  display: grid;
  place-items: center;
  pointer-events: none;
  svg { font-size: 16px; }
`;

export const IconButton = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  border-radius: ${ui.radius.pill};
  display: grid;
  place-items: center;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.description};
  cursor: pointer;
  &:hover { color: ${({ theme }) => theme.primary}; }
`;

export const ErrorText = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.danger};
`;

export const Rules = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 4px;
`;

export const Rule = styled.div<{ $ok: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme, $ok }) => ($ok ? theme.secondary : theme.description)};
  transition: color 0.12s;
  svg { font-size: 12px; }
`;

export const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.border};
`;

export const FormFooter = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const PrimaryButton = styled.button`
  height: ${ui.h.btn};
  padding: 0 22px;
  border-radius: ${ui.radius.md};
  border: none;
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme["text-white"]};
  font-weight: 800;
  font-size: 13px;
  cursor: pointer;
  width: 100%;
  transition: background 0.14s, transform 0.1s;

  &:hover:not(:disabled) { background: ${({ theme }) => theme.primaryHover}; transform: translateY(-1px); }
  &:active { transform: translateY(0); }
  &:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
`;

/* ── success banner ─────────────────────────────────────────────────────── */

export const SuccessBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: ${ui.radius.md};
  border: 1px solid ${({ theme }) => theme.secondary};
  background: ${({ theme }) => `${theme.secondary}14`};
  animation: ${fadeIn} 180ms ease;
`;

export const SuccessIcon = styled.div`
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border-radius: ${ui.radius.pill};
  background: ${({ theme }) => theme.secondary};
  display: grid;
  place-items: center;
  color: white;
  svg { font-size: 16px; }
`;

export const SuccessText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
`;

export const SuccessTitle = styled.div`
  font-weight: 800;
  font-size: 13px;
  color: ${({ theme }) => theme.text};
`;

export const SuccessSub = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.description};
`;

/* ── admin list ─────────────────────────────────────────────────────────── */

export const AdminTable = styled.div`
  display: flex;
  flex-direction: column;
`;

export const AdminRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  transition: background 0.12s;

  &:last-child { border-bottom: none; }
  &:hover { background: ${({ theme }) => theme.active}; }
`;

export const Avatar = styled.div`
  width: 38px;
  height: 38px;
  border-radius: ${ui.radius.pill};
  background: ${({ theme }) => theme.lightPrimary};
  color: ${({ theme }) => theme.primary};
  display: grid;
  place-items: center;
  font-weight: 900;
  font-size: 15px;
  flex-shrink: 0;
`;

export const AdminInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
`;

export const AdminName = styled.div`
  font-size: 13px;
  font-weight: 800;
  color: ${({ theme }) => theme.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const AdminEmail = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.description};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const SecretariaPill = styled.span`
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: ${ui.radius.pill};
  background: ${({ theme }) => theme.lightPrimary};
  color: ${({ theme }) => theme.primary};
  white-space: nowrap;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 40px 20px;
  color: ${({ theme }) => theme.description};
  font-size: 13px;
`;

export const LoadingState = styled.div`
  padding: 32px 20px;
  text-align: center;
  font-size: 13px;
  color: ${({ theme }) => theme.description};
`;
