import { api } from "../lib/axios";

export type DocumentoTipo =
  | "COMPROVANTE_ENDERECO"
  | "CPF"
  | "DIPLOMA"
  | "ENSINO_SUPERIOR"
  | "MESTRADO"
  | "DOUTORADO"
  | "CURSO"
  | "EXPERIENCIA_PROFISSIONAL"
  | "OUTROS";

type UploadDocumentoMeInput = {
  file: File;
  tipo: DocumentoTipo;
  descricao?: string;
};

export async function uploadDocumentoMe(input: UploadDocumentoMeInput) {
  const form = new FormData();
  form.append("file", input.file);
  form.append("tipo", input.tipo);
  if (input.descricao) form.append("descricao", input.descricao);

  const res = await api.post(
    "/processo-seletivo-candidatos/me/documentos",
    form,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return res.data;
}
