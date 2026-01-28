import { api } from "../lib/axios";

type CriarNovaVagaPayload = {
  id_processo_seletivo: string;
  nome: string;
  nivel: "MEDIO" | "SUPERIOR";
  quantidade_de_vagas: number;
};

export async function criarNovaVaga(payload: CriarNovaVagaPayload) {
  const response = await api.post(
    "/processos-seletivos-vagas",
    payload
  );

  return response.data;
}
