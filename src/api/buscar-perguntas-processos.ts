import { api } from "../lib/axios";

// ===== OPÇÃO DA PERGUNTA =====
export interface IPerguntaOpcao {
  id_opcao: string;
  id_pergunta: string;
  titulo: string;
  valor: string;
  pontuacao: number | null;
  ordem: number;
  data_criacao: string;
  data_atualizacao: string;
}

// ===== PERGUNTA =====
export interface IGetAllAnswers {
  id_pergunta: string;
  id_processo_seletivo: string;

  titulo: string;
  descricao: string; // ⚠ corrigi o nome (sem acento)
  tipo: "BOOLEAN" | "NUMERO" | "TEXTO" | "SELECT" | "MULTISELECT" | "DATA";

  obrigatoria: boolean;
  ordem: number; // ⚠ corrigido (ordem)
  ativa: boolean;

  pontuacao_maxima: string | null;

  opcoes: IPerguntaOpcao[];

  data_criacao: string;
  data_atualizacao: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type BuscarPerguntasProcessoResponse = PaginatedResponse<IGetAllAnswers>;

export type BuscarPerguntasProcessoParams = {
  page?: number;
  limit?: number;
};

export async function buscarPerguntasProcessos(
  id_processo: string,
  params?: BuscarPerguntasProcessoParams,
): Promise<BuscarPerguntasProcessoResponse> {
  const response = await api.get<BuscarPerguntasProcessoResponse>(
    `/processos_seletivos/${id_processo}/perguntas`,
    {
      params: {
        page: params?.page ?? 1,
        limit: params?.limit ?? 20,
      },
    },
  );

  return response.data;
}
