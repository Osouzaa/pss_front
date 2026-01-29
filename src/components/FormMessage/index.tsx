import { ErrorMessage, SuccessMessage, WarningMessage } from "./styles";

interface FormMessageProps {
  message?: string;
  type?: "success" | "error" | "warning";
}

export const FormMessage = ({ message, type }: FormMessageProps) => {
  if (!message) return null;

  switch (type) {
    case "error":
      return <ErrorMessage>{message}</ErrorMessage>;

    case "warning":
      return <WarningMessage>{message}</WarningMessage>;

    case "success":
    default:
      return <SuccessMessage>{message}</SuccessMessage>;
  }
};
