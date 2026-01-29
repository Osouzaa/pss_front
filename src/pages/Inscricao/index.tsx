// src/pages/Inscricao/InscricaoPage.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import * as S from "./styles";
import { getProcessoId } from "../../api/get-processo-id";
import type {
  ProcessoSeletivoResponse,
  PerguntaProcessoResponse,
  PerguntaOpcaoResponse,
  VagaProcessoSeletivoResponse,
} from "../../api/get-processo-id";

import { InputBase } from "../../components/InputBase";
import { SelectBase } from "../../components/SelectBase";
import { TextAreaBase } from "../../components/TextAreaBase";

import {
  salvarRespostasLote,
  type SalvarRespostasBody,
} from "../../api/salvar-lote";
import { enviarInscricaoTwo } from "../../api/enviar-inscricao";
import { iniciarInscricao } from "../../api/iniciar-inscricao";
import { getInscricaoById } from "../../api/get-inscricao-by-id";

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

function toDateInputValue(v?: string | null): string | null {
  if (!v) return null;
  // ISO -> YYYY-MM-DD
  if (v.includes("T")) return v.slice(0, 10);
  return v;
}

function safeString(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function safeNumber(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v)))
    return Number(v);
  return null;
}

/**
 * Normaliza o retorno do getInscricaoById para o formato {inscricao, respostas}.
 *
 * Suporta:
 *  A) { inscricao: {..., respostas:[...] }, ... }   ✅ seu caso real
 *  B) { inscricao: {...}, respostas:[...] }
 *  C) { ...inscricao, respostas:[...] }
 */
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

  async function handleSalvarEdicao() {
    if (!idVaga) return toast.error("Selecione uma vaga.");
    if (!idInscricao) return toast.error("Inicie a inscrição primeiro.");

    try {
      await salvarMut.mutateAsync(buildPayload());
    } catch {}
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

                {perguntas.map((p) => renderPergunta(p))}
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
                onClick={handleSalvarEdicao}
                disabled={salvarMut.isPending}
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1px solid rgba(0,0,0,.12)",
                  background: "transparent",
                  cursor: salvarMut.isPending ? "not-allowed" : "pointer",
                  opacity: salvarMut.isPending ? 0.6 : 1,
                }}
              >
                {salvarMut.isPending ? "Salvando..." : "Salvar edição"}
              </button>

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
                {enviarMut.isPending ? "Finalizando..." : "Finalizar inscrição"}
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
  function renderPergunta(p: PerguntaProcessoResponse) {
    const idPergunta = p.id_pergunta;

    const valor = respostas[idPergunta]; // boolean | number | string | null

    const opcoesAtivasOrdenadas = (p.opcoes ?? [])
      .filter((o: PerguntaOpcaoResponse) => o.ativa)
      .slice()
      .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));

    // edição sempre liberada
    const disabled = false;

    const valueAsString = typeof valor === "string" ? valor : "";
    const valueAsNumber = typeof valor === "number" ? valor : null;
    const valueAsBoolean = typeof valor === "boolean" ? valor : null;

    return (
      <div key={idPergunta} style={{ gridColumn: "1 / -1" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <b>{p.titulo}</b>
            {p.obrigatoria ? (
              <span style={{ fontSize: 12, color: "#DC2626" }}>*</span>
            ) : null}
          </div>

          {p.descricao ? (
            <div style={{ fontSize: 12, opacity: 0.8 }}>{p.descricao}</div>
          ) : null}
        </div>

        <div style={{ marginTop: 10 }}>
          {p.tipo === "BOOLEAN" ? (
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <label
                style={{
                  display: "flex",
                  gap: 6,
                  alignItems: "center",
                  opacity: disabled ? 0.6 : 1,
                }}
              >
                <input
                  disabled={disabled}
                  type="radio"
                  name={`p_${idPergunta}`}
                  checked={valueAsBoolean === true}
                  onChange={() =>
                    setRespostas((prev) => ({ ...prev, [idPergunta]: true }))
                  }
                />
                Sim
              </label>

              <label
                style={{
                  display: "flex",
                  gap: 6,
                  alignItems: "center",
                  opacity: disabled ? 0.6 : 1,
                }}
              >
                <input
                  disabled={disabled}
                  type="radio"
                  name={`p_${idPergunta}`}
                  checked={valueAsBoolean === false}
                  onChange={() =>
                    setRespostas((prev) => ({ ...prev, [idPergunta]: false }))
                  }
                />
                Não
              </label>
            </div>
          ) : null}

          {p.tipo === "NUMERO" ? (
            <InputBase
              id={`p_${idPergunta}`}
              label="Resposta"
              type="number"
              value={valueAsNumber ?? ""}
              disabled={disabled}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const n = safeNumber(e.target.value);
                setRespostas((prev) => ({ ...prev, [idPergunta]: n }));
              }}
            />
          ) : null}

          {p.tipo === "EXPERIENCIA_DIAS" ? (
            <InputBase
              id={`p_${idPergunta}`}
              label="Dias de experiência"
              type="number"
              placeholder="Ex: 400"
              value={valueAsNumber ?? ""}
              disabled={disabled}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const n = safeNumber(e.target.value);
                setRespostas((prev) => ({ ...prev, [idPergunta]: n }));
              }}
            />
          ) : null}

          {p.tipo === "TEXTO" ? (
            <TextAreaBase
              label="Resposta"
              value={valueAsString}
              disabled={disabled}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setRespostas((prev) => ({
                  ...prev,
                  [idPergunta]: e.target.value,
                }))
              }
              rows={3}
              maxLength={500}
            />
          ) : null}

          {p.tipo === "SELECT" ? (
            <SelectBase
              label="Selecione"
              id={`p_${idPergunta}`}
              value={typeof valor === "string" ? valor : ""}
              disabled={disabled}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setRespostas((prev) => ({
                  ...prev,
                  [idPergunta]: e.target.value,
                }))
              }
            >
              <option value="">Selecione</option>
              {opcoesAtivasOrdenadas.map((o) => (
                <option key={o.id_opcao} value={o.id_opcao}>
                  {o.label}
                </option>
              ))}
            </SelectBase>
          ) : null}

          {p.tipo === "DATA" ? (
            <InputBase
              id={`p_${idPergunta}`}
              label="Data"
              type="date"
              value={
                typeof valor === "string" ? (toDateInputValue(valor) ?? "") : ""
              }
              disabled={disabled}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setRespostas((prev) => ({
                  ...prev,
                  [idPergunta]: safeString(e.target.value) || null,
                }))
              }
            />
          ) : null}
        </div>
      </div>
    );
  }
}
