import { api } from "../lib/axios";

export interface TipoDocumento {
  id_tipo_documento: string;
  nome: string;
  descricao: string | null;
  ativo: boolean;
  data_criacao: string;
  data_atualizacao: string;
}

export async function getTiposDocumento(apenasAtivos = false): Promise<TipoDocumento[]> {
  const { data } = await api.get<TipoDocumento[]>("/tipo-documento", {
    params: apenasAtivos ? { ativos: "true" } : undefined,
  });
  return data;
}

export async function criarTipoDocumento(payload: {
  nome: string;
  descricao?: string;
}): Promise<TipoDocumento> {
  const { data } = await api.post<TipoDocumento>("/tipo-documento", payload);
  return data;
}

export async function atualizarTipoDocumento(
  id: string,
  payload: { nome?: string; descricao?: string; ativo?: boolean },
): Promise<TipoDocumento> {
  const { data } = await api.patch<TipoDocumento>(`/tipo-documento/${id}`, payload);
  return data;
}

export async function removerTipoDocumento(id: string): Promise<void> {
  await api.delete(`/tipo-documento/${id}`);
}
