import { api } from "../lib/axios";

export type InscricaoStatus = "RASCUNHO" | "ENVIADA" | "CANCELADA";

export type InscricaoRespostaResponse = {
  id_resposta: string;
  id_inscricao: string;
  id_pergunta: string;
  valor_boolean?: boolean | null;
  valor_numero?: number | null;
  valor_texto?: string | null;
  valor_data?: string | null; // pode vir ISO
  opcao_id?: string | null;
  pontos_calculados: number;
  data_criacao: string;
  data_atualizacao: string;
};

export type InscricaoMeResponse = {
  id_inscricao: string;
  id_processo_seletivo: string;
  id_usuario: string;
  id_vaga?: string | null;
  status: InscricaoStatus;
  pontuacao_total: number;
  data_envio?: string | null;
  respostas: InscricaoRespostaResponse[];
  data_criacao: string;
  data_atualizacao: string;
};

export type CreateInscricaoBody = {
  id_vaga?: string;
};

export async function createOrGetInscricaoDraft(
  idProcesso: string,
  body: CreateInscricaoBody,
) {
  const { data } = await api.post(
    `/processos_seletivos/${idProcesso}/inscricoes`,
    body,
  );
  return data as InscricaoMeResponse;
}
// ✅ Lista de inscrições do usuário (todas)
export type MinhaInscricaoListItem = {
  id_inscricao: string;
  id_processo_seletivo: string;
  id_vaga?: string | null;
  status: InscricaoStatus;
  pontuacao_total: number;
  data_envio?: string | null;
  data_criacao: string;
  data_atualizacao: string;

  // opcionais para render (recomendado backend trazer)
  processo?: {
    id_processo_seletivo: string;
    titulo?: string;
    ano?: number;
    status?: string;
  };

  vaga?: {
    id_vaga: string;
    nome?: string;
    nivel?: string;
  };
};

export type GetMinhasInscricoesParams = {
  page?: number;
  limit?: number;
  q?: string;
  status?: InscricaoStatus;
};

export type MinhasInscricoesResponse = {
  meta: { page: number; limit: number; total: number; pages: number };
  items: MinhaInscricaoListItem[];
};

export async function getMinhasInscricoes(params: GetMinhasInscricoesParams) {
  const { data } = await api.get(`/processos_seletivos/inscricoes/me`, {
    params,
  });
  return data as MinhasInscricoesResponse;
}

export type SalvarRespostasBody = {
  respostas: Array<
    | { id_pergunta: string; tipo: "BOOLEAN"; valor_boolean: boolean }
    | { id_pergunta: string; tipo: "NUMERO"; valor_numero?: number }
    | { id_pergunta: string; tipo: "TEXTO"; valor_texto?: string }
    | { id_pergunta: string; tipo: "DATA"; valor_data?: string }
    | { id_pergunta: string; tipo: "SELECT"; opcao_id?: string }
  >;
};

export async function getInscricaoMe(idProcesso: string) {
  const { data } = await api.get<InscricaoMeResponse | null>(
    `/processos_seletivos/${idProcesso}/inscricoes/me`,
  );
  return data;
}

export async function salvarRespostas(
  idProcesso: string,
  idInscricao: string,
  body: SalvarRespostasBody,
) {
  const { data } = await api.post(
    `/processos_seletivos/${idProcesso}/inscricoes/${idInscricao}/respostas`,
    body,
  );
  return data as { ok: true; pontuacao_total?: number };
}

export async function enviarInscricao(idProcesso: string, idInscricao: string) {
  const { data } = await api.post(
    `/processos_seletivos/${idProcesso}/inscricoes/${idInscricao}/enviar`,
    {},
  );
  return data as { ok: true; status: "ENVIADA"; pontuacao_total: number };
}
