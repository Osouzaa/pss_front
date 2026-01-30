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

export function editProcessoError(error: unknown): string {
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
      return "Não foi possível salvar as alterações. Verifique os campos e tente novamente.";

    case 401:
      return "Sua sessão expirou. Faça login novamente para continuar.";

    case 403:
      return "Apenas administradores podem editar um processo seletivo.";

    case 404:
      // Ex: processo não encontrado (findOne)
      return "Processo seletivo não encontrado. Recarregue a página e tente novamente.";

    case 409:
      // duplicidade titulo + ano
      return "Já existe um processo seletivo com esse título e ano.";

    case 422:
      return "Alguns dados são inválidos. Revise os campos e tente novamente.";

    case 429:
      return "Muitas tentativas em pouco tempo. Aguarde um momento e tente novamente.";

    default:
      if (status >= 500) {
        return "Erro no servidor ao editar o processo seletivo. Tente novamente mais tarde.";
      }

      return (
        backendMsg ??
        "Não foi possível editar o processo seletivo. Tente novamente."
      );
  }
}
