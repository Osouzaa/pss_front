import styled, { css } from "styled-components";

const ui = {
  radius: { sm: "6px", md: "8px", lg: "10px", pill: "999px" },
  h: { input: "40px", button: "38px" },
};

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: ${({ theme }) => theme.text};

  @media (max-width: 48rem) {
    gap: 12px;
    padding-bottom: 1rem;
  }
`;

export const ExecutiveHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  padding: 18px 20px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${ui.radius.lg};
  background: ${({ theme }) => theme.background};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.045);

  @media (max-width: 720px) {
    flex-direction: column;
    padding: 16px;
  }
`;

export const HeaderContent = styled.div`
  min-width: 0;
`;

export const Eyebrow = styled.div`
  margin-bottom: 8px;
  color: ${({ theme }) => theme.primary};
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.text};
  font-size: 1.25rem;
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: 0;
`;

export const Subtitle = styled.p`
  margin: 8px 0 0;
  max-width: 74ch;
  color: ${({ theme }) => theme.description};
  font-size: 13px;
  line-height: 1.55;
`;

export const HeaderStatus = styled.div`
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  padding: 0 12px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${ui.radius.md};
  background: ${({ theme }) => theme.bodyBg};
  color: ${({ theme }) => theme.text};
  font-size: 12px;
  font-weight: 800;

  svg {
    color: ${({ theme }) => theme.primary};
  }
`;

export const MetricsBar = styled.section`
  display: grid;
  grid-template-columns: 1.35fr repeat(3, minmax(0, 1fr));
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${ui.radius.lg};
  overflow: hidden;
  background: ${({ theme }) => theme.background};

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

export const MetricItem = styled.div<{ $featured?: boolean }>`
  min-width: 0;
  padding: 14px 16px;
  border-right: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme, $featured }) =>
    $featured ? theme.lightPrimary : theme.background};

  &:last-child {
    border-right: 0;
  }

  span {
    display: block;
    color: ${({ theme, $featured }) =>
      $featured ? theme.primary : theme.description};
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  strong {
    display: block;
    margin-top: 7px;
    color: ${({ theme, $featured }) =>
      $featured ? theme.primary : theme.text};
    font-size: ${({ $featured }) => ($featured ? "28px" : "22px")};
    line-height: 1;
    font-weight: 950;
  }

  @media (max-width: 900px) {
    border-bottom: 1px solid ${({ theme }) => theme.border};

    &:nth-child(2n) {
      border-right: 0;
    }
  }

  @media (max-width: 520px) {
    border-right: 0;
  }
`;

export const ControlPanel = styled.section`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${ui.radius.lg};
  background: ${({ theme }) => theme.background};
  overflow: hidden;
`;

export const ControlHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bodyBg};

  @media (max-width: 720px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

export const ControlTitle = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.text};
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.02em;

  svg {
    color: ${({ theme }) => theme.primary};
  }
`;

export const ControlActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;

  @media (max-width: 520px) {
    display: grid;
    grid-template-columns: 1fr;
  }
`;

export const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(120px, 1fr));
  gap: 12px;
  padding: 14px;

  @media (max-width: 1180px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

export const Field = styled.div`
  display: grid;
  gap: 6px;
  min-width: 0;
`;

export const SearchField = styled(Field)`
  @media (min-width: 1181px) {
    grid-column: span 1;
  }
`;

export const Label = styled.label`
  color: ${({ theme }) => theme.description};
  font-size: 11px;
  font-weight: 850;
`;

export const Input = styled.input`
  width: 100%;
  height: ${ui.h.input};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${ui.radius.md};
  background: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.text};
  padding: 0 10px;
  font-size: 13px;
  outline: none;
  transition:
    border-color 140ms ease,
    box-shadow 140ms ease,
    background 140ms ease;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.active};
    background: ${({ theme }) => theme.background};
  }
`;

export const SearchBox = styled.div`
  position: relative;

  svg {
    position: absolute;
    left: 11px;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.description};
  }

  input {
    width: 100%;
    height: ${ui.h.input};
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: ${ui.radius.md};
    background: ${({ theme }) => theme.backgroundInput};
    color: ${({ theme }) => theme.text};
    padding: 0 10px 0 36px;
    font-size: 13px;
    outline: none;
    transition:
      border-color 140ms ease,
      box-shadow 140ms ease,
      background 140ms ease;

    &:focus {
      border-color: ${({ theme }) => theme.primary};
      box-shadow: 0 0 0 3px ${({ theme }) => theme.active};
      background: ${({ theme }) => theme.background};
    }
  }
`;

export const Select = styled.select`
  height: ${ui.h.button};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${ui.radius.md};
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  padding: 0 10px;
  font-size: 13px;
  font-weight: 750;
  outline: none;
`;

export const ResetButton = styled.button`
  height: ${ui.h.button};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${ui.radius.md};
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  padding: 0 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 800;
  transition:
    background 140ms ease,
    border-color 140ms ease,
    color 140ms ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.active};
    border-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.primary};
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

export const FilterButton = styled.button`
  height: ${ui.h.button};
  border: 1px solid ${({ theme }) => theme.primary};
  border-radius: ${ui.radius.md};
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme["text-white"]};
  padding: 0 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 850;
  transition:
    background 140ms ease,
    border-color 140ms ease;

  &:hover {
    background: ${({ theme }) => theme.primaryHover};
    border-color: ${({ theme }) => theme.primaryHover};
  }
`;

export const DataPanel = styled.section`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${ui.radius.lg};
  background: ${({ theme }) => theme.background};
  overflow: hidden;
`;

export const DataHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bodyBg};
`;

export const DataTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  font-weight: 900;
`;

export const ResultsMeta = styled.div`
  color: ${({ theme }) => theme.description};
  font-size: 12px;
  font-weight: 800;
`;

export const TableWrap = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 760px) {
    display: none;
  }
`;

export const Table = styled.table`
  width: 100%;
  min-width: 880px;
  border-collapse: collapse;
`;

export const Th = styled.th<{ $center?: boolean; $actions?: boolean }>`
  padding: 12px 14px;
  text-align: ${({ $center }) => ($center ? "center" : "left")};
  width: ${({ $actions }) => ($actions ? "1px" : "auto")};
  color: ${({ theme }) => theme.description};
  background: ${({ theme }) => theme.background};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  font-size: 11px;
  font-weight: 900;
  white-space: nowrap;
`;

export const Tr = styled.tr`
  transition: background 120ms ease;

  &:hover {
    background: ${({ theme }) => theme.active};
  }
`;

export const Td = styled.td<{ $center?: boolean; $actions?: boolean }>`
  padding: 13px 14px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text};
  font-size: 13px;
  text-align: ${({ $center }) => ($center ? "center" : "left")};
  width: ${({ $actions }) => ($actions ? "1px" : "auto")};
  white-space: ${({ $actions }) => ($actions ? "nowrap" : "normal")};
  vertical-align: middle;
`;

export const PersonName = styled.div`
  max-width: 310px;
  color: ${({ theme }) => theme.text};
  font-size: 13px;
  font-weight: 900;
  line-height: 1.25;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const PersonDoc = styled.div`
  margin-top: 4px;
  color: ${({ theme }) => theme.description};
  font-size: 12px;
  font-weight: 750;
`;

export const CellStrong = styled.div`
  max-width: 280px;
  color: ${({ theme }) => theme.text};
  font-weight: 800;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CellSub = styled.div`
  max-width: 280px;
  margin-top: 4px;
  color: ${({ theme }) => theme.description};
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CountPill = styled.span`
  display: inline-flex;
  min-width: 34px;
  justify-content: center;
  padding: 5px 9px;
  border-radius: ${ui.radius.pill};
  background: ${({ theme }) => theme.lightPrimary};
  color: ${({ theme }) => theme.primary};
  font-size: 12px;
  font-weight: 900;
`;

export const MobileList = styled.div`
  display: none;

  @media (max-width: 760px) {
    display: grid;
  }
`;

export const MobileRecord = styled.article`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 12px;
  padding: 14px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

export const MobileRecordBody = styled.div`
  min-width: 0;
`;

export const MobileMeta = styled.div`
  margin-top: 4px;
  color: ${({ theme }) => theme.description};
  font-size: 12px;
  font-weight: 750;
`;

export const MobileInfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 4px;
  margin-top: 10px;
  color: ${({ theme }) => theme.description};
  font-size: 12px;

  span {
    min-width: 0;
    overflow-wrap: anywhere;
  }
`;

export const MobileRecordAside = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
`;

export const ConfirmGroup = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;
`;

const button = css`
  height: ${ui.h.button};
  border-radius: ${ui.radius.md};
  padding: 0 12px;
  border: 1px solid transparent;
  font-size: 13px;
  font-weight: 800;
`;

export const DangerButton = styled.button`
  ${button};
  background: ${({ theme }) => theme.danger};
  color: ${({ theme }) => theme["text-white"]};
`;

export const GhostButton = styled.button`
  ${button};
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  border-color: ${({ theme }) => theme.border};
`;

export const IconDangerButton = styled.button`
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: ${ui.radius.md};
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.danger};
  transition:
    border-color 140ms ease,
    background 140ms ease;

  &:hover {
    border-color: ${({ theme }) => theme.danger};
    background: ${({ theme }) => theme.lightDanger};
  }
`;

export const State = styled.div<{ $variant?: "error" }>`
  margin: 14px;
  padding: 28px;
  border-radius: ${ui.radius.md};
  border: 1px solid
    ${({ theme, $variant }) =>
      $variant === "error" ? theme.danger : theme.border};
  background: ${({ theme, $variant }) =>
    $variant === "error" ? theme.lightDanger : theme.backgroundInput};
  color: ${({ theme }) => theme.description};
  text-align: center;
  font-size: 13px;
`;

export const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding-bottom: 8px;

  @media (max-width: 520px) {
    justify-content: space-between;
  }
`;

export const PageButton = styled.button`
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: ${ui.radius.md};
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  transition: border-color 140ms ease;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.primary};
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

export const PageInfo = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.description};

  b {
    color: ${({ theme }) => theme.text};
  }
`;
