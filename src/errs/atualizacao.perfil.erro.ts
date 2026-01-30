import { AxiosError } from "axios";

type BackendErrorResponse = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

function normalizeBackendMessage(data: unknown): string | undefined {
  if (!data) return undefined;

  if (typeof data === "object" && data !== null) {
    const msg = (data as BackendErrorResponse).message;

    if (typeof msg === "string") return msg;
    if (Array.isArray(msg)) return msg.filter(Boolean).join("\n");
  }

  if (typeof data === "string") return data;

  return undefined;
}

export function atualizacaoPerfilError(error: unknown): string {
  if (!(error instanceof AxiosError)) {
    return "Ocorreu um erro inesperado. Tente novamente.";
  }

  if (!error.response) {
    return "Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.";
  }

  const status = error.response.status;
  const backendMsg = normalizeBackendMessage(error.response.data);

  switch (status) {
    case 400:
      return (
        "Não foi possível atualizar. Verifique os campos informados e tente novamente."
      );

    case 401:
      return (
        "Sua sessão expirou. Faça login novamente para continuar."
      );

    case 403:
      return (
        "Você não tem permissão para realizar essa ação."
      );

    case 404:
      return (
        "Cadastro não encontrado. Recarregue a página e tente novamente."
      );

    case 409:
      return (
        "CPF ou e-mail já cadastrado. Verifique os dados e tente novamente."
      );

    case 422:
      return (
        "Alguns dados são inválidos. Revise os campos e tente novamente."
      );

    case 429:
      return (
        "Muitas tentativas em pouco tempo. Aguarde um momento e tente novamente."
      );

    default:
      if (status >= 500) {
        return backendMsg ?? "Erro no servidor. Tente novamente mais tarde.";
      }

      return backendMsg ?? "Não foi possível atualizar o perfil. Tente novamente.";
  }
}
