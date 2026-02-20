import { api } from "../lib/axios";

export async function excluirOpcaoPergunta(params: { id_opcao: string }) {
  await api.delete(`/opcoes/${params.id_opcao}`);
}
