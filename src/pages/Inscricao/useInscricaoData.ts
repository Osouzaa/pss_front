import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getProcessoId,
  type ProcessoSeletivoResponse,
} from "../../api/get-processo-id";
import { getInscricaoById } from "../../api/get-inscricao-by-id";
import type { GetInscricaoByIdResponse } from "./types";
import { normalizeInscricaoResponse } from "./normalize";

export function useInscricaoData(params: {
  idProcesso: string;
  idInscricao: string;
}) {
  const { idProcesso, idInscricao } = params;

  const processoQuery = useQuery<ProcessoSeletivoResponse>({
    queryKey: ["processo-id", idProcesso],
    queryFn: () => {
      if (!idProcesso) throw new Error("Processo inválido");
      return getProcessoId(idProcesso);
    },
    enabled: !!idProcesso,
    staleTime: 60_000,
  });

  const processo = processoQuery.data;

  const vagas = useMemo(() => {
    const list = processo?.vagas ?? [];
    return list.slice().sort((a, b) => a.nome.localeCompare(b.nome));
  }, [processo?.vagas]);

  const perguntas = useMemo(() => {
    const list = processo?.perguntas ?? [];
    return list
      .filter((p) => p.ativa)
      .slice()
      .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));
  }, [processo?.perguntas]);

  const inscricaoQuery = useQuery<GetInscricaoByIdResponse>({
    queryKey: ["inscricao", idProcesso, idInscricao],
    queryFn: async () =>
      normalizeInscricaoResponse(
        await getInscricaoById(idProcesso, idInscricao),
      ),
    enabled: !!idProcesso && !!idInscricao,
  });

  return {
    processoQuery,
    inscricaoQuery,
    processo,
    vagas,
    perguntas,
  };
}
