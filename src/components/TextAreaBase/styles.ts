import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  width: 100%;
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

export const TextArea = styled.textarea`
  width: 100%;
  resize: vertical;
  min-height: 6rem;

  padding: 0.65rem 0.75rem;
  border-radius: 0.5rem;

  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.text};

  font-size: 0.95rem;
  line-height: 1.4;

  transition:
    border 0.15s ease,
    box-shadow 0.15s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.active};
  }

  &::placeholder {
    color: ${({ theme }) => theme.description};
  }
  &[aria-invalid="true"] {
    border-color: ${({ theme }: any) => theme.danger};
  }
`;

export const Counter = styled.span<{ danger?: boolean }>`
  align-self: flex-end;
  font-size: 0.75rem;
  font-weight: 500;

  color: ${({ danger, theme }) => (danger ? theme.danger : theme.description)};
`;

export const ErrorText = styled.span`
  color: ${({ theme }) => theme.danger};
  font-size: 0.8rem;
  line-height: 1.2;
  margin-top: 2px;
`;
