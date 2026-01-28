import { api } from "../lib/axios";

export interface VagaProcessoSeletivoResponse {
  id_vaga: string;
  id_processo_seletivo: string;
  nome: string;
  nivel: "MEDIO" | "SUPERIOR";
  quantidade_de_vagas: string; // veio como string no backend
  data_criacao: string;        // ISO
  data_atualizacao: string;    // ISO
}

export interface ProcessoSeletivoResponse {
  id_processo_seletivo: string;
  titulo: string;
  secretaria: string;
  ano: number;
  status: "RASCUNHO" | "ABERTO" | "FECHADO";
  data_inicio_inscricoes: string; // ISO
  data_fim_inscricoes: string;    // ISO
  data_criacao: string;           // ISO
  data_atualizacao: string;       // ISO
  vagas: VagaProcessoSeletivoResponse[];
}

export async function getProcessoId(id: string) {
  const response = await api.get<ProcessoSeletivoResponse>(`/processo-seletivo/${id}`)
  return response.data
}