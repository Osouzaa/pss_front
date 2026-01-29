import styled from "styled-components";

const ui = {
  radius: { sm: "12px", md: "14px", lg: "18px", pill: "999px" },
  space: {
    xs: "6px",
    sm: "10px",
    md: "14px",
    lg: "18px",
    xl: "24px",
    xxl: "28px",
  },
  controlH: "46px",
};

export const Page = styled.div`
  min-height: 100dvh;
  background: ${({ theme }) => theme.bodyBg};
  color: ${({ theme }) => theme.text};
`;

export const Center = styled.div`
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: calc(${ui.space.xl} + env(safe-area-inset-top)) ${ui.space.md}
    calc(${ui.space.xl} + env(safe-area-inset-bottom));
`;

export const Card = styled.div`
  width: 100%;
  max-width: 980px;

  border-radius: ${ui.radius.lg};
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};

  overflow: hidden;
  box-shadow: 0 18px 46px rgba(0, 0, 0, 0.12);

  @media (max-width: 520px) {
    border-radius: ${ui.radius.md};
  }
`;

export const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
`;

export const BrandMini = styled.div`
  display: flex;
  align-items: center;
`;

export const LogoRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${ui.space.sm};
`;

export const SystemLogoImg = styled.img`
  width: auto;
  height: 50px;
  width: auto;
  object-fit: contain;
`;

export const LogoCircleImg = styled.img`
  width: auto;
  height: 50px;
  border-radius: ${ui.radius.pill};
  object-fit: cover;
`;

export const LogoDivider = styled.div`
  width: 1px;
  height: 28px;
  background: ${({ theme }) => theme.border};
  opacity: 0.9;
`;
export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  min-height: 560px;

  @media (min-width: 900px) {
    grid-template-columns: 1.05fr 1fr;
  }

  @media (max-width: 899px) {
    min-height: auto; /* ✅ mobile: não força altura */
  }
`;

/* LEFT */
export const LeftPane = styled.aside`
  padding: ${ui.space.xxl};
  background: ${({ theme }) => theme.lightDefault};
  border-bottom: 1px solid ${({ theme }) => theme.border};

  @media (min-width: 900px) {
    border-bottom: none;
    border-right: 1px solid ${({ theme }) => theme.border};
  }

  @media (max-width: 899px) {
    display: none; /* ✅ mobile: some tudo da coluna esquerda */
  }

  @media (max-width: 520px) {
    padding: ${ui.space.xl};
  }
`;

export const MessageTitle = styled.h2`
  margin: 0;
  font-size: 22px;
  line-height: 1.15;
  letter-spacing: -0.2px;
`;

export const MessageText = styled.p`
  margin: 10px 0 0;
  font-size: 13px;
  line-height: 1.45;
  color: ${({ theme }) => theme.description};
`;

export const InfoCard = styled.div`
  margin-top: ${ui.space.lg};
  padding: ${ui.space.lg};
  border-radius: ${ui.radius.lg};

  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};

  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.06);
`;

export const InfoTitle = styled.div`
  font-weight: 950;
  font-size: 13px;
`;

export const InfoText = styled.p`
  margin: 10px 0 0;
  color: ${({ theme }) => theme.description};
  font-size: 13px;
  line-height: 1.55;

  b {
    color: ${({ theme }) => theme.text};
    font-weight: 950;
  }
`;

export const BottomNote = styled.div`
  margin-top: ${ui.space.xl};
  font-size: 12px;
  color: ${({ theme }) => theme.description};
  font-weight: 850;
`;

export const LinkInline = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;

  font-size: 12px;
  font-weight: 950;
  color: ${({ theme }) => theme.link};

  &:hover {
    text-decoration: underline;
  }
`;

/* RIGHT */
export const RightPane = styled.main`
  padding: ${ui.space.xxl};
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 899px) {
    justify-content: flex-start; /* ✅ mobile: começa de cima */
  }

  @media (max-width: 520px) {
    padding: ${ui.space.xl};
  }
`;

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: ${ui.space.md};
  margin-bottom: ${ui.space.lg};
`;

export const BrandTitle = styled.div`
  font-weight: 950;
  font-size: 14px;
  line-height: 1.1;
`;

export const BrandSub = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.description};
  font-weight: 850;
`;

export const FormTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  letter-spacing: -0.2px;
`;

export const FormSub = styled.p`
  margin: 8px 0 0;
  font-size: 13px;
  color: ${({ theme }) => theme.description};
`;

export const Form = styled.form`
  margin-top: ${ui.space.lg};
  display: flex;
  flex-direction: column;
  gap: ${ui.space.md};
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${ui.space.xs};
`;

export const Label = styled.label`
  font-size: 12px;
  font-weight: 950;
  color: ${({ theme }) => theme.text};
`;

export const InputWrap = styled.div`
  position: relative;
  width: 100%;
`;

export const PasswordWrap = styled.div`
  position: relative;
  width: 100%;
`;

export const InputIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);

  color: ${({ theme }) => theme.description};
  opacity: 0.9;

  svg {
    font-size: 16px;
  }
`;

export const Input = styled.input`
  height: ${ui.controlH};
  width: 100%;
  border-radius: ${ui.radius.md};

  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};

  padding: 0 44px 0 40px;
  outline: none;

  transition:
    border-color 120ms ease,
    box-shadow 120ms ease,
    background 120ms ease;

  &::placeholder {
    color: ${({ theme }) => theme.description};
    opacity: 0.85;
  }

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 4px ${({ theme }) => theme.lightPrimary};
  }
`;

export const IconButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);

  width: 38px;
  height: 38px;
  border-radius: ${ui.radius.pill};

  display: grid;
  place-items: center;

  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.primary};

  cursor: pointer;

  transition:
    transform 120ms ease,
    background 120ms ease,
    border-color 120ms ease;

  &:hover {
    border-color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.lightPrimary};
  }

  &:active {
    transform: translateY(-50%) scale(0.98);
  }

  svg {
    font-size: 16px;
  }
`;

export const Rules = styled.div`
  display: grid;
  gap: 6px;
  margin-top: 8px;
`;

export const Rule = styled.div<{ $ok: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 12px;
  font-weight: 850;

  color: ${({ theme, $ok }) => ($ok ? theme.secondary : theme.description)};

  transition: color 120ms ease;
`;

export const RuleIconWrap = styled.span<{ $ok: boolean }>`
  display: grid;
  place-items: center;

  svg {
    font-size: 14px;
    color: ${({ theme, $ok }) => ($ok ? theme.secondary : theme.description)};
  }
`;

export const PrimaryButton = styled.button`
  height: ${ui.controlH};
  width: 100%;
  border-radius: ${ui.radius.md};

  border: 1px solid ${({ theme }) => theme.primary};
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme["text-white"]};

  font-weight: 950;
  cursor: pointer;

  transition:
    background 120ms ease,
    transform 120ms ease,
    opacity 120ms ease,
    box-shadow 120ms ease;

  &:hover {
    background: ${({ theme }) => theme.primaryHover};
    box-shadow: 0 10px 26px rgba(0, 0, 0, 0.12);
  }

  &:active {
    transform: scale(0.99);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: ${ui.space.sm};
  margin: 6px 0;

  &:before,
  &:after {
    content: "";
    height: 1px;
    flex: 1;
    background: ${({ theme }) => theme.border};
    opacity: 0.9;
  }

  span {
    font-size: 12px;
    font-weight: 950;
    color: ${({ theme }) => theme.description};
  }
`;

export const SecondaryButton = styled.button`
  height: ${ui.controlH};
  width: 100%;
  border-radius: ${ui.radius.md};

  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};

  font-weight: 950;
  cursor: pointer;

  transition:
    transform 120ms ease,
    background 120ms ease,
    border-color 120ms ease,
    box-shadow 120ms ease;

  &:hover {
    border-color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.lightPrimary};
    box-shadow: 0 10px 26px rgba(0, 0, 0, 0.08);
  }

  &:active {
    transform: scale(0.99);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

export const FooterHint = styled.p`
  margin: 4px 0 0;
  font-size: 12px;
  color: ${({ theme }) => theme.description};
  line-height: 1.45;
`;

/* THEME TOGGLE (igual login) */
export const ThemeToggle = styled.button<{ $active: boolean }>`
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  border-radius: ${ui.radius.pill};

  &:active {
    transform: scale(0.99);
  }
`;

export const ToggleTrack = styled.div<{ $active: boolean }>`
  width: 66px;
  height: 36px;
  border-radius: ${ui.radius.pill};

  position: relative;

  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.lightDefault};
  overflow: hidden;

  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.02);
`;

export const ToggleIconLeft = styled.div`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.primary};
  opacity: 0.9;

  svg {
    font-size: 15px;
  }
`;

export const ToggleIconRight = styled.div`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.text};
  opacity: 0.7;

  svg {
    font-size: 15px;
  }
`;

export const ToggleThumb = styled.div<{ $active: boolean }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: ${({ $active }) => ($active ? "34px" : "6px")};

  width: 28px;
  height: 28px;
  border-radius: ${ui.radius.pill};

  display: grid;
  place-items: center;

  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};

  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);

  transition:
    left 180ms ease,
    background 180ms ease,
    border-color 180ms ease;

  svg {
    font-size: 15px;
    color: ${({ theme, $active }) => ($active ? theme.text : theme.primary)};
  }
`;
