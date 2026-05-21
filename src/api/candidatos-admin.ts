import { api } from "../lib/axios";

export type CandidatoAdmin = {
  id_candidato: string;
  id_usuario: string;
  nome_completo: string;
  cpf: string;
  email: string;
  telefone: string;
  data_nascimento: string | null;
  cidade: string | null;
  uf: string | null;
  data_criacao: string;
  data_atualizacao: string;
  inscricoes_count: number;
};

export type ListarCandidatosParams = {
  page: number;
  limit: number;
  q?: string;
  nome?: string;
  email?: string;
  cpf?: string;
  cidade?: string;
  uf?: string;
};

export type ListarCandidatosResponse = {
  page: number;
  limit: number;
  total: number;
  items: CandidatoAdmin[];
};

export async function listarCandidatosAdmin(params: ListarCandidatosParams) {
  const response = await api.get<ListarCandidatosResponse>(
    "/processo-seletivo-candidatos",
    { params },
  );

  return response.data;
}

export async function removerCandidatoAdmin(id: string) {
  const response = await api.delete<{ ok: boolean; inscricoes_count: number }>(
    `/processo-seletivo-candidatos/${id}`,
  );

  return response.data;
}
