import styled, { keyframes } from "styled-components";

const ui = {
  radius: {
    md: "14px",
    lg: "16px",
    pill: "999px",
  },
  space: {
    xs: "6px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
  },
  controlH: "44px",
  shadow: "0 10px 24px rgba(0,0,0,0.06)",
};

export const Page = styled.div``;

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: ${ui.space.md};
  margin-bottom: ${ui.space.lg};

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
`;

export const TitleWrap = styled.div`
  display: grid;
  gap: 6px;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 20px;
  line-height: 1.15;
  letter-spacing: -0.2px;

  @media (min-width: 768px) {
    font-size: 24px;
  }
`;

export const Subtitle = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${({ theme }) => theme.description};
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: ${ui.space.sm};
  width: 100%;

  @media (min-width: 768px) {
    width: auto;
  }
`;

export const Content = styled.main`
  display: grid;
  gap: ${ui.space.lg};
  grid-template-columns: 1fr;

  @media (min-width: 1024px) {
    grid-template-columns: 1.15fr 0.85fr;
    align-items: start;
  }
`;

export const Card = styled.section`
  width: 100%;
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${ui.radius.lg};
  box-shadow: ${ui.shadow};
  padding: ${ui.space.lg};

  @media (min-width: 768px) {
    padding: 18px;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${ui.space.md};
  margin-bottom: ${ui.space.md};
`;

export const CardHeaderText = styled.div`
  display: grid;
  gap: 2px;
`;

export const CardTitle = styled.h2`
  margin: 0;
  font-size: 16px;
  letter-spacing: -0.2px;
`;

export const CardDesc = styled.p`
  margin: 0;
  font-size: 12.5px;
  color: ${({ theme }) => theme.description};
`;

export const CardIcon = styled.div<{
  $variant?: "primary" | "success" | "danger" | "default";
}>`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  border: 1px solid ${({ theme }) => theme.border};

  background: ${({ theme, $variant }) => {
    if ($variant === "primary") return theme.lightPrimary;
    if ($variant === "success") return theme.lightSuccess;
    if ($variant === "danger") return theme.lightDanger;
    return theme.lightDefault;
  }};

  svg {
    color: ${({ theme, $variant }) => {
      if ($variant === "primary") return theme.primary;
      if ($variant === "success") return theme.secondary;
      if ($variant === "danger") return theme.danger;
      return theme.description;
    }};
    font-size: 18px;
  }
`;

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: ${({ theme }) => theme.border};
  margin: ${ui.space.lg} 0;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${ui.space.md};

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

/* ===== Select (pra combinar com InputBase visualmente) ===== */
export const SelectField = styled.div`
  display: grid;
  gap: 6px;
`;

export const SelectLabel = styled.label`
  font-size: 12px;
  color: ${({ theme }) => theme.description};
`;

export const Select = styled.select`
  width: 100%;
  height: ${ui.controlH};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.backgroundInput};
  padding: 0 ${ui.space.md};
  color: ${({ theme }) => theme.text};
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 4px ${({ theme }) => theme.BGlink};
    background: ${({ theme }) => theme.background};
  }
`;

export const DocActions = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${ui.space.md};
  margin-top: ${ui.space.md};

  @media (min-width: 520px) {
    grid-template-columns: 1fr auto;
    align-items: end;
  }
`;

export const UploadButton = styled.button`
  height: ${ui.controlH};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme["text-white"]};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${ui.space.sm};
  padding: 0 ${ui.space.lg};
  cursor: pointer;

  transition:
    background 0.2s ease,
    transform 0.05s ease;

  &:hover {
    background: ${({ theme }) => theme.primaryHover};
  }

  &:active {
    transform: translateY(1px);
  }
`;

export const HiddenInput = styled.input`
  display: none;
`;

export const DocList = styled.div`
  display: grid;
  gap: ${ui.space.sm};
  margin-top: ${ui.space.lg};
`;

export const DocItem = styled.div`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  border-radius: ${ui.radius.lg};
  padding: ${ui.space.md};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${ui.space.md};
`;

export const DocLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${ui.space.md};
  min-width: 0;
`;

export const DocBadge = styled.span`
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 10px;
  border-radius: ${ui.radius.pill};
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.lightDefault};
  color: ${({ theme }) => theme.text};
  font-size: 11px;
  white-space: nowrap;
`;

export const DocInfo = styled.div`
  display: grid;
  gap: 2px;
  min-width: 0;
`;

export const DocName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 52vw;

  @media (min-width: 768px) {
    max-width: 380px;
  }
`;

export const DocMeta = styled.div`
  font-size: 11.5px;
  color: ${({ theme }) => theme.description};
`;

export const DocRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${ui.space.sm};
`;

export const DangerIconButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.lightDanger};
  display: grid;
  place-items: center;
  cursor: pointer;
  transition:
    transform 0.05s ease,
    background 0.2s ease;

  svg {
    color: ${({ theme }) => theme.danger};
    font-size: 18px;
  }

  &:hover {
    background: ${({ theme }) => theme.hoverDanger};
    border-color: ${({ theme }) => theme.hoverDanger};

    svg {
      color: ${({ theme }) => theme["text-white"]};
    }
  }

  &:active {
    transform: translateY(1px);
  }
`;

export const Empty = styled.div`
  margin-top: ${ui.space.lg};
  padding: 18px;
  border-radius: ${ui.radius.lg};
  border: 1px dashed ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.backgroundInput};
  display: grid;
  gap: 6px;
  place-items: center;
  text-align: center;
`;

export const EmptyIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.lightDefault};

  svg {
    color: ${({ theme }) => theme.primary};
    font-size: 18px;
  }
`;

export const EmptyTitle = styled.div`
  font-weight: 700;
  font-size: 14px;
`;

export const EmptyDesc = styled.p`
  margin: 0;
  font-size: 12.5px;
  color: ${({ theme }) => theme.description};

  strong {
    color: ${({ theme }) => theme.text};
  }
`;

export const HintRow = styled.div`
  margin-top: ${ui.space.lg};
  padding: ${ui.space.md};
  border-radius: ${ui.radius.lg};
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.backgroundInput};
  display: flex;
  align-items: flex-start;
  gap: ${ui.space.sm};
`;

export const HintIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: ${({ theme }) => theme.lightDefault};
  border: 1px solid ${({ theme }) => theme.border};

  svg {
    color: ${({ theme }) => theme.primary};
    font-size: 16px;
  }
`;

export const HintText = styled.p`
  margin: 0;
  font-size: 12.5px;
  color: ${({ theme }) => theme.description};
`;

export const FooterActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: ${ui.space.lg};
`;

export const PrimaryButton = styled.button`
  height: ${ui.controlH};
  border-radius: 12px;
  border: 0;
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme["text-white"]};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${ui.space.sm};
  padding: 0 ${ui.space.lg};
  cursor: pointer;
  width: 100%;

  transition:
    background 0.2s ease,
    transform 0.05s ease;

  &:hover {
    background: ${({ theme }) => theme.primaryHover};
  }

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  @media (min-width: 768px) {
    width: auto;
  }
`;

export const SecondaryButton = styled.button`
  height: ${ui.controlH};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.primary};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${ui.space.sm};
  padding: 0 ${ui.space.lg};
  cursor: pointer;
  width: 100%;

  transition:
    background 0.2s ease,
    transform 0.05s ease,
    border-color 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.active};
    border-color: ${({ theme }) => theme.primary};
  }

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  @media (min-width: 520px) {
    width: auto;
  }
`;

const shimmer = keyframes`
  0% { transform: translateX(-60%); }
  100% { transform: translateX(160%); }
`;

export const CepLoadingField = styled.div`
  width: 100%;
  display: grid;
  gap: 0.45rem;
`;

export const CepLoadingLabel = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

export const CepLoadingBox = styled.div`
  position: relative;
  width: 100%;
  height: 44px; /* ajuste se seu InputBase for maior/menor */
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.backgroundInput};

  display: flex;
  align-items: center;
  padding: 0 0.9rem;

  overflow: hidden;

  /* leve sensação de "desabilitado" */
  opacity: 0.92;
`;

export const CepLoadingText = styled.div`
  display: flex;
  align-items: center;
  gap: 0.55rem;

  color: ${({ theme }) => theme.description};
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.2px;
`;

export const DotPulse = styled.span`
  display: inline-flex;
  gap: 6px;
  align-items: center;

  span {
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: ${({ theme }) => theme.primary};
    opacity: 0.25;
    animation: pulse 1.1s infinite ease-in-out;
  }

  span:nth-child(2) {
    animation-delay: 0.15s;
  }
  span:nth-child(3) {
    animation-delay: 0.3s;
  }

  @keyframes pulse {
    0%,
    100% {
      transform: translateY(0);
      opacity: 0.25;
    }
    50% {
      transform: translateY(-2px);
      opacity: 0.7;
    }
  }
`;

export const Shimmer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;

  /* faixa brilhante */
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: -60%;
    height: 100%;
    width: 50%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.35),
      transparent
    );
    animation: ${shimmer} 1.25s infinite ease-in-out;
  }
`;

/* Mensagem pequena opcional (abaixo do "input") */
export const CepLoadingHint = styled.small`
  color: ${({ theme }) => theme.description};
  font-size: 0.85rem;
`;
