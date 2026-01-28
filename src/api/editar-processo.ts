import { api } from "../lib/axios";

type EditarProcessoPayload = {
  titulo?: string;
  secretaria?: string;
  ano?: number;
  status?: "RASCUNHO" | "ABERTO" | "ENCERRADO" | "EM_ANALISE";
  data_inicio_inscricoes?: string; // YYYY-MM-DD
  data_fim_inscricoes?: string; // YYYY-MM-DD
};

export async function editarProcesso(input: {
  id_processo_seletivo: string;
  payload: EditarProcessoPayload;
}) {
  const response = await api.patch(
    `/processo-seletivo/${input.id_processo_seletivo}`,
    input.payload
  );
  return response.data;
}
