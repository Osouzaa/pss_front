// src/pages/Inscricao/InscricaoPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import * as S from "./styles";
import { toast } from "sonner";

import {
  inscricaoSchema,
  type InscricaoFormData,
} from "../../schemas/create-schema";

type RegraPergunta = {
  require_attachment_if?: {
    value: true;
    label: string;
    mime_types: string[];
    max_size_mb: number;
  };
};

type PerguntaTipo =
  | "BOOLEAN"
  | "NUMERO"
  | "TEXTO"
  | "SELECT"
  | "MULTISELECT"
  | "DATA";

type PerguntaOpcao = {
  id_opcao: string;
  label: string;
  valor: string;
  ativa: boolean;
  ordem?: number | null;
};

type Pergunta = {
  id_pergunta: string;
  id_processo_seletivo: string;
  titulo: string;
  descricao?: string | null;
  tipo: PerguntaTipo;
  obrigatoria: boolean;
  ordem?: number | null;
  ativa: boolean;
  pontuacao_maxima?: string | null;
  regra_json?: string | null;
  opcoes?: PerguntaOpcao[];
  data_criacao?: string;
  data_atualizacao?: string;
};

function safeParseRegra(v?: string | null): RegraPergunta | null {
  if (!v) return null;
  try {
    return JSON.parse(v) as RegraPergunta;
  } catch {
    return null;
  }
}

function bytesToMb(bytes: number) {
  return bytes / (1024 * 1024);
}

type MockInscricao = {
  id_inscricao: string;
  id_vaga: string | null;
  status: "RASCUNHO" | "ENVIADA" | "EM_ANALISE";
  pontuacao_total: number;
  numero_inscricao: string;
  possui_ensino_fundamental?: boolean | null;
  possui_ensino_medio?: boolean | null;
  possui_ensino_superior?: boolean | null;
  quantidade_ensino_superior?: number | null;
  possui_curso_area_educacao?: boolean | null;
  quantidade_curso_area_educacao?: number | null;
  possui_especializacao?: boolean | null;
  quantidade_especializacao?: number | null;
  possui_mestrado?: boolean | null;
  possui_doutorado?: boolean | null;
  tempo_experiencia_dias?: number | null;
  observacao?: string | null;
};

type MockVaga = {
  id_vaga: string;
  nome: string;
  nivel: "FUNDAMENTAL" | "MEDIO" | "SUPERIOR";
};

export function InscricaoPage() {
  const { id } = useParams();
  const idProcesso = id ?? "";

  // =========================
  // MOCKS ESTÁTICOS (SUBSTITUI AS APIS)
  // =========================
  const vagas: MockVaga[] = useMemo(
    () => [
      { id_vaga: "v1", nome: "Auxiliar Administrativo", nivel: "MEDIO" },
      { id_vaga: "v2", nome: "Analista de Sistemas", nivel: "SUPERIOR" },
    ],
    [],
  );

  const perguntas: any[] = useMemo(
    () =>
      [
        {
          id_pergunta: "p1",
          id_processo_seletivo: idProcesso,
          titulo: "Possui CNH?",
          descricao: "Selecione sim ou não.",
          tipo: "BOOLEAN",
          obrigatoria: true,
          ordem: 1,
          ativa: true,
          regra_json: JSON.stringify({
            require_attachment_if: {
              value: true,
              label: "Anexe sua CNH (frente e verso)",
              mime_types: ["application/pdf", "image/png", "image/jpeg"],
              max_size_mb: 5,
            },
          } satisfies RegraPergunta),
        },
        {
          id_pergunta: "p2",
          id_processo_seletivo: idProcesso,
          titulo: "Quantos anos de experiência você tem na área?",
          descricao: "Informe um número inteiro.",
          tipo: "NUMERO",
          obrigatoria: true,
          ordem: 2,
          ativa: true,
        },
        {
          id_pergunta: "p3",
          id_processo_seletivo: idProcesso,
          titulo: "Fale brevemente sobre você",
          descricao: "Conte um resumo da sua trajetória.",
          tipo: "TEXTO",
          obrigatoria: false,
          ordem: 3,
          ativa: true,
        },
        {
          id_pergunta: "p4",
          id_processo_seletivo: idProcesso,
          titulo: "Turno de preferência",
          tipo: "SELECT",
          obrigatoria: true,
          ordem: 4,
          ativa: true,
          opcoes: [
            {
              id_opcao: "o1",
              label: "Manhã",
              valor: "MANHA",
              ativa: true,
              ordem: 1,
            },
            {
              id_opcao: "o2",
              label: "Tarde",
              valor: "TARDE",
              ativa: true,
              ordem: 2,
            },
            {
              id_opcao: "o3",
              label: "Noite",
              valor: "NOITE",
              ativa: true,
              ordem: 3,
            },
          ],
        },
        {
          id_pergunta: "p5",
          id_processo_seletivo: idProcesso,
          titulo: "Quais tecnologias você domina?",
          tipo: "MULTISELECT",
          obrigatoria: true,
          ordem: 5,
          ativa: true,
          opcoes: [
            {
              id_opcao: "m1",
              label: "React",
              valor: "REACT",
              ativa: true,
              ordem: 1,
            },
            {
              id_opcao: "m2",
              label: "Node.js",
              valor: "NODE",
              ativa: true,
              ordem: 2,
            },
            {
              id_opcao: "m3",
              label: "SQL",
              valor: "SQL",
              ativa: true,
              ordem: 3,
            },
          ],
        },
        {
          id_pergunta: "p6",
          id_processo_seletivo: idProcesso,
          titulo: "Data disponível para início",
          tipo: "DATA",
          obrigatoria: false,
          ordem: 6,
          ativa: true,
        },
      ].filter((p) => p.ativa),
    [idProcesso],
  );

  // Simula uma inscrição carregada do backend
  const [mockInscricao, setMockInscricao] = useState<MockInscricao | null>(
    null,
  );

  // loading fake
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => {
      // você pode trocar pra null, se quiser iniciar sem inscrição
      setMockInscricao({
        id_inscricao: "insc-001",
        id_vaga: null,
        status: "RASCUNHO",
        pontuacao_total: 0,
        numero_inscricao: "2026-000123",
        possui_ensino_fundamental: false,
        possui_ensino_medio: false,
        possui_ensino_superior: false,
        quantidade_ensino_superior: 0,
        possui_curso_area_educacao: false,
        quantidade_curso_area_educacao: 0,
        possui_especializacao: false,
        quantidade_especializacao: 0,
        possui_mestrado: false,
        possui_doutorado: false,
        tempo_experiencia_dias: 0,
        observacao: "",
      });
      setIsLoading(false);
    }, 350);

    return () => clearTimeout(t);
  }, []);

  // =========================
  // FORM
  // =========================
  const defaultValues = useMemo<InscricaoFormData>(
    () => ({
      id_vaga: "",
      possui_ensino_fundamental: false,
      possui_ensino_medio: false,
      possui_ensino_superior: false,
      quantidade_ensino_superior: 0,
      possui_curso_area_educacao: false,
      quantidade_curso_area_educacao: 0,
      possui_especializacao: false,
      quantidade_especializacao: 0,
      possui_mestrado: false,
      possui_doutorado: false,
      tempo_experiencia_dias: 0,
      observacao: "",
    }),
    [],
  );

  const form = useForm<InscricaoFormData>({
    resolver: zodResolver(inscricaoSchema) as any,
    defaultValues,
    mode: "onChange",
  });

  const selectedVagaId = form.watch("id_vaga");

  // =========================
  // RESPOSTAS / ANEXOS (ESTADO LOCAL)
  // =========================
  const [respostas, setRespostas] = useState<Record<string, any>>({});
  const [anexos, setAnexos] = useState<Record<string, File | null>>({});

  // =========================
  // READONLY / LOAD
  // =========================
  const isReadOnly =
    !!mockInscricao?.status && mockInscricao.status !== "RASCUNHO";
  const loadedId = mockInscricao?.id_inscricao;

  useEffect(() => {
    if (!mockInscricao) return;

    form.reset({
      id_vaga: mockInscricao.id_vaga ?? "",
      possui_ensino_fundamental: !!mockInscricao.possui_ensino_fundamental,
      possui_ensino_medio: !!mockInscricao.possui_ensino_medio,
      possui_ensino_superior: !!mockInscricao.possui_ensino_superior,
      quantidade_ensino_superior: mockInscricao.quantidade_ensino_superior ?? 0,
      possui_curso_area_educacao: !!mockInscricao.possui_curso_area_educacao,
      quantidade_curso_area_educacao:
        mockInscricao.quantidade_curso_area_educacao ?? 0,
      possui_especializacao: !!mockInscricao.possui_especializacao,
      quantidade_especializacao: mockInscricao.quantidade_especializacao ?? 0,
      possui_mestrado: !!mockInscricao.possui_mestrado,
      possui_doutorado: !!mockInscricao.possui_doutorado,
      tempo_experiencia_dias: mockInscricao.tempo_experiencia_dias ?? 0,
      observacao: mockInscricao.observacao ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedId]);

  // =========================
  // SAVE / ENVIAR (SEM API)
  // =========================
  const onSave: SubmitHandler<InscricaoFormData> = async (data) => {
    const payload: InscricaoFormData = {
      ...data,
      observacao: data.observacao?.trim() ? data.observacao.trim() : "",
    };

    if (!payload.id_vaga) {
      form.setError("id_vaga", { message: "Selecione uma vaga." });
      return;
    }

    // simula create/update
    setMockInscricao((prev) => ({
      id_inscricao: prev?.id_inscricao ?? "insc-NEW",
      status: "RASCUNHO",
      pontuacao_total: prev?.pontuacao_total ?? 0,
      numero_inscricao: prev?.numero_inscricao ?? "2026-NEW",
      id_vaga: payload.id_vaga,
      possui_ensino_fundamental: payload.possui_ensino_fundamental,
      possui_ensino_medio: payload.possui_ensino_medio,
      possui_ensino_superior: payload.possui_ensino_superior,
      quantidade_ensino_superior: payload.quantidade_ensino_superior,
      possui_curso_area_educacao: payload.possui_curso_area_educacao,
      quantidade_curso_area_educacao: payload.quantidade_curso_area_educacao,
      possui_especializacao: payload.possui_especializacao,
      quantidade_especializacao: payload.quantidade_especializacao,
      possui_mestrado: payload.possui_mestrado,
      possui_doutorado: payload.possui_doutorado,
      tempo_experiencia_dias: payload.tempo_experiencia_dias,
      observacao: payload.observacao,
    }));

    toast.success(mockInscricao ? "Rascunho atualizado!" : "Inscrição criada!");
  };

  function validarPerguntasAntesDeEnviar(): boolean {
    // 1) obrigatórias
    for (const p of perguntas) {
      if (!p.obrigatoria) continue;
      const v = respostas[p.id_pergunta];

      const vazio =
        v === undefined ||
        v === null ||
        v === "" ||
        (Array.isArray(v) && v.length === 0);

      if (vazio) {
        toast.error(`Responda a pergunta obrigatória: "${p.titulo}"`);
        return false;
      }
    }

    // 2) regra de anexo
    for (const p of perguntas) {
      const regra = safeParseRegra(p.regra_json);
      const r = regra?.require_attachment_if;
      if (!r) continue;

      if (p.tipo !== "BOOLEAN") continue;

      const v = !!respostas[p.id_pergunta];
      const precisa = v === r.value;

      if (precisa) {
        const file = anexos[p.id_pergunta];
        if (!file) {
          toast.error(`Anexe: "${r.label}" (pergunta: "${p.titulo}")`);
          return false;
        }

        if (r.max_size_mb && bytesToMb(file.size) > r.max_size_mb) {
          toast.error(
            `Arquivo muito grande em "${p.titulo}". Máximo: ${r.max_size_mb} MB`,
          );
          return false;
        }

        if (r.mime_types?.length && !r.mime_types.includes(file.type)) {
          toast.error(
            `Tipo de arquivo inválido em "${p.titulo}". Permitidos: ${r.mime_types.join(", ")}`,
          );
          return false;
        }
      }
    }

    return true;
  }

  async function onEnviar() {
    if (!selectedVagaId) {
      form.setError("id_vaga", { message: "Selecione uma vaga para enviar." });
      return;
    }

    if (!mockInscricao) {
      toast.error("Salve primeiro para criar a inscrição.");
      return;
    }

    if (isReadOnly) {
      toast.error("Esta inscrição não pode ser enviada neste status.");
      return;
    }

    if (!validarPerguntasAntesDeEnviar()) return;

    setMockInscricao((prev) =>
      prev
        ? {
            ...prev,
            status: "ENVIADA",
          }
        : prev,
    );

    toast.success("Inscrição enviada com sucesso!");
  }

  function renderPergunta(p: Pergunta) {
    const id = p.id_pergunta;
    const regra = safeParseRegra(p.regra_json);
    const r = regra?.require_attachment_if;

    const valor = respostas[id];

    const precisaAnexo =
      p.tipo === "BOOLEAN" && r?.value === true && !!valor === true;

    return (
      <div key={id} style={{ gridColumn: "1 / -1" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
          <b>{p.titulo}</b>
          {p.obrigatoria ? (
            <span style={{ fontSize: 12, color: "#DC2626" }}>*</span>
          ) : null}
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
                  name={`p_${id}`}
                  disabled={isReadOnly}
                  checked={valor === true}
                  onChange={() =>
                    setRespostas((prev) => ({ ...prev, [id]: true }))
                  }
                />
                Sim
              </label>

              <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <input
                  type="radio"
                  name={`p_${id}`}
                  disabled={isReadOnly}
                  checked={valor === false}
                  onChange={() =>
                    setRespostas((prev) => ({ ...prev, [id]: false }))
                  }
                />
                Não
              </label>
            </div>
          ) : null}

          {p.tipo === "NUMERO" ? (
            <S.Input
              type="number"
              disabled={isReadOnly}
              value={valor ?? ""}
              onChange={(e: any) =>
                setRespostas((prev) => ({
                  ...prev,
                  [id]: e.target.value === "" ? "" : Number(e.target.value),
                }))
              }
            />
          ) : null}

          {p.tipo === "TEXTO" ? (
            <S.TextArea
              rows={3}
              disabled={isReadOnly}
              value={valor ?? ""}
              onChange={(e: any) =>
                setRespostas((prev) => ({ ...prev, [id]: e.target.value }))
              }
            />
          ) : null}

          {p.tipo === "SELECT" ? (
            <S.Input
              as="select"
              disabled={isReadOnly}
              value={valor ?? ""}
              onChange={(e: any) =>
                setRespostas((prev) => ({ ...prev, [id]: e.target.value }))
              }
            >
              <option value="">Selecione</option>
              {(p.opcoes ?? [])
                .filter((o) => o.ativa)
                .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0))
                .map((o) => (
                  <option key={o.id_opcao} value={o.valor}>
                    {o.label}
                  </option>
                ))}
            </S.Input>
          ) : null}

          {p.tipo === "MULTISELECT" ? (
            <div style={{ display: "grid", gap: 8 }}>
              {(p.opcoes ?? [])
                .filter((o) => o.ativa)
                .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0))
                .map((o) => {
                  const arr: string[] = Array.isArray(valor) ? valor : [];
                  const checked = arr.includes(o.valor);

                  return (
                    <label
                      key={o.id_opcao}
                      style={{ display: "flex", gap: 8, alignItems: "center" }}
                    >
                      <input
                        type="checkbox"
                        disabled={isReadOnly}
                        checked={checked}
                        onChange={(e) => {
                          const next = e.target.checked
                            ? [...arr, o.valor]
                            : arr.filter((v) => v !== o.valor);
                          setRespostas((prev) => ({ ...prev, [id]: next }));
                        }}
                      />
                      {o.label}
                    </label>
                  );
                })}
            </div>
          ) : null}

          {p.tipo === "DATA" ? (
            <S.Input
              type="date"
              disabled={isReadOnly}
              value={valor ?? ""}
              onChange={(e: any) =>
                setRespostas((prev) => ({ ...prev, [id]: e.target.value }))
              }
            />
          ) : null}
        </div>

        {precisaAnexo ? (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>
              {r?.label ?? "Anexo"}{" "}
              <span style={{ fontSize: 12, color: "#DC2626" }}>*</span>
            </div>

            <input
              type="file"
              disabled={isReadOnly}
              accept={(r?.mime_types ?? []).join(",")}
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setAnexos((prev) => ({ ...prev, [id]: file }));
              }}
            />

            <div style={{ fontSize: 12, opacity: 0.8, marginTop: 6 }}>
              Tipos: {(r?.mime_types ?? []).join(", ")} • Máx:{" "}
              {r?.max_size_mb ?? 5} MB
            </div>

            {anexos[id]?.name ? (
              <div style={{ fontSize: 12, marginTop: 6 }}>
                Selecionado: <b>{anexos[id]!.name}</b>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }

  if (!idProcesso) return <S.Page>Processo inválido.</S.Page>;

  const hasVagas = vagas.length > 0;
  const showSelectVagaHint = !selectedVagaId;

  return (
    <S.Page>
      <S.Header>
        <S.TitleWrap>
          <S.Title>Minha inscrição</S.Title>
          <S.Subtitle>
            Selecione a vaga, preencha seus dados e salve como rascunho. Quando
            estiver tudo certo, envie a inscrição.
          </S.Subtitle>

          {isReadOnly && (
            <S.Helper style={{ marginTop: 6 }}>
              Esta inscrição não pode mais ser editada porque está em{" "}
              <b>{mockInscricao?.status}</b>.
            </S.Helper>
          )}
        </S.TitleWrap>

        <S.HeaderRight>
          {mockInscricao?.status && (
            <S.StatusPill $status={mockInscricao.status}>
              {mockInscricao.status}
            </S.StatusPill>
          )}

          {mockInscricao && (
            <S.Badge>
              <S.BadgeRow>
                <S.BadgeLabel>Pontuação</S.BadgeLabel>
                <S.BadgeValue>{mockInscricao.pontuacao_total}</S.BadgeValue>
              </S.BadgeRow>
              <S.BadgeRow>
                <S.BadgeLabel>Nº inscrição</S.BadgeLabel>
                <S.BadgeValue>{mockInscricao.numero_inscricao}</S.BadgeValue>
              </S.BadgeRow>
            </S.Badge>
          )}
        </S.HeaderRight>
      </S.Header>

      {isLoading ? (
        <S.LoadingState>Carregando...</S.LoadingState>
      ) : (
        <S.Card>
          <S.CardHeader>
            <S.CardHeaderTitle>Formulário de cadastro</S.CardHeaderTitle>
            <S.CardHeaderText>
              Os campos abaixo serão usados para calcular sua pontuação
              automaticamente.
            </S.CardHeaderText>
          </S.CardHeader>

          <S.Form onSubmit={form.handleSubmit(onSave)}>
            <S.Fieldset disabled={isReadOnly}>
              <S.Grid>
                {/* =========================
                    VAGA
                ========================= */}
                <S.Field style={{ gridColumn: "1 / -1" }}>
                  Vaga do processo
                  <S.Input as="select" {...form.register("id_vaga")}>
                    <option value="" disabled>
                      Selecione uma vaga
                    </option>

                    {vagas.map((v) => (
                      <option key={v.id_vaga} value={v.id_vaga}>
                        {v.nome} ({v.nivel})
                      </option>
                    ))}
                  </S.Input>
                  {form.formState.errors.id_vaga?.message && (
                    <S.ErrorText>
                      {form.formState.errors.id_vaga.message}
                    </S.ErrorText>
                  )}
                  {!hasVagas && (
                    <S.Helper>
                      Nenhuma vaga cadastrada/ativa neste processo. Procure a
                      administração.
                    </S.Helper>
                  )}
                  {hasVagas && showSelectVagaHint && (
                    <S.Helper>
                      Selecione uma vaga para carregar sua inscrição.
                    </S.Helper>
                  )}
                </S.Field>

                {/* =========================
                    PERGUNTAS DO PROCESSO
                ========================= */}
                <S.Section>
                  <S.SectionTitle>Perguntas do processo</S.SectionTitle>
                </S.Section>

                {perguntas.length === 0 ? (
                  <S.Helper style={{ gridColumn: "1 / -1" }}>
                    Nenhuma pergunta cadastrada para este processo.
                  </S.Helper>
                ) : (
                  perguntas.map(renderPergunta)
                )}

                {/* resto do seu form... */}
                <S.Field style={{ gridColumn: "1 / -1" }}>
                  Observação
                  <S.TextArea
                    rows={4}
                    placeholder="Opcional (até 500 caracteres)."
                    {...form.register("observacao")}
                  />
                </S.Field>
              </S.Grid>
            </S.Fieldset>

            <S.Actions>
              <S.SecondaryButton
                type="button"
                onClick={() => form.reset(defaultValues)}
                disabled={isReadOnly}
              >
                Limpar
              </S.SecondaryButton>

              <S.PrimaryButton
                type="submit"
                disabled={isReadOnly || !selectedVagaId}
                title={
                  !selectedVagaId
                    ? "Selecione uma vaga para salvar"
                    : "Salvar rascunho"
                }
              >
                {mockInscricao ? "Salvar rascunho" : "Criar inscrição"}
              </S.PrimaryButton>

              <S.PrimaryButton
                type="button"
                onClick={onEnviar}
                disabled={!selectedVagaId || !mockInscricao || isReadOnly}
                title={
                  !selectedVagaId
                    ? "Selecione uma vaga"
                    : !mockInscricao
                      ? "Salve primeiro para criar a inscrição"
                      : isReadOnly
                        ? "Inscrição não pode ser enviada neste status"
                        : "Enviar inscrição"
                }
              >
                Enviar
              </S.PrimaryButton>
            </S.Actions>
          </S.Form>
        </S.Card>
      )}
    </S.Page>
  );
}
