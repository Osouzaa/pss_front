import { api } from "../lib/axios";

export async function deletarPergunta(id_pergunta: string) {
  await api.delete(`/perguntas/${id_pergunta}`);
}
