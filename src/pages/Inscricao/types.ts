export type AnswerValue = boolean | number | string | null;
export type RespostasState = Record<string, AnswerValue>;

export type InscricaoStatus = "RASCUNHO" | "ENVIADA" | "CANCELADA" | string;

export type InscricaoResponse = {
  id_inscricao: string;
  id_processo_seletivo: string;
  id_vaga?: string | null;
  status?: InscricaoStatus;
};

export type InscricaoRespostaResponse = {
  id_pergunta: string;
  opcao_id?: string | null;
  valor_boolean?: boolean | null;
  valor_numero?: number | null;
  valor_texto?: string | null;
  valor_data?: string | null;
};

export type GetInscricaoByIdResponse = {
  inscricao: InscricaoResponse;
  respostas: InscricaoRespostaResponse[];
};
