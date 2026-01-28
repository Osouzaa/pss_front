import { api } from "../lib/axios";

interface IGetAllAnswers {
  id_pergunta: string;
  id_processo_seletivo: string;
  titulo: string;
  descrição: string;
  tipo: "BOOLEAN" | "NUMERO" | "TEXTO" | "SELECT" | "MULTISELECT" | "DATA";
  obrigatoria: boolean;
  orderm: number;
  ativa: boolean;
  pontuacao_maxima: string | null;
  opcoes: [];
  data_criacao: string;
  data_atualizacao: string;
}

export async function buscarPerguntasProcessos(id_processo: string) {
  const response = await api.get<IGetAllAnswers[]>(
    `/processos_seletivos/${id_processo}/perguntas`,
  );
  return response.data;
}
