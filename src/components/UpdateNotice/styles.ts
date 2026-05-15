import styled from "styled-components";

export const Wrap = styled.div`
  position: fixed;
  right: 18px;
  bottom: 18px;
  z-index: 9999;
  width: min(420px, calc(100vw - 32px));
  padding: 14px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.surfaceBorder};
  background: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadowSoft};
  backdrop-filter: blur(12px);
  display: grid;
  gap: 12px;

  @media (max-width: 768px) {
    left: 16px;
    right: 16px;
    bottom: calc(92px + env(safe-area-inset-bottom, 0px));
    width: auto;
  }
`;

export const Title = styled.div`
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  font-weight: 800;
  line-height: 1.25;
`;

export const Text = styled.p`
  margin: 4px 0 0;
  color: ${({ theme }) => theme.description};
  font-size: 13px;
  line-height: 1.45;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;
`;

export const Button = styled.button<{ $variant?: "primary" }>`
  height: 36px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid
    ${({ theme, $variant }) =>
      $variant === "primary" ? theme.primary : theme.border};
  background: ${({ theme, $variant }) =>
    $variant === "primary" ? theme.primary : theme.backgroundInput};
  color: ${({ theme, $variant }) =>
    $variant === "primary" ? theme["text-white"] : theme.text};
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    transform 0.08s ease;

  &:hover {
    background: ${({ theme, $variant }) =>
      $variant === "primary" ? theme.primaryHover : theme.lightPrimary};
    border-color: ${({ theme }) => theme.primary};
  }

  &:active {
    transform: translateY(1px);
  }
`;
