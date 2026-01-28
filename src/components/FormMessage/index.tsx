import { ErrorMessage, SuccessMessage } from "./styles";

interface FormMessageProps {
  message?: string;
  type?: 'success' | 'error';
}

export const FormMessage = ({ message, type }: FormMessageProps) => {
  if (!message) return null;

  return type === 'error' ? (
    <ErrorMessage>{message}</ErrorMessage>
  ) : (
    <SuccessMessage>{message}</SuccessMessage>
  );
};
