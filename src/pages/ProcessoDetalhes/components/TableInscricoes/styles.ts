import styled from "styled-components";

export const Section = styled.section`
  padding: 14px;
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  max-width: 100%;

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

export const SectionHeader = styled.div`
  display: grid;
  gap: 4px;
  margin-bottom: 12px;
  min-width: 0;
`;

export const SectionTitle = styled.h2`
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`;

export const SectionHint = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${({ theme }) => theme.description};
`;

export const EmptyState = styled.div`
  border: 1px dashed ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  border-radius: 14px;
  padding: 18px;

  display: grid;
  gap: 6px;
  max-width: 100%;

  @media (max-width: 480px) {
    padding: 14px;
  }
`;

export const EmptyTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  font-weight: 700;
`;

export const EmptyText = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${({ theme }) => theme.description};
`;

export const InscricoesTableWrap = styled.div`
  width: 100%;
  max-width: 100%;
  border-radius: 14px;
  overflow: hidden;

  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};

  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-gutter: stable both-edges;
`;

export const InscricoesTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;

  min-width: 860px;

  thead tr {
    background: ${({ theme }) => theme.lightDefault};
  }

  tbody tr + tr td {
    border-top: 1px solid ${({ theme }) => theme.border};
  }

  @media (max-width: 520px) {
    min-width: 780px;
  }

  @media (max-width: 420px) {
    min-width: 720px;
  }
`;

export const Th = styled.th`
  text-align: left;
  padding: 12px;
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  white-space: nowrap;

  @media (max-width: 520px) {
    padding: 10px;
  }
`;

export const Tr = styled.tr`
  background: ${({ theme }) => theme.background};

  &:hover {
    background: ${({ theme }) => theme.active};
  }
`;

export const Td = styled.td`
  padding: 12px;
  vertical-align: middle;
  color: ${({ theme }) => theme.description};
  min-width: 0;

  @media (max-width: 520px) {
    padding: 10px;
  }
`;

export const Muted = styled.span`
  color: ${({ theme }) => theme.description};
  font-size: 12px;
`;

export const CellStrong = styled.div`
  font-size: 13px;
  font-weight: 800;
  color: ${({ theme }) => theme.text};
  line-height: 1.25;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  max-width: clamp(180px, 34vw, 360px);
`;

export const CellSub = styled.div`
  margin-top: 4px;
  font-size: 12px;
  color: ${({ theme }) => theme.description};

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  max-width: clamp(180px, 34vw, 360px);
`;

export const CellMono = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  white-space: nowrap;
`;

export const CellClamp2 = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.description};
  line-height: 1.35;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  overflow: hidden;
  text-overflow: ellipsis;

  max-width: clamp(220px, 46vw, 560px);
`;

export const RowActions = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
  max-width: 100%;

  @media (max-width: 520px) {
    gap: 8px;
  }
`;

export const SecondaryButton = styled.button`
  height: 2rem;
  padding: 0 14px;
  border-radius: 14px;

  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.lightDefault};
  color: ${({ theme }) => theme.text};
  font-weight: 700;

  cursor: pointer;
  transition:
    transform 0.14s ease,
    background 0.14s ease,
    border-color 0.14s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.active};
  }

  &:active {
    transform: translateY(0px);
    opacity: 0.92;
  }
`;

export const BtnInline = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;
