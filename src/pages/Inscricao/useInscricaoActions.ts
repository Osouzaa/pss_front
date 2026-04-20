import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { iniciarInscricao } from "../../api/iniciar-inscricao";
import {
  salvarRespostasLote,
  type SalvarRespostasBody,
} from "../../api/salvar-lote";
import { enviarInscricaoTwo } from "../../api/enviar-inscricao";
import type { RespostasState } from "./types";

function getApiErrorMessage(e: any, fallback: string) {
  return e?.response?.data?.message ?? e?.message ?? fallback;
}

export interface DocFaltando {
  id_pergunta: string;
  pergunta: string;
  label_comprovante: string;
  tipo_documento: string;
  anexado: boolean;
}

function getDetalhesFaltando(e: any): DocFaltando[] | null {
  const data = e?.response?.data;
  return Array.isArray(data?.detalhesFaltando) && data.detalhesFaltando.length
    ? data.detalhesFaltando
    : null;
}

type SalvarMutVars = {
  body: SalvarRespostasBody;
  silent?: boolean;
};

export function useInscricaoActions(params: {
  idProcesso: string;
  idInscricao: string;
  perguntas: Array<{ id_pergunta: string; tipo: string }>;
  respostas: RespostasState;
  onDocumentosFaltando?: (docs: DocFaltando[]) => void;
}) {
  const { idProcesso, idInscricao, perguntas, respostas, onDocumentosFaltando } = params;
  const queryClient = useQueryClient();

  const invalidateAll = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["processo-id", idProcesso] }),
      queryClient.invalidateQueries({
        queryKey: ["inscricao", idProcesso, idInscricao],
      }),
      queryClient.invalidateQueries({ queryKey: ["inscricao", idProcesso] }),
    ]);
  };

  const iniciarMut = useMutation({
    mutationFn: (body: { id_processo_seletivo: string; id_vaga: string }) =>
      iniciarInscricao(body),

    onSuccess: async () => {
      await invalidateAll();
    },

    onError: (e: any) =>
      toast.error(getApiErrorMessage(e, "Erro ao iniciar inscrição.")),
  });

  // ✅ aceita um "meta" para salvar silencioso
  const salvarMut = useMutation({
    mutationFn: ({ body }: SalvarMutVars) =>
      salvarRespostasLote(idInscricao, body),

    onSuccess: async (_data, variables) => {
      const silent = variables?.silent === true;

      if (!silent) toast.success("Alterações salvas!");
      await invalidateAll();
    },

    onError: (e: any) => {
      toast.error(e?.response?.data?.message ?? "Erro ao salvar respostas.");
    },
  });

  const enviarMut = useMutation({
    mutationFn: () => enviarInscricaoTwo(idInscricao),

    onSuccess: async () => {
      toast.success("Inscrição enviada com sucesso!");
      await invalidateAll();
    },

    onError: (e: any) => {
      const detalhes = getDetalhesFaltando(e);

      if (detalhes && onDocumentosFaltando) {
        onDocumentosFaltando(detalhes);
      } else {
        toast.error(getApiErrorMessage(e, "Erro ao enviar inscrição."));
      }
    },
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
          // ✅ melhor mandar null se vazio (seu backend já faz isso)
          const txt = typeof v === "string" ? v.trim() : "";
          return { id_pergunta: p.id_pergunta, valor_texto: txt ? txt : null };
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

        // ANEXO: o documento é o comprovante — sem campo de valor a enviar
        if (p.tipo === "ANEXO") {
          return { id_pergunta: p.id_pergunta };
        }

        return { id_pergunta: p.id_pergunta };
      }),
    };
  }

  return {
    iniciarMut,
    salvarMut,
    enviarMut,
    buildPayload,
  };
}
