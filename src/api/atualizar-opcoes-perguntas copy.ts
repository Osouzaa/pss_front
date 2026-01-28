import type { DeepPartial } from "react-hook-form";
import { api } from "../lib/axios";

export type OpcaoFormData = {
  label: string;
  valor: string;
  ordem: number;
  ativa: boolean;
};

export async function atualizarOpcaoPergunta(params: {
  id_opcao: string;
  payload: DeepPartial<OpcaoFormData>;
}) {
  const { id_opcao, payload } = params;

  const response = await api.patch(`/opcoes/${id_opcao}`, payload);

  return response.data;
}
