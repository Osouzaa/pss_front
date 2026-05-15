import { api } from "../lib/axios";

export async function deletarInscricao(idInscricao: string) {
  const response = await api.delete(
    `/processos-seletivos-inscricoes/${idInscricao}`,
  );

  return response.data;
}
