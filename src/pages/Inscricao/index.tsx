// src/pages/Inscricao/InscricaoPage.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import * as S from "./styles";

import { getProcessoId } from "../../api/get-processo-id";
import type {
  ProcessoSeletivoResponse,
  PerguntaProcessoResponse,
  PerguntaOpcaoResponse,
} from "../../api/get-processo-id";

import { SelectBase } from "../../components/SelectBase";
import { TextAreaBase } from "../../components/TextAreaBase";
import { InputBase } from "../../components/InputBase";
import {
  createOrGetInscricaoDraft,
  enviarInscricao,
  getInscricaoMe,
  salvarRespostas,
  type InscricaoMeResponse,
  type SalvarRespostasBody,
} from "../../api/inscricoes";

export function InscricaoPage() {
  const { id } = useParams();
  const idProcesso = id ?? "";
  const qc = useQueryClient();

  // =========================
  // Processo (vagas + perguntas)
  // =========================
  const processoQuery = useQuery<ProcessoSeletivoResponse>({
    queryKey: ["processo-id", idProcesso],
    queryFn: () => {
      if (!idProcesso) throw new Error("Processo inválido");
      return getProcessoId(idProcesso);
    },
    enabled: !!idProcesso,
  });

  const processo = processoQuery.data;

  const vagas = useMemo(() => processo?.vagas ?? [], [processo?.vagas]);

  const perguntas = useMemo(() => {
    const list = processo?.perguntas ?? [];
    return list
      .filter((p) => p.ativa)
      .slice()
      .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));
  }, [processo?.perguntas]);

  // =========================
  // Inscrição (minha inscrição)
  // =========================
  const inscricaoMeQuery = useQuery<InscricaoMeResponse | null>({
    queryKey: ["inscricao-me", idProcesso], // ✅ chave por processo
    queryFn: () => getInscricaoMe(idProcesso), // ✅ busca minha inscrição desse processo
    enabled: !!idProcesso, // ✅ só roda se tiver id
  });

  const inscricao = inscricaoMeQuery.data ?? null;

  const idInscricao = inscricao?.id_inscricao ?? "";

  const isReadOnly = inscricao?.status === "ENVIADA";

  // =========================
  // State local (vaga + respostas)
  // =========================
  const [idVaga, setIdVaga] = useState("");
  const [respostas, setRespostas] = useState<Record<string, any>>({});

  // evita sobrescrever state do usuário enquanto ele digita
  const hydratedRef = useRef(false);

  // hidrata state (idVaga + respostas) quando inscrição carregar
  useEffect(() => {
    if (!inscricao) return;
    if (hydratedRef.current) return;

    setIdVaga(inscricao.id_vaga ?? "");

    const next: Record<string, any> = {};
    for (const r of inscricao.respostas ?? []) {
      if (r.valor_boolean !== null && r.valor_boolean !== undefined) {
        next[r.id_pergunta] = r.valor_boolean;
        continue;
      }
      if (r.valor_numero !== null && r.valor_numero !== undefined) {
        next[r.id_pergunta] = Number(r.valor_numero);
        continue;
      }
      if (r.valor_texto) {
        next[r.id_pergunta] = r.valor_texto;
        continue;
      }
      if (r.valor_data) {
        // se vier ISO, corta para yyyy-mm-dd
        next[r.id_pergunta] = String(r.valor_data).slice(0, 10);
        continue;
      }
      if (r.opcao_id) {
        next[r.id_pergunta] = r.opcao_id; // SELECT usa id_opcao
        continue;
      }
    }

    setRespostas(next);
    hydratedRef.current = true;
  }, [inscricao]);

  // =========================
  // Mutations
  // =========================
  const createDraftMut = useMutation({
    mutationFn: (body: { id_vaga?: string }) =>
      createOrGetInscricaoDraft(idProcesso, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inscricao-me", idProcesso] });
    },
    onError: (e: any) => {
      toast.error(e?.response?.data?.message ?? "Erro ao criar inscrição.");
    },
  });

  const salvarRespostasMut = useMutation({
    mutationFn: (payload: SalvarRespostasBody) =>
      salvarRespostas(idProcesso, idInscricao, payload),
    onError: () => {
      toast.error("Falha ao salvar respostas.");
    },
  });

  const enviarMut = useMutation({
    mutationFn: () => enviarInscricao(idProcesso, idInscricao),
    onSuccess: () => {
      toast.success("Inscrição enviada com sucesso!");
      qc.invalidateQueries({ queryKey: ["inscricao-me", idProcesso] });
    },
    onError: (e: any) => {
      toast.error(e?.response?.data?.message ?? "Erro ao enviar inscrição.");
    },
  });

  // =========================
  // Helpers
  // =========================
  function buildRespostasPayload(): SalvarRespostasBody {
    return {
      respostas: perguntas.map((p) => {
        const v = respostas[p.id_pergunta];

        if (p.tipo === "BOOLEAN") {
          return {
            id_pergunta: p.id_pergunta,
            tipo: "BOOLEAN",
            valor_boolean: v === true,
          };
        }

        if (p.tipo === "NUMERO") {
          return {
            id_pergunta: p.id_pergunta,
            tipo: "NUMERO",
            valor_numero: typeof v === "number" ? v : undefined,
          };
        }

        if (p.tipo === "TEXTO") {
          return {
            id_pergunta: p.id_pergunta,
            tipo: "TEXTO",
            valor_texto: typeof v === "string" ? v : "",
          };
        }

        if (p.tipo === "DATA") {
          return {
            id_pergunta: p.id_pergunta,
            tipo: "DATA",
            valor_data: typeof v === "string" ? v : undefined,
          };
        }

        // SELECT: value é id_opcao (uuid)
        if (p.tipo === "SELECT") {
          return {
            id_pergunta: p.id_pergunta,
            tipo: "SELECT",
            opcao_id: typeof v === "string" ? v : undefined,
          };
        }

        // fallback (não deve acontecer)
        return {
          id_pergunta: p.id_pergunta,
          tipo: p.tipo as any,
        } as any;
      }),
    };
  }

  // =========================
  // Auto-save (debounce)
  // - só salva se já existe inscrição (idInscricao)
  // - só salva se não for readOnly
  // =========================
  useEffect(() => {
    if (!idInscricao) return;
    if (isReadOnly) return;

    const t = setTimeout(() => {
      // evita salvar antes do processo/perguntas carregarem
      if (!perguntas.length) return;

      salvarRespostasMut.mutate(buildRespostasPayload());
    }, 700);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [respostas, idInscricao, isReadOnly, perguntas.length]);

  // =========================
  // Events
  // =========================
  async function handleSelectVaga(nextIdVaga: string) {
    setIdVaga(nextIdVaga);

    if (isReadOnly) return;
    if (!idProcesso) return;

    // Se não existe inscrição ainda, cria agora com a vaga escolhida
    if (!idInscricao) {
      createDraftMut.mutate({ id_vaga: nextIdVaga });
      return;
    }

    // Se já existe inscrição, você pode (opcionalmente) atualizar vaga via endpoint específico.
    // Como não criamos endpoint de update da vaga, a regra aqui é:
    // - se já existe inscrição, não troca vaga no backend (ou você cria endpoint depois)
    // - por enquanto, deixa assim.
  }

  async function onEnviar() {
    if (!idVaga) {
      toast.error("Selecione uma vaga para enviar.");
      return;
    }

    if (!idInscricao) {
      // cria rascunho primeiro, depois o usuário clica novamente (simples)
      await createDraftMut.mutateAsync({ id_vaga: idVaga });
      toast.info("Inscrição criada. Revise e clique em Enviar novamente.");
      return;
    }

    try {
      // salva última vez antes de enviar
      await salvarRespostasMut.mutateAsync(buildRespostasPayload());

      await enviarMut.mutateAsync();
    } catch {
      // erros já tratados no onError
    }
  }

  // =========================
  // UI states
  // =========================
  if (!idProcesso) return <S.Page>Processo inválido.</S.Page>;

  if (processoQuery.isLoading) return <S.Page>Carregando processo...</S.Page>;

  if (processoQuery.isError || !processo) {
    return (
      <S.Page>
        Não foi possível carregar o processo.{" "}
        {(processoQuery.error as Error)?.message ?? ""}
      </S.Page>
    );
  }

  if (inscricaoMeQuery.isLoading) {
    return <S.Page>Carregando inscrição...</S.Page>;
  }

  const hasVagas = vagas.length > 0;

  return (
    <S.Page>
      <S.Header>
        <S.TitleWrap>
          <S.Title>Minha inscrição</S.Title>
          <S.Subtitle>
            Selecione a vaga e responda as perguntas do processo.
          </S.Subtitle>
        </S.TitleWrap>
      </S.Header>

      <S.Card>
        <S.CardHeader>
          <S.CardHeaderTitle>Formulário</S.CardHeaderTitle>
          <S.CardHeaderText>
            Preencha os campos e depois envie sua inscrição.
          </S.CardHeaderText>
        </S.CardHeader>

        <S.Form onSubmit={(e) => e.preventDefault()}>
          <S.Fieldset disabled={isReadOnly}>
            <S.Grid>
              {/* =========================
                  VAGA
              ========================= */}
              <div style={{ gridColumn: "1 / -1" }}>
                <SelectBase
                  label="Vaga do processo"
                  id="id_vaga"
                  disabled={isReadOnly}
                  value={idVaga}
                  onChange={(e: any) => handleSelectVaga(e.target.value)}
                >
                  <option value="" disabled>
                    Selecione uma vaga
                  </option>

                  {vagas.map((v) => (
                    <option key={v.id_vaga} value={v.id_vaga}>
                      {v.nome} ({v.nivel})
                    </option>
                  ))}
                </SelectBase>

                {!hasVagas && (
                  <S.Helper>
                    Nenhuma vaga cadastrada/ativa neste processo. Procure a
                    administração.
                  </S.Helper>
                )}

                {/* estado (debug/UX) */}
                {idInscricao ? (
                  <S.Helper>
                    Status: <b>{inscricao?.status}</b>{" "}
                    {inscricao?.pontuacao_total !== undefined ? (
                      <>
                        • Pontuação: <b>{inscricao.pontuacao_total}</b>
                      </>
                    ) : null}
                  </S.Helper>
                ) : (
                  <S.Helper>
                    Selecione uma vaga para iniciar sua inscrição.
                  </S.Helper>
                )}
              </div>

              {/* =========================
                  PERGUNTAS
              ========================= */}
              <S.Section>
                <S.SectionTitle>Perguntas do processo</S.SectionTitle>
              </S.Section>

              {perguntas.length === 0 ? (
                <S.Helper style={{ gridColumn: "1 / -1" }}>
                  Nenhuma pergunta cadastrada para este processo.
                </S.Helper>
              ) : (
                perguntas.map((p) => renderPergunta(p))
              )}
            </S.Grid>
          </S.Fieldset>

          <S.Actions>
            <S.PrimaryButton
              type="button"
              onClick={onEnviar}
              disabled={
                !idVaga || !hasVagas || enviarMut.isPending || isReadOnly
              }
              title={
                isReadOnly
                  ? "Inscrição enviada"
                  : !idVaga
                    ? "Selecione uma vaga"
                    : "Enviar inscrição"
              }
            >
              {isReadOnly
                ? "Enviada"
                : enviarMut.isPending
                  ? "Enviando..."
                  : "Enviar"}
            </S.PrimaryButton>
          </S.Actions>
        </S.Form>
      </S.Card>
    </S.Page>
  );

  // =========================
  // Render da pergunta (mantido)
  // =========================
  function renderPergunta(p: PerguntaProcessoResponse) {
    const idPergunta = p.id_pergunta;
    const valor = respostas[idPergunta];
    const obrigatorioMark = p.obrigatoria ? " *" : "";

    const opcoesAtivasOrdenadas = (p.opcoes ?? [])
      .filter((o: PerguntaOpcaoResponse) => o.ativa)
      .slice()
      .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));

    return (
      <div key={idPergunta} style={{ gridColumn: "1 / -1" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
          <b>
            {p.titulo}
            {p.obrigatoria ? (
              <span style={{ fontSize: 12, color: "#DC2626" }}> *</span>
            ) : null}
          </b>
        </div>

        {p.descricao ? (
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>
            {p.descricao}
          </div>
        ) : null}

        <div style={{ marginTop: 10 }}>
          {p.tipo === "BOOLEAN" ? (
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <input
                  type="radio"
                  name={`p_${idPergunta}`}
                  disabled={isReadOnly || !idInscricao}
                  checked={valor === true}
                  onChange={() =>
                    setRespostas((prev) => ({ ...prev, [idPergunta]: true }))
                  }
                />
                Sim
              </label>

              <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <input
                  type="radio"
                  name={`p_${idPergunta}`}
                  disabled={isReadOnly || !idInscricao}
                  checked={valor === false}
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
              label={`Resposta${obrigatorioMark}`}
              type="number"
              disabled={isReadOnly || !idInscricao}
              value={valor ?? ""}
              onChange={(e: any) =>
                setRespostas((prev) => ({
                  ...prev,
                  [idPergunta]:
                    e.target.value === "" ? "" : Number(e.target.value),
                }))
              }
            />
          ) : null}

          {p.tipo === "TEXTO" ? (
            <TextAreaBase
              label={`Resposta${obrigatorioMark}`}
              disabled={isReadOnly || !idInscricao}
              value={valor ?? ""}
              onChange={(e: any) =>
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
              label={`Selecione${obrigatorioMark}`}
              id={`p_${idPergunta}`}
              disabled={isReadOnly || !idInscricao}
              value={valor ?? ""}
              onChange={(e: any) =>
                setRespostas((prev) => ({
                  ...prev,
                  [idPergunta]: e.target.value, // id_opcao
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
              label={`Data${obrigatorioMark}`}
              type="date"
              disabled={isReadOnly || !idInscricao}
              value={valor ?? ""}
              onChange={(e: any) =>
                setRespostas((prev) => ({
                  ...prev,
                  [idPergunta]: e.target.value,
                }))
              }
            />
          ) : null}
        </div>
      </div>
    );
  }
}
