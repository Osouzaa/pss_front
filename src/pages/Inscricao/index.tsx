// src/pages/Inscricao/InscricaoPage.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import * as S from "./styles";
import { getProcessoId } from "../../api/get-processo-id";
import type {
  ProcessoSeletivoResponse,
  VagaProcessoSeletivoResponse,
} from "../../api/get-processo-id";

import { SelectBase } from "../../components/SelectBase";

import {
  salvarRespostasLote,
  type SalvarRespostasBody,
} from "../../api/salvar-lote";
import { enviarInscricaoTwo } from "../../api/enviar-inscricao";
import { iniciarInscricao } from "../../api/iniciar-inscricao";
import { getInscricaoById } from "../../api/get-inscricao-by-id";
import { PerguntaField, toDateInputValue } from "./components/PerguntaField";

/** =========================
 * Types
 * ========================= */

type AnswerValue = boolean | number | string | null;

type RespostasState = Record<string, AnswerValue>;

type InscricaoStatus = "RASCUNHO" | "ENVIADA" | "CANCELADA" | string;

type InscricaoResponse = {
  id_inscricao: string;
  id_processo_seletivo: string;
  id_vaga?: string | null;
  status?: InscricaoStatus;
};

type InscricaoRespostaResponse = {
  id_pergunta: string;
  opcao_id?: string | null;
  valor_boolean?: boolean | null;
  valor_numero?: number | null;
  valor_texto?: string | null;
  valor_data?: string | null; // pode vir ISO ou YYYY-MM-DD
};

type GetInscricaoByIdResponse = {
  inscricao: InscricaoResponse;
  respostas: InscricaoRespostaResponse[];
};

/** =========================
 * Helpers
 * ========================= */

function safeString(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function safeNumber(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v)))
    return Number(v);
  return null;
}

function normalizeInscricaoResponse(input: unknown): GetInscricaoByIdResponse {
  const raw = input as Record<string, any>;

  const inscricaoRaw = raw?.inscricao ?? raw;

  const inscricao: InscricaoResponse = {
    id_inscricao: inscricaoRaw?.id_inscricao,
    id_processo_seletivo:
      inscricaoRaw?.id_processo_seletivo ?? raw?.id_processo_seletivo,
    id_vaga: inscricaoRaw?.id_vaga ?? null,
    status: inscricaoRaw?.status,
  };

  // prioridade: inscricao.respostas (como sua API retorna)
  // fallback: raw.respostas
  const respostasRaw = Array.isArray(inscricaoRaw?.respostas)
    ? inscricaoRaw.respostas
    : Array.isArray(raw?.respostas)
      ? raw.respostas
      : [];

  const respostas: InscricaoRespostaResponse[] = respostasRaw.map((r: any) => ({
    id_pergunta: r?.id_pergunta,
    opcao_id: r?.opcao_id ?? null,
    valor_boolean: r?.valor_boolean ?? null,
    valor_numero: r?.valor_numero ?? null,
    valor_texto: r?.valor_texto ?? null,
    valor_data: r?.valor_data ?? null,
  }));

  return { inscricao, respostas };
}

export function InscricaoPage() {
  const navigate = useNavigate();
  const { id, id_inscricao } = useParams<{
    id: string;
    id_inscricao?: string;
  }>();

  const idProcesso = id ?? "";
  const [idInscricao, setIdInscricao] = useState<string>(id_inscricao ?? "");
  const [idVaga, setIdVaga] = useState<string>("");

  const [respostas, setRespostas] = useState<RespostasState>({});
  const hydratedRef = useRef(false);

  /** manter state sincronizado com a rota */
  useEffect(() => {
    setIdInscricao(id_inscricao ?? "");
  }, [id_inscricao]);

  /** =========================
   * 1) Processo
   * ========================= */
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

  // seus tipos serão apenas: BOOLEAN | NUMERO | TEXTO | SELECT | DATA | EXPERIENCIA_DIAS
  const perguntas = useMemo(() => {
    const list = processo?.perguntas ?? [];
    return list
      .filter((p) => p.ativa)
      .slice()
      .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));
  }, [processo?.perguntas]);

  /** =========================
   * 2) Inscrição existente
   * ========================= */
  const inscricaoQuery = useQuery<GetInscricaoByIdResponse>({
    queryKey: ["inscricao", idProcesso, idInscricao],
    queryFn: async () => {
      const raw = await getInscricaoById(idProcesso, idInscricao);
      return normalizeInscricaoResponse(raw);
    },
    enabled: !!idProcesso && !!idInscricao,
  });

  /** reset ao trocar inscrição */
  useEffect(() => {
    hydratedRef.current = false;
    setRespostas({});
  }, [idInscricao]);

  /** hidratar respostas (preencher inputs) */
  useEffect(() => {
    if (!inscricaoQuery.data) return;
    if (hydratedRef.current) return;

    const { inscricao, respostas: respostasApi } = inscricaoQuery.data;

    setIdVaga(inscricao?.id_vaga ?? "");

    const next: RespostasState = {};

    for (const r of respostasApi ?? []) {
      const pid = r.id_pergunta;
      if (!pid) continue;

      // SELECT
      if (r.opcao_id) {
        next[pid] = r.opcao_id;
        continue;
      }

      // BOOLEAN
      if (r.valor_boolean !== null && r.valor_boolean !== undefined) {
        next[pid] = r.valor_boolean;
        continue;
      }

      // NUMBER / EXPERIENCIA_DIAS
      if (r.valor_numero !== null && r.valor_numero !== undefined) {
        next[pid] = r.valor_numero;
        continue;
      }

      // TEXT
      if (r.valor_texto !== null && r.valor_texto !== undefined) {
        next[pid] = r.valor_texto;
        continue;
      }

      // DATE
      if (r.valor_data) {
        next[pid] = toDateInputValue(r.valor_data);
        continue;
      }

      next[pid] = null;
    }

    setRespostas(next);
    hydratedRef.current = true;
  }, [inscricaoQuery.data]);

  /** =========================
   * 3) Iniciar inscrição
   * ========================= */
  const iniciarMut = useMutation({
    mutationFn: (body: { id_processo_seletivo: string; id_vaga: string }) =>
      iniciarInscricao(body),
    onError: (e: any) =>
      toast.error(e?.response?.data?.message ?? "Erro ao iniciar inscrição."),
  });

  async function handleIniciar() {
    if (!idVaga) return toast.error("Selecione uma vaga para iniciar.");

    const response = await iniciarMut.mutateAsync({
      id_processo_seletivo: idProcesso,
      id_vaga: idVaga,
    });

    if (response.readonly) {
      toast.warning(
        "Voce já tem uma inscrição nessa vaga! Vamos levar você para atualizar informações.",
      );
    }

    const newId = response?.id_inscricao as string | undefined;
    if (!newId) return toast.error("Backend não retornou id_inscricao.");

    setIdInscricao(newId);
    navigate(`/processos/${idProcesso}/inscricao/${newId}`, { replace: true });
  }

  /** =========================
   * 4) Salvar / Finalizar
   * ========================= */
  const salvarMut = useMutation({
    mutationFn: (body: SalvarRespostasBody) =>
      salvarRespostasLote(idInscricao, body),
    onError: (e: any) =>
      toast.error(e?.response?.data?.message ?? "Erro ao salvar respostas."),
    onSuccess: () => toast.success("Alterações salvas!"),
  });

  function buildPayload(): SalvarRespostasBody {
    return {
      respostas: perguntas.map((p) => {
        const v = respostas[p.id_pergunta];

        if (p.tipo === "BOOLEAN")
          return {
            id_pergunta: p.id_pergunta,
            valor_boolean: typeof v === "boolean" ? v : null,
          };

        if (p.tipo === "NUMERO" || p.tipo === "EXPERIENCIA_DIAS")
          return {
            id_pergunta: p.id_pergunta,
            valor_numero: typeof v === "number" ? v : null,
          };

        if (p.tipo === "TEXTO")
          return {
            id_pergunta: p.id_pergunta,
            valor_texto: typeof v === "string" ? v : "",
          };

        if (p.tipo === "DATA")
          return {
            id_pergunta: p.id_pergunta,
            valor_data: typeof v === "string" ? v : null,
          };

        if (p.tipo === "SELECT")
          return {
            id_pergunta: p.id_pergunta,
            opcao_id: typeof v === "string" && v ? v : null,
          };

        return { id_pergunta: p.id_pergunta };
      }),
    };
  }

  const enviarMut = useMutation({
    mutationFn: () => enviarInscricaoTwo(idInscricao),
    onSuccess: () => toast.success("Inscrição enviada com sucesso!"),
    onError: (e: any) =>
      toast.error(e?.response?.data?.message ?? "Erro ao enviar inscrição."),
  });

  async function handleFinalizar() {
    if (!idVaga) return toast.error("Selecione uma vaga.");
    if (!idInscricao) return toast.error("Inicie a inscrição primeiro.");

    await salvarMut.mutateAsync(buildPayload());
    await enviarMut.mutateAsync();
  }

  /** =========================
   * UI states
   * ========================= */
  if (!idProcesso) return <S.Page>Processo inválido.</S.Page>;
  if (processoQuery.isLoading) return <S.Page>Carregando processo...</S.Page>;
  if (processoQuery.isError || !processo)
    return <S.Page>Não foi possível carregar o processo.</S.Page>;

  if (idInscricao && inscricaoQuery.isLoading)
    return <S.Page>Carregando inscrição...</S.Page>;

  const iniciou = !!idInscricao;

  return (
    <S.Page>
      <S.Header>
        <S.TitleWrap>
          <S.Title>{processo.titulo}</S.Title>
          <S.Subtitle>Escolha a vaga e preencha as perguntas.</S.Subtitle>
        </S.TitleWrap>
      </S.Header>

      <S.Card>
        <S.CardHeader>
          <S.CardHeaderTitle>Inscrição</S.CardHeaderTitle>
          <S.CardHeaderText>
            {iniciou
              ? "Você pode editar e salvar a qualquer momento."
              : "Selecione a vaga e clique em iniciar."}
          </S.CardHeaderText>
        </S.CardHeader>

        <S.Form onSubmit={(e) => e.preventDefault()}>
          <S.Grid>
            <div style={{ gridColumn: "1 / -1" }}>
              <SelectBase
                label="Vaga do processo"
                id="id_vaga"
                value={idVaga}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setIdVaga(e.target.value)
                }
                disabled={iniciou} // não troca vaga após criar inscrição
              >
                <option value="" disabled>
                  Selecione uma vaga
                </option>

                {vagas.map((v: VagaProcessoSeletivoResponse) => (
                  <option key={v.id_vaga} value={v.id_vaga}>
                    {v.nome} ({v.nivel}) • {v.quantidade_de_vagas} vaga(s)
                  </option>
                ))}
              </SelectBase>

              {!iniciou ? (
                <div
                  style={{
                    marginTop: 12,
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 10,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: "1px solid rgba(0,0,0,.12)",
                      background: "transparent",
                      cursor: "pointer",
                    }}
                  >
                    Voltar
                  </button>

                  <button
                    type="button"
                    onClick={handleIniciar}
                    disabled={!idVaga || iniciarMut.isPending}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: "none",
                      background: "#111827",
                      color: "white",
                      cursor:
                        !idVaga || iniciarMut.isPending
                          ? "not-allowed"
                          : "pointer",
                      opacity: !idVaga || iniciarMut.isPending ? 0.6 : 1,
                    }}
                  >
                    {iniciarMut.isPending
                      ? "Iniciando..."
                      : "Iniciar inscrição"}
                  </button>
                </div>
              ) : null}
            </div>

            {iniciou ? (
              <>
                <S.Section>
                  <S.SectionTitle>Perguntas</S.SectionTitle>
                </S.Section>

                {perguntas.map((p) => (
                  <PerguntaField
                    key={p.id_pergunta}
                    p={p}
                    value={respostas[p.id_pergunta] ?? null}
                    disabled={false}
                    onChangeValue={(next) =>
                      setRespostas((prev) => ({
                        ...prev,
                        [p.id_pergunta]: next,
                      }))
                    }
                  />
                ))}
              </>
            ) : null}
          </S.Grid>

          {iniciou ? (
            <div
              style={{
                marginTop: 16,
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
              }}
            >
              <button
                type="button"
                onClick={handleFinalizar}
                disabled={salvarMut.isPending || enviarMut.isPending}
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "none",
                  background: "#111827",
                  color: "white",
                  cursor:
                    salvarMut.isPending || enviarMut.isPending
                      ? "not-allowed"
                      : "pointer",
                  opacity: salvarMut.isPending || enviarMut.isPending ? 0.6 : 1,
                }}
              >
                {enviarMut.isPending ? "Finalizando..." : "Finalizar edição"}
              </button>
            </div>
          ) : null}
        </S.Form>
      </S.Card>
    </S.Page>
  );

  /** =========================
   * Render pergunta
   * ========================= */
}
