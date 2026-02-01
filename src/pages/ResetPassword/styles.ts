import styled from "styled-components";

export const Page = styled.div`
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 16px;
  background: ${({ theme }) => theme.bodyBg};
`;

export const Card = styled.div`
  width: min(560px, 100%);
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 16px;
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.12);
  padding: 18px;
`;

export const Header = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 14px;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 18px;
  font-weight: 900;
  color: ${({ theme }) => theme.text};
`;

export const Subtitle = styled.p`
  margin: 6px 0 0;
  font-size: 13px;
  color: ${({ theme }) => theme.description};
`;

export const BackBtn = styled.button`
  height: 40px;
  padding: 0 12px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.lightPrimary};
  color: ${({ theme }) => theme.primary};
  font-weight: 900;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: 0.12s ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.active};
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

export const Form = styled.form`
  display: grid;
  gap: 12px;

  /* botões do "olhinho" dentro do InputBase */
  button {
    border: none;
    background: transparent;
    cursor: pointer;
    color: ${({ theme }) => theme.text};
    opacity: 0.9;

    &:hover {
      opacity: 1;
    }
  }
`;

export const Hint = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.description};
  padding: 4px 2px;
`;

export const Alert = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.warningBg};
  color: ${({ theme }) => theme.warningText};
  border-radius: 14px;
  padding: 10px 12px;
  font-size: 13px;
  font-weight: 900;
`;

export const Primary = styled.button`
  height: 42px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 900;
  font-size: 13px;
  cursor: pointer;
  transition: 0.12s ease;

  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme["text-white"]};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.primaryHover};
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;
