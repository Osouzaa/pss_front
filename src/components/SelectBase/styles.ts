import styled from "styled-components";

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

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Select = styled.select`
  width: 100%;
  height: 2.875rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }: any) => theme.border};
  background-color: ${({ theme }: any) => theme.backgroundInput};
  padding: 0 0.75rem;
  color: ${({ theme }: any) => theme.text};
  outline: none;
  font-size: 0.95rem;
  line-height: 2.875rem;

  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &::placeholder {
    color: ${({ theme }: any) => theme.description};
  }

  &:focus {
    border-color: ${({ theme }: any) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }: any) => theme.active};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &[aria-invalid="true"] {
    border-color: ${({ theme }: any) => theme.danger};
  }

  padding-right: 2.875rem;

  background-image:
    linear-gradient(
      45deg,
      transparent 50%,
      ${({ theme }) => theme.description} 50%
    ),
    linear-gradient(
      135deg,
      ${({ theme }) => theme.description} 50%,
      transparent 50%
    );
  background-position:
    calc(100% - 20px) 50%,
    calc(100% - 14px) 50%;
  background-size: 6px 6px;
  background-repeat: no-repeat;

   option {
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
  }
`;

export const ErrorText = styled.span`
  color: ${({ theme }) => theme.danger};
  font-size: 0.8rem;
  line-height: 1.2;
  margin-top: 2px;
`;
