import { api } from "../lib/axios";

export type InscricaoStatus =
  | "RASCUNHO"
  | "ENVIADA"
  | "EM_ANALISE"
  | "DEFERIDA"
  | "INDEFERIDA";

type GetInscricoesMeParams = {
  page?: number;
  limit?: number;
  q?: string;
  status?: InscricaoStatus;
};
/** ===== VAGA ===== */
export interface VagaResponse {
  id_vaga: string;
  nome: string;
  // se vier mais campos depois, você pode expandir aqui
}

/** ===== INSCRIÇÃO ===== */
export interface MinhaInscricaoResponse {
  id_inscricao: string;
  id_processo_seletivo: string;
  id_vaga: string;
  data_criacao: string; // ISO
  data_envio: string | null; // ISO
  pontuacao_total: number;
  protocolo: string;
  status: "RASCUNHO" | "ENVIADA" | "CANCELADA";
  vaga: VagaResponse;
}

/** ===== PROCESSO SELETIVO ===== */
export interface ProcessoSeletivoResponse {
  id_processo_seletivo: string;
  titulo: string;
  secretaria: string;
  ano: number;

  status: "RASCUNHO" | "ABERTO" | "EM_ANALISE" | "ENCERRADO" | "CANCELADO";

  data_criacao: string; // ISO
  data_inicio_inscricoes: string | null;
  data_fim_inscricoes: string | null;

  minhas_inscricoes: MinhaInscricaoResponse[];
}

export async function getInscricoesMe() {
  const response = await api.get<ProcessoSeletivoResponse[]>(
    "/processo-seletivo/me",
    {},
  );

  return response.data;
}
