import { useMutation } from "@tanstack/react-query";
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
  const { idInscricao, perguntas, respostas } = params;

  const iniciarMut = useMutation({
    mutationFn: (body: { id_processo_seletivo: string; id_vaga: string }) =>
      iniciarInscricao(body),
    onError: (e: any) =>
      toast.error(e?.response?.data?.message ?? "Erro ao iniciar inscrição."),
  });

  const salvarMut = useMutation({
    mutationFn: (body: SalvarRespostasBody) =>
      salvarRespostasLote(idInscricao, body),
    onError: (e: any) =>
      toast.error(e?.response?.data?.message ?? "Erro ao salvar respostas."),
    onSuccess: () => toast.success("Alterações salvas!"),
  });

  const enviarMut = useMutation({
    mutationFn: () => enviarInscricaoTwo(idInscricao),
    onSuccess: () => toast.success("Inscrição enviada com sucesso!"),
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
