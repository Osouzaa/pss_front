import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text};
  font-weight: 600;
`;

export const HiddenInput = styled.input`
  display: none;
`;

export const UploadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  padding: 0.75rem;
  border-radius: 10px;
  border: 2px dashed ${({ theme }) => theme.primary};
  background: ${({ theme }) => theme.lightPrimary};
  color: ${({ theme }) => theme.primary};

  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.primaryHover};
    color: ${({ theme }) => theme["text-white"]};
    border-color: ${({ theme }) => theme.primaryHover};
  }
`;

export const PreviewRow = styled.div`
  width: 100%;
  display: flex;
  gap: 0.5rem;

  overflow-x: auto;
  padding: 0.25rem 0.1rem;

  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;

  /* barra de rolagem mais discreta */
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    height: 8px;
  }
`;

export const PreviewItem = styled.div`
  position: relative;
  flex: 0 0 auto;

  width: 110px;
  height: 110px;

  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.backgroundInput};

  scroll-snap-align: start;
`;

export const PreviewImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const RemoveButton = styled.button`
  position: absolute;
  top: 6px;
  right: 6px;

  width: 34px;
  height: 34px;
  border-radius: 10px;

  display: grid;
  place-items: center;

  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.lightDanger};
  color: ${({ theme }) => theme.danger};

  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.hoverDanger};
    color: ${({ theme }) => theme["text-white"]};
    border-color: ${({ theme }) => theme.hoverDanger};
  }
`;
