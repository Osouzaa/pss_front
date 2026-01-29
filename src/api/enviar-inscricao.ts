import { api } from "../lib/axios";

export type EnviarInscricaoBody = {
  id_vaga: string;
};

export type EnviarInscricaoResponse = {
  ok: true;
  status: "ENVIADA";
  pontuacao_total: number;
};

export async function enviarInscricaoTwo(idInscricao: string) {
  const { data } = await api.post<EnviarInscricaoResponse>(
    `/processos-seletivos-inscricoes/${idInscricao}/enviar`,
  );
  return data;
}
