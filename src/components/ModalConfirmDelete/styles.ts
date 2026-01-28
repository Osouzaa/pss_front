import styled, { keyframes } from 'styled-components';
import * as Dialog from '@radix-ui/react-dialog';

// Keyframes para as animações de entrada
const overlayShow = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const contentShow = keyframes`
  from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
`;

// Componentes do Radix Dialog estilizados
export const DialogOverlay = styled(Dialog.Overlay)`
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  inset: 0;
  animation: ${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 90000000;
`;

export const DialogContent = styled(Dialog.Content)`
  background-color: white;
  border-radius: 8px;
  box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: 450px;
  padding: 25px;
  animation: ${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 999999999;

  &:focus {
    outline: none;
  }
`;

export const DialogTitle = styled(Dialog.Title)`
  margin: 0;
  font-weight: 600;
  color: #1a1a1a;
  font-size: 1.25rem;
`;

export const DialogDescription = styled(Dialog.Description)`
  margin: 10px 0 20px;
  color: #666;
  font-size: 1rem;
  line-height: 1.5;
`;

export const IconButton = styled(Dialog.Close)`
  font-family: inherit;
  border-radius: 100%;
  height: 25px;
  width: 25px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #666;
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
`;

// Container para os botões de ação no rodapé do modal
export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 25px;
`;

// Botão com variantes de estilo
export const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 0.65rem 1.25rem;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, filter 0.2s;

  /* Estilos baseados na variante */
  background-color: ${({ variant = 'primary' }) => {
    switch (variant) {
      case 'danger':
        return '#E53E3E'; // Vermelho para perigo
      case 'secondary':
        return '#E2E8F0'; // Cinza claro para secundário
      case 'primary':
      default:
        return '#3182CE'; // Azul para primário
    }
  }};

  color: ${({ variant = 'primary' }) => (variant === 'secondary' ? '#2D3748' : 'white')};

  &:hover {
    filter: brightness(1.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
