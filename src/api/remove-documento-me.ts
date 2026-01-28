// src/api/documentos.types.ts
export type DocumentoTipo =
  | "COMPROVANTE_ENDERECO"
  | "CPF"
  | "DIPLOMA"
  | "ENSINO_SUPERIOR"
  | "MESTRADO"
  | "DOUTORADO"
  | "CURSO"
  | "OUTROS";

export type ArquivoDTO = {
  id_arquivo: string;
  nome_original: string;
  mime_type: string | null;
  tamanho_bytes: number;
  storage_key: string;
  url_publica: string | null;
  data_criacao: string;
};

export type CandidatoDocumentoDTO = {
  id_candidato_documento: string;
  tipo: DocumentoTipo;
  status: "ATIVO" | "SUBSTITUIDO" | "REMOVIDO";
  descricao: string | null;
  data_criacao: string;
  arquivo: ArquivoDTO;
};


import { api } from "../lib/axios";

export async function removeDocumentoMe(id: string) {
  const res = await api.delete(
    `/processo-seletivo-candidatos/me/documentos/${id}`
  );
  return res.data;
}
