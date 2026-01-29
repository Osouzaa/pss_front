import type {
  GetInscricaoByIdResponse,
  InscricaoRespostaResponse,
  InscricaoResponse,
} from "./types";

export function normalizeInscricaoResponse(
  input: unknown,
): GetInscricaoByIdResponse {
  const raw = input as Record<string, any>;
  const inscricaoRaw = raw?.inscricao ?? raw;

  const inscricao: InscricaoResponse = {
    id_inscricao: inscricaoRaw?.id_inscricao,
    id_processo_seletivo:
      inscricaoRaw?.id_processo_seletivo ?? raw?.id_processo_seletivo,
    id_vaga: inscricaoRaw?.id_vaga ?? null,
    status: inscricaoRaw?.status,
  };

  const respostasRaw = Array.isArray(inscricaoRaw?.respostas)
    ? inscricaoRaw.respostas
    : Array.isArray(raw?.respostas)
      ? raw.respostas
      : [];

  const respostas: InscricaoRespostaResponse[] = respostasRaw.map((r: any) => ({
    id_pergunta: r?.id_pergunta,
    opcao_id: r?.opcao_id ?? null,
    valor_boolean: r?.valor_boolean ?? null,
    valor_numero: r?.valor_numero ?? null,
    valor_texto: r?.valor_texto ?? null,
    valor_data: r?.valor_data ?? null,
  }));

  return { inscricao, respostas };
}
