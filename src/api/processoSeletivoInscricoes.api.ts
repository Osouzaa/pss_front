import { api } from "../lib/axios";

export type InscricaoStatus =
  | "RASCUNHO"
  | "ENVIADA"
  | "EM_ANALISE"
  | "DEFERIDA"
  | "INDEFERIDA";

export type ProcessoSeletivoInscricao = {
  id_inscricao: string;
  numero_inscricao: string;

  id_processo_seletivo: string;
  id_candidato: string;

  // ✅ NOVO
  id_vaga: string;

  // snapshot/compatibilidade
  cargo_funcao: string;

  pontuacao_total: number;
  status: InscricaoStatus;
  avaliado: boolean;
  observacao?: string | null;

  possui_ensino_fundamental?: boolean | null;
  possui_ensino_medio?: boolean | null;
  possui_ensino_superior?: boolean | null;
  quantidade_ensino_superior?: number | null;

  possui_curso_area_educacao?: boolean | null;
  quantidade_curso_area_educacao?: number | null;

  possui_especializacao?: boolean | null;
  quantidade_especializacao?: number | null;

  possui_mestrado?: boolean | null;
  possui_doutorado?: boolean | null;

  tempo_experiencia_dias?: number | null;
  total_dias_experiencia?: number | null;

  data_criacao: string;
  data_atualizacao: string;
};

export type CreateInscricaoDTO = {
  // ✅ NOVO (obrigatório agora)
  id_vaga: string;

  // snapshot/compatibilidade (backend pode sobrescrever pela vaga.nome)
  cargo_funcao?: string;

  possui_ensino_fundamental?: boolean;
  possui_ensino_medio?: boolean;
  possui_ensino_superior?: boolean;
  quantidade_ensino_superior?: number;

  possui_curso_area_educacao?: boolean;
  quantidade_curso_area_educacao?: number;

  possui_especializacao?: boolean;
  quantidade_especializacao?: number;

  possui_mestrado?: boolean;
  possui_doutorado?: boolean;

  tempo_experiencia_meses?: number;

  observacao?: string; // no front, use "" ao invés de null
};

// ✅ agora precisa de idVaga para enviar ?vaga=
export async function getInscricaoMe(idProcesso: string, idVaga: string) {
  const { data } = await api.get<ProcessoSeletivoInscricao>(
    `/processos-seletivos/${idProcesso}/inscricoes/me`,
    {
      params: { vaga: idVaga },
    },
  );
  return data;
}

export async function createInscricaoMe(
  idProcesso: string,
  payload: CreateInscricaoDTO,
) {
  const { data } = await api.post<ProcessoSeletivoInscricao>(
    `/processos-seletivos/${idProcesso}/inscricoes/me`,
    payload,
  );
  return data;
}

// ✅ update precisa mandar ?vaga=
export async function updateInscricaoMe(
  idProcesso: string,
  idVaga: string,
  payload: Partial<CreateInscricaoDTO>,
) {
  const { data } = await api.patch<ProcessoSeletivoInscricao>(
    `/processos-seletivos/${idProcesso}/inscricoes/me`,
    payload,
    {
      params: { vaga: idVaga },
    },
  );
  return data;
}

// ✅ enviar precisa mandar ?vaga=
export async function enviarInscricaoMe(idProcesso: string, idVaga: string) {
  const { data } = await api.post<ProcessoSeletivoInscricao>(
    `/processos-seletivos/${idProcesso}/inscricoes/me/enviar`,
    null,
    {
      params: { vaga: idVaga },
    },
  );
  return data;
}
