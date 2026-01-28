import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import {
  createInscricaoMe,
  enviarInscricaoMe,
  getInscricaoMe,
  updateInscricaoMe,
  type CreateInscricaoDTO,
} from "../../api/processoSeletivoInscricoes.api";

// ✅ agora a chave depende também da vaga
const key = (idProcesso: string, idVaga?: string) =>
  ["processo", idProcesso, "inscricaoMe", idVaga ?? ""] as const;

export function useInscricaoMe(idProcesso: string, idVaga?: string) {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: key(idProcesso, idVaga),
    queryFn: () => getInscricaoMe(idProcesso, idVaga!), // só chama quando enabled
    enabled: !!idProcesso && !!idVaga, // ✅ evita 400
    retry: (count, err) => {
      // se 404, não tem inscrição ainda -> não fica tentando
      if (axios.isAxiosError(err) && err.response?.status === 404) return false;
      return count < 2;
    },
  });

  const createMut = useMutation({
    mutationFn: (payload: CreateInscricaoDTO) => {
      // ✅ garante que vai com id_vaga
      if (!payload.id_vaga && idVaga) {
        return createInscricaoMe(idProcesso, { ...payload, id_vaga: idVaga });
      }
      return createInscricaoMe(idProcesso, payload);
    },
    onSuccess: (data) => qc.setQueryData(key(idProcesso, idVaga), data),
  });

  const updateMut = useMutation({
    mutationFn: (payload: Partial<CreateInscricaoDTO>) => {
      // ✅ update precisa saber a vaga (rota usa ?vaga=)
      if (!idVaga) {
        return Promise.reject(new Error("Selecione uma vaga para atualizar."));
      }
      return updateInscricaoMe(idProcesso, idVaga, payload);
    },
    onSuccess: (data) => qc.setQueryData(key(idProcesso, idVaga), data),
  });

  const enviarMut = useMutation({
    mutationFn: () => {
      if (!idVaga) {
        return Promise.reject(new Error("Selecione uma vaga para enviar."));
      }
      return enviarInscricaoMe(idProcesso, idVaga);
    },
    onSuccess: (data) => qc.setQueryData(key(idProcesso, idVaga), data),
  });

  return { query, createMut, updateMut, enviarMut };
}
