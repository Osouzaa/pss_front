import { api } from "../lib/axios";

type EditarVagaPayload = {
  nome?: string;
  nivel?: "MEDIO" | "SUPERIOR";
  quantidade_de_vagas?: number;
};

export async function editarVaga(input: {
  id_vaga: string;
  payload: EditarVagaPayload;
}) {
  const response = await api.patch(`/processos-seletivos-vagas/${input.id_vaga}`, input.payload);
  return response.data;
}
