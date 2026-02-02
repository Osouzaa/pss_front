import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { iniciarInscricao } from "../../api/iniciar-inscricao";
import {
  salvarRespostasLote,
  type SalvarRespostasBody,
} from "../../api/salvar-lote";
import { enviarInscricaoTwo } from "../../api/enviar-inscricao";
import type { RespostasState } from "./types";

export function useInscricaoActions(params: {
  idProcesso: string;
  idInscricao: string;
  perguntas: Array<{ id_pergunta: string; tipo: string }>;
  respostas: RespostasState;
}) {
  const { idProcesso, idInscricao, perguntas, respostas } = params;

  const queryClient = useQueryClient();

  const iniciarMut = useMutation({
    mutationFn: (body: { id_processo_seletivo: string; id_vaga: string }) =>
      iniciarInscricao(body),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["processo-id", idProcesso] });
      // se a inscrição já existir no cache, também limpa
      queryClient.invalidateQueries({ queryKey: ["inscricao", idProcesso] });
    },

    onError: (e: any) =>
      toast.error(e?.response?.data?.message ?? "Erro ao iniciar inscrição."),
  });

  const salvarMut = useMutation({
    mutationFn: (body: SalvarRespostasBody) =>
      salvarRespostasLote(idInscricao, body),

    onSuccess: () => {
      toast.success("Alterações salvas!");
      queryClient.invalidateQueries({ queryKey: ["processo-id", idProcesso] });
      queryClient.invalidateQueries({
        queryKey: ["inscricao", idProcesso, idInscricao],
      });
    },

    onError: (e: any) => {
      console.log(e);
      const data = e?.response?.data;
      const msg = data?.message ?? "Erro ao enviar inscrição.";
      const faltando = Array.isArray(data?.faltandoDocumentos)
        ? data.faltandoDocumentos.join(", ")
        : null;

      toast.error(faltando ? `${msg} Faltando: ${faltando}.` : msg);
    },
  });

  const enviarMut = useMutation({
    mutationFn: () => enviarInscricaoTwo(idInscricao),

    onSuccess: () => {
      toast.success("Inscrição enviada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["processo-id", idProcesso] });
      queryClient.invalidateQueries({
        queryKey: ["inscricao", idProcesso, idInscricao],
      });
    },

    onError: (e: any) =>
      toast.error(e?.response?.data?.message ?? "Erro ao enviar inscrição."),
  });

  function buildPayload(): SalvarRespostasBody {
    return {
      respostas: perguntas.map((p) => {
        const v = respostas[p.id_pergunta];

        if (p.tipo === "BOOLEAN") {
          return {
            id_pergunta: p.id_pergunta,
            valor_boolean: typeof v === "boolean" ? v : null,
          };
        }

        if (p.tipo === "NUMERO" || p.tipo === "EXPERIENCIA_DIAS") {
          return {
            id_pergunta: p.id_pergunta,
            valor_numero: typeof v === "number" ? v : null,
          };
        }

        if (p.tipo === "TEXTO") {
          return {
            id_pergunta: p.id_pergunta,
            valor_texto: typeof v === "string" ? v : "",
          };
        }

        if (p.tipo === "DATA") {
          return {
            id_pergunta: p.id_pergunta,
            valor_data: typeof v === "string" ? v : null,
          };
        }

        if (p.tipo === "SELECT") {
          return {
            id_pergunta: p.id_pergunta,
            opcao_id: typeof v === "string" && v ? v : null,
          };
        }

        return { id_pergunta: p.id_pergunta };
      }),
    };
  }

  return { iniciarMut, salvarMut, enviarMut, buildPayload };
}
