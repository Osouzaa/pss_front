import { AxiosError } from "axios";

type BackendErrorResponse = {
  message?: string;
  code?: string;
};

export function handleConfirmEmailError(error: unknown): string {
  if (!(error instanceof AxiosError)) {
    return "Erro inesperado. Verifique sua conexão e tente novamente.";
  }

  const status = error.response?.status;
  const data = error.response?.data as BackendErrorResponse | undefined;

  // prioridade total para mensagem do backend (quando existir)
  if (data?.message) {
    return data.message;
  }

  switch (status) {
    case 400:
      return "Token inválido. Verifique o link ou copie o token novamente.";

    case 401:
      return "Este link de confirmação não é válido ou já foi utilizado.";

    case 403:
      return "Este e-mail já foi confirmado. Você já pode fazer login.";

    case 404:
      return "Token não encontrado. Solicite um novo e-mail de confirmação.";

    case 409:
      return "Este token já foi utilizado ou está inválido.";

    case 410:
      return "Este link expirou. Solicite um novo e-mail de confirmação.";

    case 422:
      return "Não foi possível validar o token. Solicite um novo e-mail.";

    case 500:
      return "Erro interno no servidor. Tente novamente em alguns minutos.";

    default:
      return "Não foi possível confirmar seu e-mail. Tente novamente.";
  }
}
