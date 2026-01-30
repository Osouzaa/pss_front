import { api } from "../lib/axios";

export async function downloadDocumentoMe(id: string) {
  const res = await api.get(
    `/processo-seletivo-candidatos/me/documentos/${id}/download`,
    { responseType: "blob" }
  );

  return res.data as Blob;
}