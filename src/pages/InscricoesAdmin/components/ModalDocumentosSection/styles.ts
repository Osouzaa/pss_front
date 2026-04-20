import styled, { css } from "styled-components";

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SectionTitle = styled.h4`
  margin: 0;
  font-size: 13px;
  font-weight: 800;
  color: ${({ theme }) => theme.text};
  letter-spacing: -0.01em;
`;

export const Muted = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${({ theme }) => theme.description};
`;

export const ErrorBox = styled.div`
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.danger};
  background: ${({ theme }) => theme.lightDanger};
  color: ${({ theme }) => theme.danger};
  font-size: 13px;
`;

export const Empty = styled.div`
  border: 1px dashed ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bodyBg};
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  color: ${({ theme }) => theme.description};
  font-size: 13px;
`;

export const DocList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const DocItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bodyBg};
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  min-width: 0;

  &:hover {
    border-color: ${({ theme }) => `${theme.primary}55`};
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
  }

  @media (max-width: 500px) {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
`;

export const DocLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  flex: 1;
`;

export const DocIconWrap = styled.div<{ $isPdf?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  flex-shrink: 0;

  ${({ $isPdf, theme }) =>
    $isPdf
      ? css`
          background: rgba(220, 38, 38, 0.1);
          color: #dc2626;
        `
      : css`
          background: ${theme.lightPrimary};
          color: ${theme.primary};
        `}

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const DocMeta = styled.div`
  min-width: 0;
  flex: 1;
`;

export const DocTipoBadge = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  background: ${({ theme }) => theme.lightPrimary};
  color: ${({ theme }) => theme.primary};
  margin-bottom: 4px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const DocNome = styled.p`
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 240px;
`;

export const DocInfo = styled.p`
  margin: 2px 0 0;
  font-size: 11px;
  color: ${({ theme }) => theme.description};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const OpenButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.primary};
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.15s ease, border-color 0.15s ease;
  flex-shrink: 0;

  &:hover {
    background: ${({ theme }) => theme.lightPrimary};
    border-color: ${({ theme }) => theme.primary};
  }

  @media (max-width: 500px) {
    justify-content: center;
  }
`;
