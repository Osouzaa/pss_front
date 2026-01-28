// src/api/get-documentos-me.ts
import { api } from "../lib/axios";
import type { CandidatoDocumentoDTO } from "./remove-documento-me";

export async function getDocumentosMe() {
  const res = await api.get<CandidatoDocumentoDTO[]>(
    "/processo-seletivo-candidatos/me/documentos"
  );
  return res.data;
}
