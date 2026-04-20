import styled, { keyframes, css } from "styled-components";

const fadeIn = keyframes`from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; }`;
const shimmer = keyframes`0%,100%{opacity:1}50%{opacity:.4}`;

const ui = {
  radius: { sm: "8px", md: "12px", lg: "16px", pill: "999px" },
  h: { btn: "38px", input: "40px" },
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
  gap: 5px;
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
    grid-template-columns: 320px 1fr;
  }
`;

/* ── card ────────────────────────────────────────────────────────────────── */

export const Card = styled.div`
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${ui.radius.lg};
  overflow: hidden;
`;

export const CardHeader = styled.div<{ $editing?: boolean }>`
  padding: 14px 18px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  background: ${({ theme, $editing }) =>
    $editing ? `${theme.primary}0d` : "transparent"};
  transition: background 0.2s;
`;

export const CardTitle = styled.h2`
  margin: 0;
  font-size: 14px;
  font-weight: 800;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
`;

export const CardBody = styled.div`
  padding: 18px;
`;

export const CancelEditBtn = styled.button`
  height: 26px;
  padding: 0 10px;
  border-radius: ${ui.radius.pill};
  border: 1px solid ${({ theme }) => theme.border};
  background: transparent;
  color: ${({ theme }) => theme.description};
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.12s;

  &:hover {
    border-color: ${({ theme }) => theme.danger};
    color: ${({ theme }) => theme.danger};
  }
`;

/* ── form ────────────────────────────────────────────────────────────────── */

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const Label = styled.label`
  font-size: 12px;
  font-weight: 800;
  color: ${({ theme }) => theme.text};
`;

export const Input = styled.input<{ $error?: boolean; $editing?: boolean }>`
  height: ${ui.h.input};
  width: 100%;
  border-radius: ${ui.radius.md};
  border: 1.5px solid ${({ theme, $error, $editing }) =>
    $error ? theme.danger : $editing ? theme.primary : theme.border};
  background: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.text};
  padding: 0 12px;
  font-size: 13px;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.14s, box-shadow 0.14s;

  ${({ theme, $editing }) =>
    $editing &&
    css`
      box-shadow: 0 0 0 3px ${theme.active};
    `}

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.active};
  }
  &::placeholder { color: ${({ theme }) => theme.description}; opacity: 0.8; }
`;

export const Textarea = styled.textarea`
  width: 100%;
  border-radius: ${ui.radius.md};
  border: 1.5px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.text};
  padding: 9px 12px;
  font-size: 13px;
  outline: none;
  resize: vertical;
  min-height: 72px;
  box-sizing: border-box;
  font-family: inherit;
  line-height: 1.5;
  transition: border-color 0.14s, box-shadow 0.14s;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.active};
  }
  &::placeholder { color: ${({ theme }) => theme.description}; opacity: 0.8; }
`;

export const ErrorText = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.danger};
`;

export const PrimaryButton = styled.button<{ $editing?: boolean }>`
  height: ${ui.h.btn};
  width: 100%;
  border-radius: ${ui.radius.md};
  border: none;
  background: ${({ theme, $editing }) => $editing ? theme.primaryHover : theme.primary};
  color: ${({ theme }) => theme["text-white"]};
  font-weight: 800;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.14s, transform 0.1s;
  margin-top: 4px;

  &:hover:not(:disabled) { background: ${({ theme }) => theme.primaryHover}; transform: translateY(-1px); }
  &:active { transform: translateY(0); }
  &:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
`;

/* ── filter tabs ─────────────────────────────────────────────────────────── */

export const FilterRow = styled.div`
  display: flex;
  gap: 6px;
  padding: 10px 18px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

export const FilterTab = styled.button<{ $active: boolean }>`
  height: 28px;
  padding: 0 12px;
  border-radius: ${ui.radius.pill};
  border: 1.5px solid ${({ theme, $active }) => ($active ? theme.primary : theme.border)};
  background: ${({ theme, $active }) => ($active ? theme.lightPrimary : "transparent")};
  color: ${({ theme, $active }) => ($active ? theme.primary : theme.description)};
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.12s;

  &:hover { border-color: ${({ theme }) => theme.primary}; color: ${({ theme }) => theme.primary}; }
`;

/* ── list ────────────────────────────────────────────────────────────────── */

export const ListRow = styled.div<{ $inactive?: boolean; $selected?: boolean }>`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 12px 18px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme, $selected, $inactive }) =>
    $selected
      ? `${theme.primary}0a`
      : $inactive
      ? `${theme.border}28`
      : "transparent"};
  border-left: 3px solid ${({ theme, $selected }) =>
    $selected ? theme.primary : "transparent"};
  transition: background 0.15s, border-left-color 0.15s;

  &:last-child { border-bottom: none; }
  &:hover {
    background: ${({ theme, $selected }) =>
      $selected ? `${theme.primary}14` : theme.active};
  }
`;

export const RowInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
`;

export const RowName = styled.div<{ $inactive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 800;
  color: ${({ theme, $inactive }) => $inactive ? theme.description : theme.text};
`;

export const RowDesc = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.description};
  line-height: 1.4;
  padding-left: 14px;
`;

export const StatusDot = styled.span<{ $ativo: boolean }>`
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${({ theme, $ativo }) => $ativo ? theme.secondary : theme.description};
`;

export const Badge = styled.span<{ $ativo: boolean }>`
  font-size: 10px;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: ${ui.radius.pill};
  background: ${({ theme, $ativo }) => $ativo ? `${theme.secondary}22` : theme.border};
  color: ${({ theme, $ativo }) => $ativo ? theme.secondary : theme.description};
`;

export const RowActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
`;

export const GhostBtn = styled.button<{ $active?: boolean }>`
  height: 28px;
  padding: 0 10px;
  border-radius: ${ui.radius.sm};
  border: 1px solid ${({ theme, $active }) => $active ? theme.primary : theme.border};
  background: ${({ theme, $active }) => $active ? theme.lightPrimary : "transparent"};
  color: ${({ theme, $active }) => $active ? theme.primary : theme.text};
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.1s;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.lightPrimary};
  }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

export const DangerBtn = styled.button`
  height: 28px;
  padding: 0 10px;
  border-radius: ${ui.radius.sm};
  border: 1px solid ${({ theme }) => theme.danger};
  background: transparent;
  color: ${({ theme }) => theme.danger};
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.1s;

  &:hover:not(:disabled) { background: ${({ theme }) => `${theme.danger}14`}; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

/* ── empty / loading ─────────────────────────────────────────────────────── */

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 40px 20px;
  color: ${({ theme }) => theme.description};
  font-size: 13px;
`;

export const SkeletonRow = styled.div`
  height: 56px;
  padding: 12px 18px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  display: flex;
  flex-direction: column;
  gap: 7px;
  justify-content: center;
  &:last-child { border-bottom: none; }
`;

export const SkeletonLine = styled.div<{ $w?: string }>`
  height: 10px;
  width: ${({ $w }) => $w ?? "60%"};
  border-radius: 6px;
  background: ${({ theme }) => theme.border};
  animation: ${shimmer} 1.4s ease infinite;
`;

/* ── busca ───────────────────────────────────────────────────────────────── */

export const SearchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

export const SearchWrap = styled.div`
  position: relative;
  flex: 1;

  svg {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.description};
    pointer-events: none;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  height: 34px;
  border-radius: ${ui.radius.md};
  border: 1.5px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.text};
  padding: 0 10px 0 32px;
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

export const ClearBtn = styled.button`
  height: 34px;
  width: 34px;
  border-radius: ${ui.radius.md};
  border: 1.5px solid ${({ theme }) => theme.border};
  background: transparent;
  color: ${({ theme }) => theme.description};
  display: grid;
  place-items: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.12s;

  &:hover {
    border-color: ${({ theme }) => theme.danger};
    color: ${({ theme }) => theme.danger};
  }
`;

/* ── paginação ───────────────────────────────────────────────────────────── */

export const PaginationRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 18px;
  border-top: 1px solid ${({ theme }) => theme.border};
  flex-wrap: wrap;
`;

export const PageInfo = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.description};
`;

export const PageButtons = styled.div`
  display: flex;
  gap: 4px;
`;

export const PageBtn = styled.button<{ $active?: boolean }>`
  height: 30px;
  min-width: 30px;
  padding: 0 8px;
  border-radius: ${ui.radius.sm};
  border: 1.5px solid ${({ theme, $active }) => ($active ? theme.primary : theme.border)};
  background: ${({ theme, $active }) => ($active ? theme.lightPrimary : "transparent")};
  color: ${({ theme, $active }) => ($active ? theme.primary : theme.text)};
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.1s;
  display: grid;
  place-items: center;

  &:hover:not(:disabled):not([data-active="true"]) {
    border-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.primary};
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;
