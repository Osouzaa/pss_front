import { api } from "../lib/axios";

// =======================
// Processo Seletivo (GET by id)
// =======================

export type ProcessoStatus = "RASCUNHO" | "ABERTO" | "EM_ANALISE" | "ENCERRADO";

export type VagaNivel = "FUNDAMENTAL" | "MEDIO" | "SUPERIOR";

export type PerguntaTipo =
  | "BOOLEAN"
  | "NUMERO"
  | "TEXTO"
  | "SELECT"
  | "MULTISELECT"
  | "DATA"
  | "EXPERIENCIA_DIAS";

export interface ProcessoSeletivoDTO {
  id_processo_seletivo: string;
  titulo: string;
  secretaria: string;
  ano: number;
  status: ProcessoStatus;

  data_inicio_inscricoes: string | null; // ISO
  data_fim_inscricoes: string | null; // ISO

  criado_por_id: string | null;
  criado_por_nome: string | null;

  data_criacao: string; // ISO
  data_atualizacao: string; // ISO

  vagas: ProcessoSeletivoVagaDTO[];
  perguntas: ProcessoSeletivoPerguntaDTO[];
}

// =======================
// Vagas
// =======================

export interface ProcessoSeletivoVagaDTO {
  id_vaga: string;
  id_processo_seletivo: string;

  nome: string;
  nivel: VagaNivel;

  quantidade_de_vagas: number;

  data_criacao: string; // ISO
  data_atualizacao: string; // ISO
}

// =======================
// Perguntas + Opções
// =======================

export interface ProcessoSeletivoPerguntaDTO {
  id_pergunta: string;
  id_processo_seletivo: string;

  titulo: string;
  descricao: string | null;

  tipo: PerguntaTipo;
  obrigatoria: boolean;

  ordem: number;
  ativa: boolean;

  pontuacao_fundamental: number | null;
  pontuacao_medio: number | null;
  pontuacao_superior: number | null;

  /**
   * Vem como string JSON do backend (como no seu exemplo).
   * Se você quiser, pode transformar em objeto no front com JSON.parse.
   */
  regra_json: string | null;

  opcoes: ProcessoSeletivoPerguntaOpcaoDTO[];

  data_criacao: string; // ISO
  data_atualizacao: string; // ISO
}

export interface ProcessoSeletivoPerguntaOpcaoDTO {
  id_opcao: string;
  id_pergunta: string;

  label: string;
  valor: string; // ex: "SUPERIOR" (pode ser qualquer string dependendo da pergunta)
  pontos: number;

  ordem: number;
  ativa: boolean;

  data_criacao: string; // ISO
  data_atualizacao: string; // ISO
}

// =======================
// Inscrições (Tabela)
// =======================

export interface InscricaoTabelaDTO {
  id_inscricao: string;

  nome: string; // nome do candidato
  data_inscricao: string; // ISO

  vaga: {
    id_vaga: string;
    nome: string;
  };

  pontuacao_total: number;
}

// =======================
// API
// =======================

export async function getInscricoesProcessos(
  id_processo: string,
): Promise<InscricaoTabelaDTO[]> {
  const response = await api.get<InscricaoTabelaDTO[]>(
    `/processo-seletivo/${id_processo}/inscricoes`,
  );

  return response.data;
}
