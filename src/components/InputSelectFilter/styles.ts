import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

export const Label = styled.label`
  color: ${({ theme }) => theme.text};
  font-size: 0.95rem;
  font-weight: 600;
`;

export const Control = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 34px 1fr auto;
  align-items: center;

  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.backgroundInput};
  border-radius: 12px;

  transition: 0.15s ease;
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.06);

  &[data-open="true"] {
    border-color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.background};
    box-shadow: 0 16px 34px rgba(0, 0, 0, 0.1);
  }

  &[data-error="true"] {
    border-color: ${({ theme }) => theme.danger};
  }

  &[data-error="true"][data-open="true"] {
    border-color: ${({ theme }) => theme.danger};
  }

  [data-disabled="true"] & {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

export const LeftIcon = styled.div`
  display: grid;
  place-items: center;
  color: ${({ theme }) => theme.description};
  height: 40px;
`;

export const Input = styled.input`
  height: 2.875rem;
  width: 100%;
  border: 0;
  outline: none;
  background: transparent;

  font-size: 14px;
  color: ${({ theme }) => theme.text};

  &::placeholder {
    color: ${({ theme }) => theme.placeholder};
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding-right: 6px;
`;

export const IconBtn = styled.button`
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: ${({ theme }) => theme.textMuted};
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.lightPrimary};
    color: ${({ theme }) => theme.primary};
  }

  &:active {
    transform: translateY(1px);
  }
`;

export const Chevron = styled.span`
  display: grid;
  place-items: center;
  transition: 0.15s ease;

  &[data-open="true"] {
    transform: rotate(180deg);
  }
`;

export const Dropdown = styled.div`
  margin-top: 6px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  border-radius: 14px;
  box-shadow: ${({ theme }) => theme.shadowSoft};

  overflow: hidden;
`;

export const DropHeader = styled.div`
  padding: 10px 12px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Muted = styled.span`
  color: ${({ theme }) => theme.description};
  font-size: 12px;
`;

export const List = styled.div`
  max-height: 260px;
  overflow: auto;
  padding: 6px;

  /* scroll elegante */
  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.border};
    border-radius: 999px;
    border: 2px solid ${({ theme }) => theme.background};
  }
`;

export const Empty = styled.div`
  padding: 12px;
  color: ${({ theme }) => theme.description};
  font-size: 13px;
`;

export const Item = styled.div`
  padding: 10px 10px;
  border-radius: 0.5rem;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  transition: 0.12s ease;

  &[data-disabled="true"] {
    opacity: 0.55;
    cursor: not-allowed;
  }

  &:hover {
    background: ${({ theme }) => theme.lightPrimary};
  }

  &[data-active="true"] {
    background: ${({ theme }) => theme.active};
  }

  &[data-selected="true"] {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: -2px;
  }
`;

export const ItemMain = styled.div`
  display: grid;
  gap: 2px;
  min-width: 0;
`;

export const ItemLabel = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ItemDesc = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.description};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Badge = styled.span`
  font-size: 11px;
  font-weight: 800;
  padding: 6px 8px;
  border-radius: 999px;
  background: ${({ theme }) => theme.lightPrimary};
  color: ${({ theme }) => theme.primary};
`;

export const ErrorText = styled.div`
  color: ${({ theme }) => theme.danger};
  font-size: 12px;
  font-weight: 700;
`;

export const HelperText = styled.div`
  color: ${({ theme }) => theme.description};
  font-size: 12px;
`;
