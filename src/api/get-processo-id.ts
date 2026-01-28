import { api } from "../lib/axios";

/** ===== ENUMS ===== */

export type ProcessoStatus =
  | "RASCUNHO"
  | "ABERTO"
  | "EM_ANALISE"
  | "EM_ANDAMENTO"
  | "ENCERRADO"
  | "CANCELADO";

export type PerguntaTipo =
  | "BOOLEAN"
  | "NUMERO"
  | "TEXTO"
  | "SELECT"
  | "MULTISELECT"
  | "DATA";

export type NivelVaga = "MEDIO" | "SUPERIOR";

/** ===== VAGAS ===== */

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
  ordem: number;
  ativa: boolean;
  data_criacao: string; // ISO
  data_atualizacao: string; // ISO
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
  opcoes: PerguntaOpcaoResponse[];
  data_criacao: string; // ISO
  data_atualizacao: string; // ISO
}

/** ===== PROCESSO SELETIVO ===== */

export interface ProcessoSeletivoResponse {
  id_processo_seletivo: string;
  titulo: string;
  secretaria: string | null;
  ano: number;
  status: ProcessoStatus;
  data_inicio_inscricoes: string | null; // ISO | null
  data_fim_inscricoes: string | null; // ISO | null
  data_criacao: string; // ISO
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
