// ======== INSCRIÇÕES (RESPOSTA DA API) ========

import { api } from "../lib/axios";

export type InscricaoStatus = "RASCUNHO" | "ENVIADA";

export interface CandidatoInscricao {
  id_candidato: string;
  nome_completo: string;
  cpf: string;
  email: string;
  telefone: string;

  rg: string | null;
  data_nascimento: string; // yyyy-mm-dd

  cep: string;
  logradouro: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  cidade: string;
  uf: string;

  id_usuario: string;

  data_criacao: string; // ISO
  data_atualizacao: string; // ISO
}

export interface UsuarioInscricao {
  id_usuario: string;
  nome_completo: string | null; // às vezes vem "" ou null
  email: string;
  senha_hash: string;

  tipo: "CANDIDATO" | "ADMIN" | string;
  ativo: boolean;

  secretaria_usuario: string | null; // às vezes vem "" ou null
  fl_primeiro_acesso: boolean;

  id_candidato: string | null;
  candidato: CandidatoInscricao | null;

  ultimo_login: string | null; // ISO
  email_verificado: boolean;
  email_verificado_em: string | null; // ISO

  email_verificacao_token_hash: string | null;
  email_verificacao_expira_em: string | null; // ISO

  reset_senha_token_hash: string | null;
  reset_senha_expira_em: string | null; // ISO
  reset_senha_usado_em: string | null; // ISO

  data_criacao: string; // ISO
  data_atualizacao: string; // ISO
}

export interface VagaInscricao {
  id_vaga: string;
  id_processo_seletivo: string;
  nome: string;
  nivel: "SUPERIOR" | "MEDIO" | "FUNDAMENTAL" | string;
  quantidade_de_vagas: number;
  data_criacao: string; // ISO
  data_atualizacao: string; // ISO
}

export type PerguntaPontuacaoTipo =
  | "BOOLEAN"
  | "TEXT"
  | "NUMBER"
  | "SELECT"
  | "MULTISELECT"
  | string;

export interface PontuacaoDetalheItem {
  id_pergunta: string;
  titulo: string;
  tipo: PerguntaPontuacaoTipo;
  pontos: number;
}

export interface Inscricao {
  id_inscricao: string;
  id_processo_seletivo: string;

  usuario: UsuarioInscricao;
  id_usuario: string;

  vaga: VagaInscricao;
  id_vaga: string;

  status: InscricaoStatus;
  protocolo: string;

  pontuacao_total: number;

  // vem string JSON ou null (se quiser depois eu te mando helper pra parsear)
  pontuacao_detalhe_json: string | null;

  data_envio: string | null; // ISO
  observacao: string | null;

  data_criacao: string; // ISO
  data_atualizacao: string; // ISO
}

export type GetAllInscricoesByProcessoIdResponse = Inscricao[];

export async function getAllInscricoesByProcessoId(
  id_processo: string,
): Promise<GetAllInscricoesByProcessoIdResponse> {
  const response = await api.get<GetAllInscricoesByProcessoIdResponse>(
    `/processos-seletivos-inscricoes/all/${id_processo}`,
  );

  return response.data;
}
