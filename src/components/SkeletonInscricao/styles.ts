import styled, { css, keyframes } from "styled-components";

const ui = {
  radius: {
    md: "14px",
    lg: "18px",
    xl: "22px",
    pill: "999px",
  },
  space: {
    xs: "6px",
    sm: "10px",
    md: "14px",
    lg: "18px",
    xl: "24px",
    xxl: "30px",
  },
  shadow: "0 10px 30px rgba(0,0,0,.06)",
  shadowSoft: "0 6px 20px rgba(0,0,0,.05)",
  controlH: "44px", // um pouco mais confortável no mobile
};

const fluid = {
  title: "clamp(18px, 2.2vw, 24px)",
  subtitle: "clamp(13px, 1.7vw, 14px)",
  cardPad: "clamp(14px, 2.2vw, 18px)",
};

export const Page = styled.div``;

export const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${ui.space.lg};
  margin-bottom: ${ui.space.lg};
  padding: 0.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: ${ui.space.md};
  }
`;

export const TitleWrap = styled.div`
  display: grid;
  gap: ${ui.space.xs};
  min-width: 0; /* evita overflow */
`;

export const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.text};
  font-size: clamp(22px, 2.6vw, 30px);
  line-height: 1.1;
  letter-spacing: -0.03em;
  word-break: break-word;
`;

export const Subtitle = styled.p`
  margin: 6px 0 0;
  color: ${({ theme }) => theme.description};
  font-size: clamp(13px, 1.7vw, 15px);
  line-height: 1.55;
  max-width: 72ch;
`;

export const StatusPill = styled.span<{ $status?: string }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: ${ui.radius.pill};
  font-weight: 800;
  font-size: 12px;
  letter-spacing: 0.02em;
  white-space: nowrap;

  ${({ theme, $status }) => {
    const s = ($status ?? "").toUpperCase();

    if (s === "ENVIADA")
      return css`
        background: ${theme.statusDoneBg};
        color: ${theme.statusDoneText};
      `;

    if (s === "RASCUNHO")
      return css`
        background: ${theme.lightPrimary};
        color: ${theme.primary};
      `;

    if (s === "EM_ANALISE")
      return css`
        background: ${theme.statusAnalyzeBg};
        color: ${theme.statusAnalyzeText};
      `;

    if (s === "DEFERIDA")
      return css`
        background: ${theme.statusDoneBg};
        color: ${theme.statusDoneText};
      `;

    if (s === "INDEFERIDA")
      return css`
        background: ${theme.statusCancelBg};
        color: ${theme.statusCancelText};
      `;

    return css`
      background: ${theme.lightDefault};
      color: ${theme.text};
    `;
  }}
`;

export const Badge = styled.div`
  display: grid;
  gap: ${ui.space.xs};
  padding: ${ui.space.md};
  border-radius: ${ui.radius.lg};
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  box-shadow: ${ui.shadowSoft};
  min-width: 260px;

  @media (max-width: 768px) {
    min-width: unset;
    width: 100%;
  }
`;

export const BadgeRow = styled.div`
  display: flex;
  gap: ${ui.space.md};
  align-items: baseline;
  justify-content: space-between;
`;

export const BadgeLabel = styled.span`
  color: ${({ theme }) => theme.description};
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const BadgeValue = styled.span`
  color: ${({ theme }) => theme.text};
  font-weight: 800;
  font-size: 14px;
`;

export const Card = styled.div`
  border: 1px solid ${({ theme }) => `${theme.border}`};
  background: ${({ theme }) => theme.background};
  border-radius: ${ui.radius.xl};
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.06);
  overflow: hidden;
`;

export const CardHeader = styled.div`
  padding: ${fluid.cardPad};
  border-bottom: 1px solid ${({ theme }) => theme.border};

  display: grid;
  gap: 18px;
  align-items: center;

  background:
    radial-gradient(
      1200px 300px at 10% 0%,
      ${({ theme }) => `${theme.active}`},
      transparent 60%
    ),
    linear-gradient(
      180deg,
      ${({ theme }) => theme.background} 0%,
      ${({ theme }) => theme.bodyBg} 100%
    );

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const HeaderLeft = styled.div`
  display: grid;
  gap: 6px;
  min-width: 0;
`;

export const HeaderRight = styled.div`
  min-width: 100%;
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => `${theme.primary}22`};
  background: ${({ theme }) => `${theme.active}`};

  display: grid;
  gap: 6px;

  @media (max-width: 768px) {
    padding: 12px 14px;
  }
`;

export const ProcessoLabel = styled.span`
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.description};
  font-weight: 900;
`;

export const ProcessoTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.text};
  font-size: clamp(18px, 2.4vw, 26px);
  line-height: 1.12;
  letter-spacing: -0.03em;
  font-weight: 950;
  word-break: break-word;
`;

export const ProcessoSubtitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.description};
  font-size: 13px;
  line-height: 1.5;
`;

export const CardHeaderTitle = styled.h3`
  width: 100%;
  margin: 0;
  color: ${({ theme }) => theme.text};
  font-size: 16px;
  letter-spacing: -0.02em;
  font-weight: 900;
`;

export const CardHeaderText = styled.p`
  margin: 8px 0 0;
  color: ${({ theme }) => theme.description};
  font-size: 13.5px;
  line-height: 1.55;
`;

export const Form = styled.form`
  padding: ${fluid.cardPad};

  @media (max-width: 420px) {
    padding: ${ui.space.md};
  }
`;

export const Fieldset = styled.fieldset`
  border: 0;
  padding: 0;
  margin: 0;

  &[disabled] {
    opacity: 0.78;
    cursor: not-allowed;
  }
`;

/**
 * GRID MAIS RESPONSIVO:
 * - usa auto-fit/minmax pra adaptar automaticamente
 * - 1 coluna no mobile sem precisar de media query “hard”
 */
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: ${ui.space.md};

  @media (max-width: 360px) {
    grid-template-columns: 1fr;
  }
`;

export const SectionTitle = styled.h4`
  margin: 0;
  color: ${({ theme }) => theme.text};
  font-size: 13px;
  font-weight: 900;
  letter-spacing: -0.01em;
`;

export const Section = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${ui.space.md};
  margin-top: ${ui.space.md};
  padding-top: ${ui.space.lg};

  border-top: 1px solid ${({ theme }) => theme.border};
`;
export const Field = styled.label`
  display: grid;
  gap: 8px;
  color: ${({ theme }) => theme.text};
  font-size: 13px;
`;

const focusRing = css`
  border-color: ${({ theme }) => theme.primary};
  box-shadow:
    0 0 0 4px ${({ theme }) => theme.active},
    0 10px 24px rgba(0, 0, 0, 0.06);
  background: ${({ theme }) => theme.background};
`;

export const Input = styled.input`
  height: ${ui.controlH};
  border-radius: ${ui.radius.md};
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.backgroundInput};
  padding: 0 12px;
  color: ${({ theme }) => theme.text};
  outline: none;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    background 0.15s ease;

  &::placeholder {
    color: ${({ theme }) => theme.description};
  }

  &:focus {
    ${focusRing};
  }
`;

export const TextArea = styled.textarea`
  min-height: 120px;
  border-radius: ${ui.radius.md};
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.backgroundInput};
  padding: 10px 12px;
  color: ${({ theme }) => theme.text};
  outline: none;
  resize: vertical;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    background 0.15s ease;

  &::placeholder {
    color: ${({ theme }) => theme.description};
  }

  &:focus {
    ${focusRing};
  }
`;

export const Helper = styled.small`
  color: ${({ theme }) => theme.description};
  font-size: 12px;
  line-height: 1.35;
`;

export const ErrorText = styled.small`
  color: ${({ theme }) => theme.danger};
  font-size: 12px;
  line-height: 1.35;
`;

export const CheckRow = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;

  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${ui.radius.md};
  background: ${({ theme }) => theme.background};
  cursor: pointer;
  transition:
    transform 0.08s ease,
    background 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    background: ${({ theme }) => theme.bodyBg};
    border-color: ${({ theme }) => `${theme.primary}33`};
  }

  @media (max-width: 420px) {
    padding: 10px;
  }
`;

export const Checkbox = styled.input.attrs({ type: "checkbox" })`
  width: 18px;
  height: 18px;
  accent-color: ${({ theme }) => theme.primary};
`;

/** Ações: vira grid no mobile (botões full-width) */
export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${ui.space.sm};
  margin-top: ${ui.space.lg};
  padding-top: ${ui.space.md};
  border-top: 1px solid ${({ theme }) => theme.border};

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: 1fr;
    gap: ${ui.space.sm};

    button {
      width: 100%;
    }
  }
`;

const buttonBase = css`
  height: ${ui.controlH};
  padding: 0 14px;
  border-radius: ${ui.radius.md};
  font-weight: 800;
  letter-spacing: 0.01em;
  border: 1px solid transparent;
  cursor: pointer;

  transition:
    transform 0.08s ease,
    background 0.15s ease,
    border-color 0.15s ease,
    opacity 0.15s ease;
  user-select: none;

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const PrimaryButton = styled.button`
  ${buttonBase};
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme["text-white"]};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.primaryHover};
  }
`;

export const SecondaryButton = styled.button`
  ${buttonBase};
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.primary};
  border-color: ${({ theme }) => theme.border};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.BGlink};
    border-color: ${({ theme }) => theme.primary};
  }
`;

export const LoadingState = styled.div`
  padding: ${ui.space.lg};
  border: 1px dashed ${({ theme }) => theme.border};
  border-radius: ${ui.radius.xl};
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.description};
`;

export const ErrorBox = styled.div`
  margin-top: ${ui.space.md};
  padding: ${ui.space.md};
  border-radius: ${ui.radius.lg};
  border: 1px solid ${({ theme }) => theme.danger};
  background: ${({ theme }) => theme.lightDanger};
  color: ${({ theme }) => theme.statusCancelText};
  font-size: 13px;
`;

export const FieldCard = styled.section`
  grid-column: 1 / -1;
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.05);

  transition:
    transform 0.12s ease,
    box-shadow 0.12s ease,
    border-color 0.12s ease;

  &:hover {
    border-color: ${({ theme }) => `${theme.primary}33`};
    box-shadow: 0 14px 34px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 14px;
    border-radius: 14px;
  }
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const TitleInput = styled.h4`
  margin: 0;
  font-size: 14.5px;
  font-weight: 900;
  color: ${({ theme }) => theme.text};
  letter-spacing: -0.01em;
`;

export const Description = styled.p`
  margin: 8px 0 0;
  font-size: 13px;
  color: ${({ theme }) => theme.description};
  line-height: 1.6;
`;
export const Required = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.hoverDanger};
`;

export const Body = styled.div`
  margin-top: 12px;
`;

/** ===== BOOLEAN (Sim/Não) ===== */

export const BooleanGroup = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

export const BooleanOption = styled.label<{
  $disabled?: boolean;
  $active?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  gap: 8px;

  padding: 10px 12px;
  border-radius: 12px;

  border: 1px solid
    ${({ theme, $active }) => ($active ? theme.primary : theme.border)};

  background: ${({ theme, $active }) =>
    $active ? theme.lightPrimary : theme.backgroundInput};

  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};

  transition:
    background 0.12s ease,
    border-color 0.12s ease,
    transform 0.06s ease;

  &:hover {
    background: ${({ theme, $disabled }) =>
      $disabled ? theme.backgroundInput : `${theme.lightPrimary}`};
    border-color: ${({ theme, $disabled }) =>
      $disabled ? theme.border : `${theme.primary}66`};
  }

  &:active {
    transform: ${({ $disabled }) => ($disabled ? "none" : "scale(0.99)")};
  }

  input {
    accent-color: ${({ theme }) => theme.primary};
    transform: translateY(1px);
  }

  span {
    font-size: 13px;
    color: ${({ theme }) => theme.text};
  }
`;

export const HeaderPerguntas = styled.div`
  margin: 0;
`;

export const ContainerTwoColumns = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

export const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 500px;
  gap: 16px;
  align-items: start;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const Main = styled.div`
  min-width: 0;
`;

export const Side = styled.aside`
  min-width: 0;

  @media (min-width: 981px) {
    position: sticky;
    top: 16px; /* ajusta conforme seu header/topbar */
  }
`;

export const SideCard = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  overflow: hidden;
`;

export const SideHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.background} 0%,
    ${({ theme }) => theme.bodyBg} 100%
  );
`;

export const SideBody = styled.div`
  padding: 14px;
`;

export const SideTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.text};
  font-size: 15px;
  font-weight: 950;
  letter-spacing: -0.02em;
`;

export const SideText = styled.p`
  margin: 8px 0 0;
  color: ${({ theme }) => theme.description};
  font-size: 13px;
  line-height: 1.5;
`;

const shimmer = keyframes`
  0% { background-position: -600px 0; }
  100% { background-position: 600px 0; }
`;

const skelBg = (dark?: boolean) =>
  dark ? "rgba(255,255,255,0.06)" : "rgba(20,20,20,0.06)";

const skelHi = (dark?: boolean) =>
  dark ? "rgba(255,255,255,0.12)" : "rgba(20,20,20,0.12)";

// ✅ Base do skeleton (fica bom em claro/escuro se seu card muda o background)
export const SkelBase = styled.div<{ $h?: string; $w?: string }>`
  height: ${({ $h }) => $h ?? "1rem"};
  width: ${({ $w }) => $w ?? "100%"};
  border-radius: 12px;
  background: linear-gradient(
    90deg,
    ${skelBg()} 0%,
    ${skelHi()} 40%,
    ${skelBg()} 80%
  );
  background-size: 1200px 100%;
  animation: ${shimmer} 1.2s linear infinite;
`;

export const SkelLine = styled(SkelBase)<{ $h?: string; $w?: string }>`
  border-radius: 999px;
`;

export const SkelBox = styled(SkelBase)<{ $h?: string; $w?: string }>`
  border-radius: 14px;
`;

export const SkelBtn = styled(SkelBase)<{ $w?: string }>`
  height: 2.6rem;
  width: ${({ $w }) => $w ?? "10rem"};
  border-radius: 14px;
`;

export const FieldBlock = styled.div`
  display: grid;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 16px;
`;

export const ActionsBarSkel = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 0.75rem 0;
`;

export const SkelSection = styled.div`
  margin-top: 0.5rem;
  padding: 0.75rem;
  border-radius: 16px;
`;

export const SectionHeaderSkel = styled.div`
  display: grid;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

export const PerguntasGridSkel = styled.div`
  display: grid;
  gap: 0.75rem;

  @media (min-width: 48rem) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const PerguntaCardSkel = styled.div`
  padding: 0.75rem;
  border-radius: 16px;
  display: grid;
  gap: 0.6rem;
`;
