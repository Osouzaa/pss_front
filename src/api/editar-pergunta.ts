import { api } from "../lib/axios";

type Payload = Partial<{
  titulo: string;
  descricao: string | null;
  tipo: "BOOLEAN" | "NUMERO" | "TEXTO" | "SELECT" | "MULTISELECT" | "DATA";
  obrigatoria: boolean;
  ordem: number;
  ativa: boolean;
  regra_json: string | null;
}>;

export async function editarPergunta(input: {
  id_pergunta: string;
  payload: Payload;
}) {
  const { id_pergunta, payload } = input;

  const { data } = await api.patch(`/perguntas/${id_pergunta}`, payload);
  return data;
}
