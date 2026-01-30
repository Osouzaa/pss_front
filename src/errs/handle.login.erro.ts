import { AxiosError } from "axios";

type BackendErrorResponse = {
  message?: string;
};

export function handleLoginError(error: unknown): string {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const backendMessage = error.response?.data as BackendErrorResponse;

    switch (status) {
      case 409:
        return (
          backendMessage?.message ??
          "E-mail ou senha inválidos. Verifique os dados e tente novamente."
        );

      case 401:
        return "Credenciais inválidas. Verifique seu e-mail e senha.";

      case 403:
        return "Confirme seu e-mail para acessar. Verifique sua caixa de entrada.";

      case 500:
        return "Erro interno no servidor. Tente novamente mais tarde.";

      default:
        return "Não foi possível realizar o login. Tente novamente.";
    }
  }

  return "Ocorreu um erro inesperado. Tente novamente.";
}
