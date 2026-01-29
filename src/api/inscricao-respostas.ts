import { api } from "../lib/axios";

export type InscricaoRespostaResponse = {
  id_resposta: string;
  id_inscricao: string;
  id_pergunta: string;
  valor_boolean?: boolean | null;
  valor_numero?: number | null;
  valor_texto?: string | null;
  valor_data?: string | null;
  opcao_id?: string | null;
};

export async function getRespostasByInscricao(idInscricao: string) {
  const { data } = await api.get<InscricaoRespostaResponse[]>(
    `/processo-seletivo-inscricoes/${idInscricao}/respostas`,
  );
  return data;
}
