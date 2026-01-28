import { api } from "../lib/axios";

type Payload = {
  titulo: string;
  descricao?: string | null;
  tipo: "BOOLEAN" | "NUMERO" | "TEXTO" | "SELECT" | "MULTISELECT" | "DATA";
  obrigatoria?: boolean;
  ordem?: number;
  ativa?: boolean;
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
