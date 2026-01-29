import styled from "styled-components";

export const Page = styled.div`
  min-height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 1.25rem;

  @media (max-width: 960px) {
    min-height: 80vh;
    align-items: center; /* ⬅️ NÃO centraliza vertical */
    padding: 1rem 0.75rem; /* ⬅️ padding menor */
  }
`;

export const Center = styled.div`
  width: 100%;
  max-width: 71.25rem;
`;

export const Card = styled.div`
  width: 100%;
  border-radius: 22px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.12);
  overflow: hidden;
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
  gap: 14px;
`;

export const LogoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const LogoCircleImg = styled.img`
  width: auto;
  height: 60px;
  border-radius: 999px;
  display: block;
  object-fit: contain;
  padding: 8px;
`;

export const SystemLogoImg = styled.img`
  width: auto;
  max-width: 12.5rem;
  height: 60px;
  border-radius: 16px;
  display: block;
  object-fit: contain;
  padding: 8px;
`;

export const LogoDivider = styled.div`
  width: 1px;
  height: 34px;
  background: ${({ theme }) => theme.border};
`;

export const BrandTitle = styled.div`
  font-weight: 900;
  line-height: 1.1;
  color: ${({ theme }) => theme.text};
`;

export const BrandSub = styled.div`
  opacity: 0.9;
  font-size: 0.95rem;
  line-height: 1.1;
  color: ${({ theme }) => theme.description};
`;

export const ThemeToggle = styled.button<{ $active: boolean }>`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.backgroundInput};
  border-radius: 999px;
  padding: 8px;
  cursor: pointer;

  display: grid;
  place-items: center;

  &:hover {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.active};
  }
`;

export const ToggleTrack = styled.div<{ $active: boolean }>`
  position: relative;
  width: 74px;
  height: 38px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
`;

export const ToggleIconLeft = styled.span`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  display: grid;
  place-items: center;
  color: ${({ theme }) => theme.primary};
  opacity: 0.8;
`;

export const ToggleIconRight = styled.span`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  display: grid;
  place-items: center;
  color: ${({ theme }) => theme.primary};
  opacity: 0.8;
`;

export const ToggleThumb = styled.span<{ $active: boolean }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: ${({ $active }) => ($active ? "38px" : "4px")};
  width: 30px;
  height: 30px;
  border-radius: 999px;

  display: grid;
  place-items: center;

  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme["text-white"]};

  transition: left 0.2s ease;
`;

/* ===== Layout ===== */
export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

export const LeftPane = styled.div`
  padding: 26px 22px;
`;

export const RightPane = styled.div`
  padding: 26px 22px;
  border-left: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bodyBg};

  @media (max-width: 960px) {
    display: none; /* MOBILE: 1 coluna só */
  }
`;

export const FormTitle = styled.h1`
  font-size: 1.55rem;
  margin: 0 0 6px 0;
  color: ${({ theme }) => theme.text};
`;

export const FormSub = styled.p`
  margin: 0 0 18px 0;
  color: ${({ theme }) => theme.description};
`;

export const Form = styled.form`
  display: grid;
  gap: 14px;
`;

export const Field = styled.div`
  display: grid;
  gap: 8px;
`;

export const Label = styled.label`
  font-weight: 900;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.text};
`;

export const InputWrap = styled.div`
  position: relative;
`;

export const InputIcon = styled.span`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: grid;
  place-items: center;
  color: ${({ theme }) => theme.description};
`;

export const Input = styled.input`
  height: 48px;
  width: 100%;
  border-radius: 14px;
  padding: 0 12px 0 42px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.text};
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.description};
    opacity: 0.85;
  }

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.active};
  }
`;

export const PasswordWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  ${Input} {
    padding-right: 48px;
  }
`;

export const IconButton = styled.button`
  position: absolute;
  right: 8px;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  border: 0;
  background: transparent;
  cursor: pointer;
  display: grid;
  place-items: center;
  color: ${({ theme }) => theme.description};

  &:hover {
    background: ${({ theme }) => theme.active};
    color: ${({ theme }) => theme.primary};
  }
`;

export const PrimaryButton = styled.button`
  height: 48px;
  border-radius: 14px;
  border: 0;
  cursor: pointer;
  font-weight: 900;

  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme["text-white"]};

  &:hover {
    background: ${({ theme }) => theme.primaryHover};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const Divider = styled.div`
  display: grid;
  place-items: center;
  position: relative;
  margin: 2px 0;

  span {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.description};
    padding: 0 10px;
    background: ${({ theme }) => theme.background};
    z-index: 1;
  }

  &:before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    height: 1px;
    background: ${({ theme }) => theme.border};
  }
`;

export const SecondaryButton = styled.button`
  height: 48px;
  border-radius: 14px;
  cursor: pointer;
  font-weight: 900;

  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};

  &:hover {
    background: ${({ theme }) => theme.active};
    border-color: ${({ theme }) => theme.primary};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const FooterHint = styled.p`
  margin: 6px 0 0 0;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.description};
`;

/* ===== Conteúdo do RightPane ===== */
export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
`;

export const MessageTitle = styled.h2`
  margin: 0 0 8px 0;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.text};
`;

export const MessageText = styled.p`
  margin: 0 0 16px 0;
  color: ${({ theme }) => theme.description};
`;

export const InfoCard = styled.div`
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  padding: 14px;
`;

export const InfoTitle = styled.div`
  font-weight: 900;
  margin-bottom: 6px;
  color: ${({ theme }) => theme.text};
`;

export const InfoText = styled.div`
  color: ${({ theme }) => theme.description};
`;

export const BottomNote = styled.div`
  margin-top: 16px;
  color: ${({ theme }) => theme.description};
  font-size: 0.9rem;
`;
