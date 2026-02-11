import { api } from "../lib/axios";

export interface ProcessoSeletivoVaga {
  id_vaga: string;
  id_processo_seletivo: string;
  nome: string;
  nivel: string;
  quantidade_de_vagas: number;
  data_criacao: string;
  data_atualizacao: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedVagasResponse {
  items: ProcessoSeletivoVaga[];
  meta: PaginationMeta;
}

export type GetVagasProcessoParams = {
  page?: number;
  limit?: number;
  q?: string;
};

export async function getAllVagasProcessoId(
  id_processo: string,
  params?: GetVagasProcessoParams,
): Promise<PaginatedVagasResponse> {
  const response = await api.get<PaginatedVagasResponse>(
    `/processos-seletivos-vagas/processo/${id_processo}/paged`,
    {
      params,
    },
  );

  return response.data;
}
