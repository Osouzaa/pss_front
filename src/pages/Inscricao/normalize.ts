// src/pages/Inscricao/normalize.ts
import type {
  GetInscricaoByIdResponse,
  InscricaoRespostaResponse,
  InscricaoResponse,
} from "./types";

function coerceBoolean(v: unknown): boolean | null {
  if (v === null || v === undefined) return null;

  // já é boolean
  if (typeof v === "boolean") return v;

  // números 0/1 (ou outros)
  if (typeof v === "number") {
    if (v === 1) return true;
    if (v === 0) return false;
    return null;
  }

  // strings "true"/"false" e "1"/"0"
  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    if (s === "true" || s === "1") return true;
    if (s === "false" || s === "0") return false;
    return null;
  }

  return null;
}

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
    valor_boolean: coerceBoolean(r?.valor_boolean),
    valor_numero: r?.valor_numero ?? null,
    valor_texto: r?.valor_texto ?? null,
    valor_data: r?.valor_data ?? null,
  }));

  return { inscricao, respostas };
}
