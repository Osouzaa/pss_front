import { api } from "../lib/axios";

export async function getInscricaoById(
  id_processo_seletivo: string,
  id_inscricao: string,
) {
  const { data } = await api.get(
    `/processo-seletivo/${id_processo_seletivo}/inscricao/${id_inscricao}`,
  );
  return data;
}
