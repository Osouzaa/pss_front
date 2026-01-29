import { api } from "../lib/axios";

export type SalvarRespostasBody = {
  respostas: Array<{
    id_pergunta: string;
    valor_boolean?: boolean | null;
    valor_numero?: number | null;
    valor_texto?: string | null;
    valor_data?: string | null;
    opcao_id?: string | null;
  }>;
};

export async function salvarRespostasLote(
  idInscricao: string,
  body: SalvarRespostasBody,
) {
  const { data } = await api.post(
    `/processo-seletivo-inscricoes/${idInscricao}/respostas`,
    body,
  );
  return data;
}
