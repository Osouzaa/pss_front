import styled, { css } from "styled-components";

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const Header = styled.header`
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 18px;
  padding: 14px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.06);
`;

export const HeaderTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

export const BackButton = styled.button`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bodyBg};
  color: ${({ theme }) => theme.text};
  border-radius: 12px;
  padding: 10px 12px;
  cursor: pointer;

  display: inline-flex;
  align-items: center;
  gap: 8px;

  transition: 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.active};
    border-color: ${({ theme }) => theme.primary};
  }
`;

export const HeaderTitleArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 18px;
  line-height: 1.2;
  color: ${({ theme }) => theme.text};
`;

export const Subtitle = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${({ theme }) => theme.description};
`;

export const StateBox = styled.div<{ $variant?: "danger" }>`
  margin-top: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bodyBg};
  border-radius: 14px;
  padding: 12px;

  ${({ $variant, theme }) =>
    $variant === "danger" &&
    css`
      border-color: ${theme.lightDanger};
      background: ${theme.lightDanger};
    `}
`;

export const StateTitle = styled.div`
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`;

export const StateText = styled.p`
  margin: 6px 0 0 0;
  color: ${({ theme }) => theme.description};
  font-size: 13px;
`;

export const StateActions = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 10px;
`;

export const ActionButton = styled.button`
  border: 0;
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme["text-white"]};
  border-radius: 12px;
  padding: 10px 12px;
  cursor: pointer;
  transition: 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.primaryHover};
  }
`;

export const MetaGrid = styled.div`
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const MetaCard = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bodyBg};
  border-radius: 16px;
  padding: 12px;

  display: flex;
  align-items: center;
  gap: 12px;
`;

export const MetaIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 14px;
  background: ${({ theme }) => theme.lightPrimary};

  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    color: ${({ theme }) => theme.primary};
    font-size: 18px;
  }
`;

export const MetaBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

export const MetaLabel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.description};
`;

export const MetaValue = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const MetaWideCard = styled.div`
  grid-column: 1 / -1;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bodyBg};
  border-radius: 16px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const MetaWideTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const MetaWideTitle = styled.h2`
  margin: 0;
  font-size: 16px;
  color: ${({ theme }) => theme.text};
`;

export const ScorePill = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.active};
  color: ${({ theme }) => theme.primary};
  border-radius: 999px;
  padding: 8px 12px;
  font-size: 13px;

  b {
    color: ${({ theme }) => theme.primary};
  }
`;

export const MetaWideBottom = styled.div`
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
`;

export const MetaLine = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  font-size: 13px;

  span {
    color: ${({ theme }) => theme.description};
  }

  strong {
    color: ${({ theme }) => theme.text};
  }
`;

export const ObsBox = styled.div`
  border: 1px dashed ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  border-radius: 14px;
  padding: 12px;
`;

export const ObsTitle = styled.div`
  font-weight: 800;
  color: ${({ theme }) => theme.text};
  font-size: 13px;
`;

export const ObsText = styled.p`
  margin: 6px 0 0 0;
  color: ${({ theme }) => theme.description};
  font-size: 13px;
  line-height: 1.5;
`;

export const Card = styled.section`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  border-radius: 18px;
  padding: 14px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.06);
`;

export const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 10px;
`;

export const CardTitle = styled.h3`
  margin: 0;
  font-size: 15px;
  color: ${({ theme }) => theme.text};
`;

export const CardDesc = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${({ theme }) => theme.description};
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Item = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bodyBg};
  border-radius: 16px;
  padding: 12px;
`;

export const ItemTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
`;

export const QuestionTitle = styled.div`
  font-weight: 800;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  line-height: 1.4;
`;

export const Required = styled.span`
  color: ${({ theme }) => theme.danger};
  margin-left: 6px;
`;

export const TypePill = styled.span`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.description};
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 12px;
  white-space: nowrap;
`;

export const QuestionDesc = styled.p`
  margin: 6px 0 0 0;
  color: ${({ theme }) => theme.description};
  font-size: 13px;
  line-height: 1.5;
`;

export const AnswerBox = styled.div`
  margin-top: 10px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  border-radius: 14px;
  padding: 10px 12px;
`;

export const AnswerLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.description};
`;

export const AnswerValue = styled.div`
  margin-top: 6px;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  font-weight: 700;
  line-height: 1.45;
  word-break: break-word;
`;

export const AnswerMeta = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const MetaChip = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bodyBg};
  color: ${({ theme }) => theme.description};
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 12px;

  b {
    color: ${({ theme }) => theme.text};
  }
`;

export const Empty = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  border-radius: 18px;
  padding: 16px;
  text-align: center;
`;

export const EmptyTitle = styled.div`
  font-weight: 800;
  color: ${({ theme }) => theme.text};
`;

export const EmptyText = styled.p`
  margin: 6px 0 0 0;
  color: ${({ theme }) => theme.description};
  font-size: 13px;
`;

export const EmptyCompact = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  border-radius: 16px;
  padding: 14px;
  text-align: center;
`;

export const DocList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const DocItem = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bodyBg};
  border-radius: 16px;
  padding: 12px;

  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const DocLeft = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const DocRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  @media (max-width: 640px) {
    justify-content: flex-start;
  }
`;

export const DocType = styled.div`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.active};
  color: ${({ theme }) => theme.primary};
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 800;
`;

export const DocName = styled.div`
  font-size: 14px;
  font-weight: 800;
  color: ${({ theme }) => theme.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 760px;

  @media (max-width: 640px) {
    max-width: 100%;
    white-space: normal;
  }
`;

export const DocMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  color: ${({ theme }) => theme.description};
  font-size: 12px;
`;

export const Dot = styled.span`
  width: 4px;
  height: 4px;
  border-radius: 999px;
  background: ${({ theme }) => theme.border};
  display: inline-block;
`;

export const DocDesc = styled.div`
  color: ${({ theme }) => theme.description};
  font-size: 13px;
  line-height: 1.45;
  word-break: break-word;
`;

export const DocLink = styled.a`
  border: 0;
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme["text-white"]};
  border-radius: 12px;
  padding: 10px 12px;
  text-decoration: none;
  cursor: pointer;

  display: inline-flex;
  align-items: center;
  gap: 8px;

  transition: 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.primaryHover};
  }
`;

export const DocDisabled = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.description};
  border-radius: 12px;
  padding: 10px 12px;
  display: inline-flex;
  align-items: center;
`;
