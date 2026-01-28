import styled from "styled-components";

export const ErrorMessage = styled.span`
  width: 100%;
  display: block;

  color: ${({ theme }) => theme.danger};
  font-size: 0.85rem;

  background-color: ${({ theme }) => theme.lightDanger};
  border-left: 3px solid ${({ theme }) => theme.danger};

  padding: 8px 12px;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 6px;

  animation: fadeIn 0.25s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;


export const SuccessMessage = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  color: ${({ theme }) => theme.statusDoneText};
  font-size: 0.95rem;
  font-weight: 600;

  background-color: ${({ theme }) => theme.statusDoneBg};
  border-left: 3px solid ${({ theme }) => theme.secondary};

  padding: 12px 16px;
  margin-bottom: 1.5rem;
  border-radius: 8px;

  text-align: center;

  animation: fadeIn 0.25s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

