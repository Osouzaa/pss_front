import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;

  padding: 12px 12px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  border-radius: 16px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.06);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
`;

export const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  min-width: 260px;

  @media (max-width: 768px) {
    min-width: unset;
    width: 100%;
    justify-content: space-between;
  }
`;

export const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

export const Info = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.description};

  strong {
    color: ${({ theme }) => theme.text};
    font-weight: 700;
  }
`;

export const Nav = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Pages = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px;
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bodyBg};
`;

export const IconButton = styled.button`
  width: 38px;
  height: 38px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.primary};
  font-size: 20px;
  line-height: 0;
  cursor: pointer;

  transition:
    transform 120ms ease,
    background 120ms ease,
    border-color 120ms ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.BGlink};
    border-color: ${({ theme }) => theme.link};
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0px);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => theme.active};
    border-color: ${({ theme }) => theme.primary};
  }
`;

export const PageButton = styled.button<{ $active?: boolean }>`
  min-width: 38px;
  height: 38px;
  padding: 0 12px;

  border-radius: 12px;
  border: 1px solid
    ${({ theme, $active }) => ($active ? theme.primary : theme.border)};
  background: ${({ theme, $active }) =>
    $active ? theme.active : theme.background};
  color: ${({ theme, $active }) => ($active ? theme.primary : theme.text)};

  font-weight: ${({ $active }) => ($active ? 800 : 600)};
  font-size: 13px;
  cursor: pointer;

  transition:
    transform 120ms ease,
    background 120ms ease,
    border-color 120ms ease;

  &:hover:not(:disabled) {
    background: ${({ theme, $active }) =>
      $active ? theme.active : theme.BGlink};
    border-color: ${({ theme }) => theme.link};
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0px);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => theme.active};
  }
`;

export const Dots = styled.span`
  width: 34px;
  height: 38px;
  display: grid;
  place-items: center;
  color: ${({ theme }) => theme.description};
  font-weight: 700;
`;

export const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

export const Badge = styled.div`
  padding: 8px 10px;
  border-radius: 14px;
  border: 1px dashed ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bodyBg};
  color: ${({ theme }) => theme.description};
  font-size: 12px;

  strong {
    color: ${({ theme }) => theme.text};
    font-weight: 800;
  }
`;

export const Jump = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const JumpLabel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.description};
`;

export const JumpInput = styled.input`
  width: 64px;
  height: 36px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.text};
  padding: 0 10px;
  font-weight: 700;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.active};
    background: ${({ theme }) => theme.background};
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

export const PageSize = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const PageSizeLabel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.description};
`;

export const Select = styled.select`
  height: 36px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.text};
  padding: 0 10px;
  font-weight: 700;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.active};
    background: ${({ theme }) => theme.background};
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;
