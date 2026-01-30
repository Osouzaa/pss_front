import { api } from "../lib/axios";

export type PerguntaTipo =
  | "BOOLEAN"
  | "NUMERO"
  | "TEXTO"
  | "SELECT"
  | "MULTISELECT"
  | "DATA"
  | "EXPERIENCIA_DIAS"; // ✅ novo

type Payload = {
  titulo: string;
  descricao?: string | null;
  tipo: PerguntaTipo;
  obrigatoria?: boolean;
  ordem?: number;
  ativa?: boolean;

  pontuacao_fundamental?: number | null;
  pontuacao_medio?: number | null;
  pontuacao_superior?: number | null;

  regra_json?: string | null;
};

export async function criarPergunta(input: {
  id_processo_seletivo: string;
  payload: Payload;
}) {
  const { id_processo_seletivo, payload } = input;

  const { data } = await api.post(
    `/processos_seletivos/${id_processo_seletivo}/perguntas`,
    payload,
  );

  return data;
}
