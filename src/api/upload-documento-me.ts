import { api } from "../lib/axios";

type UploadDocumentoMeInput = {
  file: File;
  tipo: string;
  descricao?: string;
};

export async function uploadDocumentoMe(input: UploadDocumentoMeInput) {
  const form = new FormData();
  form.append("file", input.file);
  form.append("tipo", input.tipo);
  if (input.descricao) form.append("descricao", input.descricao);

  // axios já detecta multipart/form-data com FormData, sem precisar setar boundary manualmente.
  const res = await api.post(
    "/processo-seletivo-candidatos/me/documentos",
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );

  return res.data;
}