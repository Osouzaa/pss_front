// src/pages/Inscricao/useVagasByProcesso.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/axios";

export type VagaOption = {
  id_vaga: string;
  nome: string;
  nivel: string; // NivelVaga
};

export function useVagasByProcesso(idProcesso: string) {
  return useQuery({
    queryKey: ["processo-seletivo-vagas", idProcesso],
    queryFn: async () => {
      const { data } = await api.get(
        `/processos-seletivos-vagas/processo/${idProcesso}`,
      );
      return data;
    },
    enabled: !!idProcesso,
  });
}
