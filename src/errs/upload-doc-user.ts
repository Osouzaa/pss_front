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

export function uploadDocUser(error: unknown): string {
  // erro que não é axios
  if (!(error instanceof AxiosError)) {
    return "Ocorreu um erro inesperado ao enviar o arquivo. Tente novamente.";
  }

  // sem response => rede / servidor fora
  if (!error.response) {
    return "Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.";
  }

  const status = error.response.status;
  const backendMsg = normalizeBackendMessage(error.response.data);

  // ✅ se o backend mandou mensagem, use (ex.: "Formato inválido", "Arquivo muito grande", "Limite atingido"...)
  // mas só para casos comuns, para 5xx ainda mantemos fallback abaixo
  switch (status) {
    case 400:
      return (
        backendMsg ??
        "Não foi possível enviar o arquivo. Verifique o tipo e o tamanho e tente novamente."
      );

    case 401:
      return backendMsg ?? "Sua sessão expirou. Faça login novamente para continuar.";

    case 403:
      return backendMsg ?? "Você não tem permissão para enviar documentos.";

    case 404:
      return backendMsg ?? "Cadastro não encontrado. Recarregue a página e tente novamente.";

    case 409:
      // normalmente não acontece em upload, mas se acontecer:
      return backendMsg ?? "Conflito ao salvar o documento. Tente novamente.";

    case 413:
      return backendMsg ?? "Arquivo muito grande. O limite é 10MB.";

    case 415:
      return backendMsg ?? "Formato inválido. Envie PDF, PNG ou JPG.";

    case 422:
      return backendMsg ?? "Dados inválidos. Revise as informações e tente novamente.";

    case 429:
      return backendMsg ?? "Muitas tentativas em pouco tempo. Aguarde e tente novamente.";

    default:
      if (status >= 500) {
        return backendMsg ?? "Erro no servidor ao enviar o arquivo. Tente novamente mais tarde.";
      }

      return backendMsg ?? "Não foi possível enviar o arquivo. Tente novamente.";
  }
}
