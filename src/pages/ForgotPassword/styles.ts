import styled from "styled-components";

export const Page = styled.div`
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 16px;
  background: ${({ theme }) => theme.bodyBg};
`;

export const Card = styled.div`
  width: min(520px, 100%);
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 16px;
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.12);
  padding: 18px;
`;

export const Header = styled.div`
  display: grid;
  gap: 6px;
  margin-bottom: 14px;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 18px;
  font-weight: 900;
  color: ${({ theme }) => theme.text};
`;

export const Subtitle = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${({ theme }) => theme.description};
  line-height: 1.35;
`;

export const Form = styled.form`
  display: grid;
  gap: 12px;
`;

export const Actions = styled.div`
  margin-top: 4px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const Btn = styled.button`
  height: 42px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid transparent;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 900;
  font-size: 13px;
  cursor: pointer;
  transition: 0.12s ease;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

export const Secondary = styled(Btn)`
  background: ${({ theme }) => theme.lightPrimary};
  color: ${({ theme }) => theme.primary};
  border-color: ${({ theme }) => theme.border};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.active};
  }
`;

export const Primary = styled(Btn)`
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme["text-white"]};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.primaryHover};
  }
`;
