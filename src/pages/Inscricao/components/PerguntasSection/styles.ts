import styled from "styled-components";

export const SectionHeader = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 14px;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.border};

  @media (max-width: 520px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

export const SectionTitle = styled.h4`
  margin: 0;
  color: ${({ theme }) => theme.text};
  font-size: 13px;
  font-weight: 900;
  letter-spacing: -0.01em;
`;

export const ProgressWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

export const ProgressLabel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.description};
  white-space: nowrap;
`;

export const ProgressBar = styled.div`
  width: 120px;
  height: 6px;
  border-radius: 999px;
  background: ${({ theme }) => theme.border};
  overflow: hidden;

  @media (max-width: 520px) {
    width: 100px;
  }
`;

export const ProgressFill = styled.div<{ $pct: number }>`
  height: 100%;
  width: ${({ $pct }) => `${$pct}%`};
  border-radius: 999px;
  background: ${({ theme }) => theme.primary};
  transition: width 0.3s ease;
`;

export const QuestionsGrid = styled.div`
  grid-column: 1 / -1;
  display: grid;
  gap: 12px;
`;
