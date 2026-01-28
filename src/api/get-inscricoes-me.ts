import { api } from "../lib/axios";

export type InscricaoStatus =
  | "RASCUNHO"
  | "ENVIADA"
  | "EM_ANALISE"
  | "DEFERIDA"
  | "INDEFERIDA";

type GetInscricoesMeParams = {
  page?: number;
  limit?: number;
  q?: string;
  status?: InscricaoStatus;
};

export async function getInscricoesMe(params?: GetInscricoesMeParams) {
  const response = await api.get("/processos-seletivos/inscricoes/me", {
    params: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
      q: params?.q,
      status: params?.status,
    },
  });

  return response.data;
}
