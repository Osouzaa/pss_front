import { api } from "../lib/axios";

export type ProcessoSeletivoStatus =
  | "RASCUNHO"
  | "ABERTO"
  | "EM_ANDAMENTO"
  | "ENCERRADO"
  | "PRORROGADO"
  | "CANCELADO";

export interface ProcessoSeletivo {
  id_processo_seletivo: string;

  titulo: string;
  ano: number;

  secretaria: string | null;

  status: ProcessoSeletivoStatus;

  data_inicio_inscricoes: string;
  data_fim_inscricoes: string;

  data_criacao: string;
  data_atualizacao: string;
}
export interface PaginationMeta {
  page: number;
  limit: number;
  pages: number;
  total: number;
}
export interface GetProcessosSeletivosResponse {
  items: ProcessoSeletivo[];
  meta: PaginationMeta;
}

interface GetAllProcessosParams {
  page?: number;
  limit?: number;
  q?: string;
  status?: string;
  ano?: number;
}

export async function getAllProcessos({
  limit,
  page,
  q,
  status,
  ano,
}: GetAllProcessosParams) {
  const response = await api.get<GetProcessosSeletivosResponse>('/processo-seletivo', {
    params: {
      limit,
      page,
      q: q || undefined,
      status: status || undefined,
      ano: ano || undefined,
    }
  })
  return response.data
}