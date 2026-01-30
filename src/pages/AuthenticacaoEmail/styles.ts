import styled, { keyframes } from "styled-components";

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

export const Container = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: ${({ theme }) => theme.bodyBg};
`;

export const Card = styled.div`
  width: 100%;
  max-width: 560px;
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
  padding: 20px;
`;

export const Header = styled.div`
  display: flex;
  gap: 14px;
  align-items: center;
  margin-bottom: 14px;
`;

export const Badge = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: ${({ theme }) => theme.lightPrimary};
  color: ${({ theme }) => theme.primary};
  font-size: 20px;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 18px;
  color: ${({ theme }) => theme.text};
  line-height: 1.2;
`;

export const Subtitle = styled.p`
  margin: 4px 0 0;
  font-size: 13px;
  color: ${({ theme }) => theme.description};
`;

export const StatusWrap = styled.div`
  margin: 14px 0 18px;
`;

type StatusVariant = "neutral" | "info" | "success" | "danger";

function statusBg(variant: StatusVariant, theme: any) {
  if (variant === "success") return theme.statusDoneBg;
  if (variant === "danger") return theme.statusCancelBg;
  if (variant === "info") return theme.active;
  return theme.backgroundInput;
}

function statusColor(variant: StatusVariant, theme: any) {
  if (variant === "success") return theme.statusDoneText;
  if (variant === "danger") return theme.statusCancelText;
  if (variant === "info") return theme.primary;
  return theme.text;
}

export const Status = styled.div<{ $variant: StatusVariant }>`
  display: grid;
  grid-template-columns: 34px 1fr;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme, $variant }) => statusBg($variant, theme)};
  color: ${({ theme, $variant }) => statusColor($variant, theme)};
`;

export const StatusIcon = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
  font-size: 18px;
`;

export const StatusTitle = styled.div`
  font-weight: 700;
  font-size: 14px;
  color: ${({ theme }) => theme.text};
`;

export const StatusText = styled.div`
  margin-top: 2px;
  font-size: 13px;
  color: ${({ theme }) => theme.description};
`;

export const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 999px;
  border: 2px solid ${({ theme }) => theme.border};
  border-top-color: ${({ theme }) => theme.primary};
  animation: ${spin} 0.9s linear infinite;
`;

export const Section = styled.section`
  margin-top: 10px;
`;

export const SectionTitle = styled.h2`
  margin: 0 0 6px;
  font-size: 14px;
  color: ${({ theme }) => theme.text};
`;

export const SectionDesc = styled.p`
  margin: 0 0 12px;
  font-size: 13px;
  color: ${({ theme }) => theme.description};
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Actions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 6px;
`;

export const PrimaryButton = styled.button`
  height: 42px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.primary};
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme["text-white"]};
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;

  &:hover {
    background: ${({ theme }) => theme.primaryHover};
    border-color: ${({ theme }) => theme.primaryHover};
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

export const SecondaryButton = styled.button`
  height: 42px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.backgroundInput};
  }
`;

export const Divider = styled.hr`
  border: 0;
  height: 1px;
  background: ${({ theme }) => theme.border};
  margin: 16px 0;
`;

export const FooterNote = styled.p`
  margin: 16px 2px 0;
  font-size: 12px;
  color: ${({ theme }) => theme.description};
`;
