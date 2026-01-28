import { api } from "../lib/axios";

export async function excluirOpcaoPergunta(params: { id_opcao: string }) {
  await api.post(`/perguntas/${params.id_opcao}/opcoes`);
}
