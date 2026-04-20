import { api } from "../lib/axios";

export type ProcessoStatus =
  | "RASCUNHO"
  | "ABERTO"
  | "EM_ANALISE"
  | "EM_ANDAMENTO"
  | "ENCERRADO";

export type PerguntaTipo =
  | "BOOLEAN"
  | "NUMERO"
  | "TEXTO"
  | "SELECT"
  | "EXPERIENCIA_DIAS"
  | "DATA"
  | "ANEXO";

export type NivelVaga = "MEDIO" | "SUPERIOR";

export interface VagaProcessoSeletivoResponse {
  id_vaga: string;
  id_processo_seletivo: string;
  nome: string;
  nivel: NivelVaga;
  quantidade_de_vagas: string; // backend retorna string
  data_criacao: string; // ISO
  data_atualizacao: string; // ISO
}

/** ===== OPÇÕES DE PERGUNTA ===== */

export interface PerguntaOpcaoResponse {
  id_opcao: string;
  id_pergunta: string;
  label: string;
  valor: string;
  pontos: number;
  valor_fundamental: number | null;
  valor_medio: number | null;
  valor_superior: number | null;
  ordem: number;
  ativa: boolean;
  data_criacao: string;
  data_atualizacao: string;
  exige_comprovante: boolean;
  label_comprovante: string;
}

/** ===== PERGUNTAS ===== */

export interface PerguntaProcessoResponse {
  id_pergunta: string;
  id_processo_seletivo: string;
  titulo: string;
  descricao: string | null;
  tipo: PerguntaTipo;
  obrigatoria: boolean;
  ordem: number;
  ativa: boolean;
  pontuacao_maxima: number | null;
  pontuacao_fundamental: number | null;
  pontuacao_medio: number | null;
  pontuacao_superior: number | null;
  regra_json: string | null;
  opcoes: PerguntaOpcaoResponse[];
  data_criacao: string;
  data_atualizacao: string;
}

export interface ProcessoSeletivoResponse {
  id_processo_seletivo: string;
  titulo: string;
  secretaria: string | null;
  ano: number;
  status: ProcessoStatus;
  data_inicio_inscricoes: string | null;
  data_fim_inscricoes: string | null;
  usa_classificacao: boolean;
  data_criacao: string;
  data_atualizacao: string;
  vagas: VagaProcessoSeletivoResponse[];
  perguntas: PerguntaProcessoResponse[];
}

export async function getProcessoId(id: string) {
  const response = await api.get<ProcessoSeletivoResponse>(
    `/processo-seletivo/${id}`,
  );
  return response.data;
}
