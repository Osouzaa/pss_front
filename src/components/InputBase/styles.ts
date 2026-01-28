import styled, { css } from "styled-components";

export const Field = styled.div`
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

export const InputWrap = styled.div`
  position: relative;
  width: 100%;
`;

export const Icon = styled.span`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;

  color: ${({ theme }) => theme.description};
  font-size: 18px;
`;

export const Input = styled.input<{ $hasIcon?: boolean }>`
  width: 100%;
  height: 2.875rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.backgroundInput};
  padding: 0 0.75rem;
  color: ${({ theme }) => theme.text};
  outline: none;

  ${({ $hasIcon }) =>
    $hasIcon &&
    css`
      padding-right: 40px;
    `}

  -webkit-appearance: none;
  appearance: none;
  font-size: 1rem;
  line-height: 2.875rem;

  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    background 0.15s;

  &::placeholder {
    color: ${({ theme }) => theme.description};
  }

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 4px ${({ theme }) => theme.active};
    background: ${({ theme }) => theme.background};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &[type="date"],
  &[type="datetime-local"],
  &[type="time"] {
    padding: 10px 12px;
    line-height: normal;
  }

  &[type="date"]::-webkit-datetime-edit,
  &[type="datetime-local"]::-webkit-datetime-edit,
  &[type="time"]::-webkit-datetime-edit {
    color: ${({ theme }) => theme.text};
  }

  &[type="date"]::-webkit-calendar-picker-indicator,
  &[type="datetime-local"]::-webkit-calendar-picker-indicator {
    opacity: 0;
  }
`;

export const ErrorText = styled.span`
  color: ${({ theme }) => theme.danger};
  font-size: 0.8rem;
  line-height: 1.2;
  margin-top: 2px;
`;
