import { api } from "../lib/axios";

export type UsuarioTipo = "CANDIDATO" | "ADMIN" | "AVALIADOR";

export type ProcessoSeletivoCandidatoDTO = {
  id_candidato: string;
  id_usuario: string;

  nome_completo: string;
  cpf: string;
  email: string;
  telefone: string;

  rg: string | null;

  data_nascimento: string | null; // "YYYY-MM-DD" (veio assim no seu payload)

  // Endereço
  cep: string | null;
  logradouro: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  uf: string | null;

  data_criacao: string; // ISO
  data_atualizacao: string; // ISO
};

export type UsuarioComCandidatoDTO = {
  id_usuario: string;
  email: string;

  tipo: UsuarioTipo;
  ativo: boolean;
  fl_primeiro_acesso: boolean;

  id_candidato: string | null; // no seu retorno veio null (porque você tá mudando o vínculo)
  candidato: ProcessoSeletivoCandidatoDTO;

  ultimo_login: string | null; // ISO
  data_criacao: string; // ISO
  data_atualizacao: string; // ISO

  senha_hash?: string;
};

export async function getMe() {
  const response = await api.get<UsuarioComCandidatoDTO>("/auth/me");
  return response.data;
}