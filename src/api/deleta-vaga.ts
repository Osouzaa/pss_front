import { api } from "../lib/axios";

export async function excluirVaga(params: { id_vaga: string }) {
  await api.delete(`/processos-seletivos-vagas/${params.id_vaga}`);
}
