// src/pages/Inscricao/components/PerguntaField/styles.ts
import styled from "styled-components";

export const FieldCard = styled.section`
  grid-column: 1 / -1;
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04);
  transition:
    transform 0.12s ease,
    box-shadow 0.12s ease,
    border-color 0.12s ease;

  &:hover {
    border-color: ${({ theme }) => theme.primary}33;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 14px;
    border-radius: 12px;
  }
`;

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
`;

export const Title = styled.b`
  color: ${({ theme }) => theme.text};
  font-size: 15px;
  line-height: 1.2;
`;

export const Required = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.hoverDanger};
`;

export const Description = styled.p`
  margin: 0;
  font-size: 12.5px;
  color: ${({ theme }) => theme.description};
  line-height: 1.4;
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
