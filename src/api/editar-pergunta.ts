import { api } from "../lib/axios";

export type PerguntaTipo =
  | "BOOLEAN"
  | "NUMERO"
  | "TEXTO"
  | "SELECT"
  | "MULTISELECT"
  | "DATA"
  | "EXPERIENCIA_DIAS";

type Payload = Partial<{
  titulo: string;
  descricao: string | null;
  tipo: PerguntaTipo;
  obrigatoria: boolean;
  ordem: number;
  ativa: boolean;

  pontuacao_fundamental: number | null;
  pontuacao_medio: number | null;
  pontuacao_superior: number | null;
  pontuacao_maxima: number | null;

  exige_comprovante: boolean;
  label_comprovante: string | null;

  // ✅ ESSENCIAL pro EXPERIENCIA_DIAS
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
