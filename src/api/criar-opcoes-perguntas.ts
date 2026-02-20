import { api } from "../lib/axios";

export type OpcaoFormData = {
  label: string;
  valor: string;

  // ✅ NOVOS CAMPOS
  valor_fundamental: number | null;
  valor_medio: number | null;
  valor_superior: number | null;

  ordem: number;
  ativa: boolean;
};

export async function criarOpcaoPergunta(params: {
  id_pergunta: string;
  payload: OpcaoFormData;
}) {
  const { id_pergunta, payload } = params;

  const response = await api.post(`/perguntas/${id_pergunta}/opcoes`, payload);

  return response.data;
}
