import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as S from "./styles";
import {
  getAllVagasProcessoId,
  type ProcessoSeletivoVaga,
} from "../../api/get-all-vagas-processoId";
import {
  getProcessoId,
  type ProcessoSeletivoResponse,
} from "../../api/get-processo-id";
import { api } from "../../lib/axios";
import { ModalScoreSection } from "./components/ModalScoreSection";
import { ModalDesempateSection } from "./components/ModalDesempateSection";
import { ModalDocumentosSection } from "./components/ModalDocumentosSection";
import { ModalAvaliacaoSection } from "./components/ModalAvaliacaoSection";

// ─── tipos ────────────────────────────────────────────────────
type AvaliacaoResultado = "APROVADO" | "REPROVADO";

type Vaga = {
  id_vaga: string;
  nome: string;
  nivel?: string;
  quantidade_de_vagas?: number;
};

type Candidato = {
  id_candidato: string;
  nome_completo: string;
  cpf: string;
  data_nascimento?: string | null;
};

type Usuario = {
  id_usuario: string;
  candidato?: Candidato | null;
};

type Inscricao = {
  id_inscricao: string;
  id_processo_seletivo: string;
  id_vaga?: string;
  status: string;
  protocolo: string;
  pontuacao_total?: number | null;
  pontuacao_detalhe_json?: string | null;
  classificacao?: number | null;
  experiencia_dias?: number | null;
  especializacao_pontos?: number | null;
  data_envio?: string | null;
  data_criacao?: string | null;
  usuario?: Usuario | null;
  vaga?: Vaga | null;
  avaliacao_resultado?: AvaliacaoResultado | null;
  motivo_reprovacao?: string | null;
  data_avaliacao?: string | null;
  classificacao_antes_reprovacao?: number | null;
};

type DetalheItem = {
  id_pergunta: string;
  titulo: string;
  tipo: string;
  pontos: number;
};

type ModalDetalhe = {
  inscricao: Inscricao;
  detalhes: DetalheItem[];
};

type Documento = {
  id_candidato_documento: string;
  tipo: string;
  descricao?: string | null;
  data_criacao?: string | null;
  arquivo: {
    id_arquivo: string;
    nome_original: string;
    mime_type: string;
    tamanho_bytes: number;
  };
};

type PaginatedResponse<T> = {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

// ─── helpers ──────────────────────────────────────────────────
function onlyDigits(v: string) {
  return (v ?? "").replace(/\D/g, "");
}

function formatCPF(v?: string | null) {
  const d = onlyDigits(v ?? "");
  if (d.length !== 11) return v ?? "—";
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

function formatDateBR(v?: string | null) {
  if (!v) return "—";
  const dt = new Date(v);
  if (Number.isNaN(dt.getTime())) return "—";
  return dt.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
}

function formatDateTimeBR(v?: string | null) {
  if (!v) return "—";
  const dt = new Date(v);
  if (Number.isNaN(dt.getTime())) return "—";
  return dt.toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusTone(status: string) {
  const s = (status || "").toUpperCase();
  if (s === "ENVIADA" || s === "APROVADO") return "success" as const;
  if (s === "RASCUNHO" || s === "ANALISE") return "warning" as const;
  if (s === "CANCELADA" || s === "REPROVADO") return "danger" as const;
  return "default" as const;
}

function processoStatusLabel(status?: string | null) {
  const map: Record<string, string> = {
    RASCUNHO: "Rascunho",
    ABERTO: "Aberto",
    EM_ANALISE: "Em Análise",
    EM_ANDAMENTO: "Em Andamento",
    ENCERRADO: "Encerrado",
  };
  return status ? (map[status] ?? status) : null;
}

// ─── componente ───────────────────────────────────────────────
export function InscricoesAdmin() {
  const params = useParams();
  const id_processo_seletivo =
    (params as any)?.id_processo_seletivo || (params as any)?.idProcesso;

  const queryClient = useQueryClient();

  const [idVaga, setIdVaga] = useState<string>("ALL");
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [debNome, setDebNome] = useState("");
  const [debCpf, setDebCpf] = useState("");
  const [modalDetalhe, setModalDetalhe] = useState<ModalDetalhe | null>(null);
  const [decisaoPendente, setDecisaoPendente] =
    useState<AvaliacaoResultado | null>(null);
  const [motivoReprovacao, setMotivoReprovacao] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      setDebNome(nome.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [nome]);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebCpf(onlyDigits(cpf));
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [cpf]);

  useEffect(() => {
    setPage(1);
  }, [idVaga, limit]);

  useEffect(() => {
    if (!modalDetalhe) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") fecharModal();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [modalDetalhe]);

  // ─── queries ────────────────────────────────────────────────
  const processoQuery = useQuery<ProcessoSeletivoResponse>({
    queryKey: ["processo-seletivo", id_processo_seletivo],
    enabled: Boolean(id_processo_seletivo),
    queryFn: () => getProcessoId(id_processo_seletivo),
    staleTime: 300_000,
  });

  const inscricoesQuery = useQuery({
    queryKey: [
      "inscricoes-admin",
      id_processo_seletivo,
      page,
      limit,
      idVaga,
      debNome,
      debCpf,
    ],
    enabled: Boolean(id_processo_seletivo),
    queryFn: async () => {
      const q: Record<string, any> = { page, limit };
      if (idVaga !== "ALL") q.id_vaga = idVaga;
      if (debNome) q.nome = debNome;
      if (debCpf) q.cpf = debCpf;
      const { data } = await api.get<PaginatedResponse<Inscricao>>(
        `processos-seletivos-inscricoes/all/${id_processo_seletivo}`,
        { params: q },
      );
      return data;
    },
    staleTime: 10_000,
  });

  const vagasQuery = useQuery({
    queryKey: ["vagas-do-processo", id_processo_seletivo],
    enabled: Boolean(id_processo_seletivo),
    queryFn: () => getAllVagasProcessoId(id_processo_seletivo, { limit: 100 }),
    staleTime: 60_000,
  });

  const idCandidatoModal =
    modalDetalhe?.inscricao.usuario?.candidato?.id_candidato;

  const documentosQuery = useQuery<Documento[]>({
    queryKey: ["documentos-candidato", idCandidatoModal],
    enabled: Boolean(idCandidatoModal),
    queryFn: async () => {
      const { data } = await api.get(
        `processo-seletivo-candidatos/me/documentos/candidato/${idCandidatoModal}`,
      );
      return data;
    },
    staleTime: 30_000,
  });

  // ─── mutation ────────────────────────────────────────────────
  const avaliarMutation = useMutation({
    mutationFn: ({
      resultado,
      motivo,
    }: {
      resultado: AvaliacaoResultado;
      motivo?: string;
    }) =>
      api.patch(
        `processos-seletivos-inscricoes/${modalDetalhe!.inscricao.id_inscricao}/avaliar`,
        {
          avaliacao_resultado: resultado,
          classificacao_atual: modalDetalhe!.inscricao.classificacao ?? null,
          ...(resultado === "REPROVADO" && { motivo_reprovacao: motivo }),
        },
      ),
    onSuccess: (_, variables) => {
      // atualiza o modal localmente sem fechar
      setModalDetalhe((prev) =>
        prev
          ? {
              ...prev,
              inscricao: {
                ...prev.inscricao,
                avaliacao_resultado: variables.resultado,
                motivo_reprovacao:
                  variables.resultado === "REPROVADO"
                    ? (variables.motivo ?? null)
                    : null,
                data_avaliacao: new Date().toISOString(),
                classificacao_antes_reprovacao:
                  variables.resultado === "REPROVADO"
                    ? (prev.inscricao.classificacao ?? null)
                    : null,
              },
            }
          : null,
      );
      setDecisaoPendente(null);
      setMotivoReprovacao(
        variables.resultado === "REPROVADO" ? (variables.motivo ?? "") : "",
      );
      queryClient.invalidateQueries({ queryKey: ["inscricoes-admin"] });
    },
  });

  // ─── derivados ──────────────────────────────────────────────
  const vagas = useMemo<Vaga[]>(() => {
    if (vagasQuery.data?.items?.length) {
      return vagasQuery.data.items
        .map((v: ProcessoSeletivoVaga) => ({
          id_vaga: v.id_vaga,
          nome: v.nome,
          nivel: v.nivel,
          quantidade_de_vagas: v.quantidade_de_vagas,
        }))
        .sort((a, b) => (a.nome || "").localeCompare(b.nome || ""));
    }
    const map = new Map<string, Vaga>();
    for (const i of inscricoesQuery.data?.data ?? []) {
      if (i?.vaga?.id_vaga) map.set(i.vaga.id_vaga, i.vaga);
      else if (i?.id_vaga)
        map.set(i.id_vaga, { id_vaga: i.id_vaga, nome: i.id_vaga });
    }
    return Array.from(map.values()).sort((a, b) =>
      (a.nome || "").localeCompare(b.nome || ""),
    );
  }, [vagasQuery.data, inscricoesQuery.data]);

  const nivelVagaSelecionada = useMemo(() => {
    if (idVaga === "ALL") return null;
    const vaga = vagas.find((v) => v.id_vaga === idVaga);
    return (vaga?.nivel ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase();
  }, [idVaga, vagas]);

  const mostrarEspecializacao = nivelVagaSelecionada === "SUPERIOR";

  const serverData = inscricoesQuery.data?.data ?? [];
  const total = inscricoesQuery.data?.total ?? 0;
  const totalPages = inscricoesQuery.data?.totalPages ?? 1;
  const processo = processoQuery.data;
  const isLoading = inscricoesQuery.isLoading;
  const isError = inscricoesQuery.isError;
  const isVagasLoading = vagasQuery.isLoading;

  // ─── ações ──────────────────────────────────────────────────
  function fecharModal() {
    setModalDetalhe(null);
    setDecisaoPendente(null);
    setMotivoReprovacao("");
  }

  function abrirDetalhe(i: Inscricao) {
    let detalhes: DetalheItem[] = [];
    try {
      detalhes = i.pontuacao_detalhe_json
        ? JSON.parse(i.pontuacao_detalhe_json)
        : [];
    } catch {
      detalhes = [];
    }
    setDecisaoPendente(null);
    setMotivoReprovacao(i.motivo_reprovacao ?? "");
    setModalDetalhe({ inscricao: i, detalhes });
  }

  function clearFilters() {
    setIdVaga("ALL");
    setNome("");
    setCpf("");
    setPage(1);
    setLimit(20);
  }

  function urlDocumentoView(idDoc: string) {
    const base = (api.defaults.baseURL ?? "").replace(/\/$/, "");
    return `${base}/processo-seletivo-candidatos/me/documentos/documento/${idDoc}/view`;
  }

  // ─── render ─────────────────────────────────────────────────
  return (
    <S.Page>
      {/* ── HEADER ── */}
      <S.Header>
        <S.HeaderLeft>
          <S.Breadcrumb>Processos Seletivos / Inscrições</S.Breadcrumb>
          <S.TitleRow>
            <S.Title>
              {processoQuery.isLoading
                ? "Carregando..."
                : (processo?.titulo ?? "Inscrições do Processo Seletivo")}
            </S.Title>
            {processo?.status && (
              <S.StatusBadge $status={processo.status}>
                {processoStatusLabel(processo.status)}
              </S.StatusBadge>
            )}
          </S.TitleRow>
          <S.MetaRow>
            {processo?.secretaria && (
              <S.MetaItem>{processo.secretaria}</S.MetaItem>
            )}
            {processo?.ano && <S.MetaItem>{processo.ano}</S.MetaItem>}
            {processo?.data_inicio_inscricoes &&
              processo?.data_fim_inscricoes && (
                <S.MetaItem>
                  {formatDateTimeBR(processo.data_inicio_inscricoes)} até{" "}
                  {formatDateTimeBR(processo.data_fim_inscricoes)}
                </S.MetaItem>
              )}
          </S.MetaRow>
        </S.HeaderLeft>

        <S.HeaderStats>
          <S.StatItem>
            <S.StatValue>{total}</S.StatValue>
            <S.StatLabel>Total</S.StatLabel>
          </S.StatItem>
          <S.StatDivider />
          <S.StatItem>
            <S.StatValue>{totalPages}</S.StatValue>
            <S.StatLabel>Páginas</S.StatLabel>
          </S.StatItem>
          <S.StatDivider />
          <S.StatItem>
            <S.StatValue>{serverData.length}</S.StatValue>
            <S.StatLabel>Exibindo</S.StatLabel>
          </S.StatItem>
        </S.HeaderStats>
      </S.Header>

      {/* ── CARD ── */}
      <S.Card>
        <S.FiltersBar>
          <S.FiltersLeft>
            <S.Field>
              <S.Label>Vaga</S.Label>
              <S.Select
                value={idVaga}
                onChange={(e) => setIdVaga(e.target.value)}
                disabled={isLoading || isVagasLoading}
              >
                <option value="ALL">
                  {isVagasLoading ? "Carregando..." : "Todas as vagas"}
                </option>
                {vagas.map((v) => (
                  <option key={v.id_vaga} value={v.id_vaga}>
                    {v.nome}
                    {v.nivel ? ` — ${v.nivel}` : ""}
                  </option>
                ))}
              </S.Select>
            </S.Field>

            <S.Field>
              <S.Label>Nome</S.Label>
              <S.Input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Buscar por nome..."
                disabled={isLoading}
              />
            </S.Field>

            <S.Field>
              <S.Label>CPF</S.Label>
              <S.Input
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="Somente números"
                inputMode="numeric"
                disabled={isLoading}
              />
            </S.Field>

            <S.Field>
              <S.Label>Por página</S.Label>
              <S.Select
                value={String(limit)}
                onChange={(e) => setLimit(Number(e.target.value))}
                disabled={isLoading}
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </S.Select>
            </S.Field>
          </S.FiltersLeft>

          <S.Button
            onClick={clearFilters}
            $variant="ghost"
            type="button"
            disabled={isLoading}
          >
            Limpar filtros
          </S.Button>
        </S.FiltersBar>

        {inscricoesQuery.isFetching && !isLoading && <S.FetchingBar />}

        {isError && (
          <S.ErrorBox>
            ⚠ Erro ao carregar inscrições. Verifique a rota{" "}
            <code>/all/:id_processo_seletivo</code>.
          </S.ErrorBox>
        )}

        {!isLoading && !isError && serverData.length === 0 && (
          <S.Empty>Nenhuma inscrição encontrada com os filtros atuais.</S.Empty>
        )}

        <S.TableWrap>
          <S.Table>
            <thead>
              <tr>
                <th style={{ width: 48 }}>#</th>
                <th style={{ width: 120 }}>Protocolo</th>
                <th style={{ width: 200 }}>Candidato</th>
                <th style={{ width: 130 }}>CPF</th>
                <th style={{ width: 100 }}>Nascimento</th>
                <th style={{ width: 180 }}>Vaga</th>
                <th style={{ width: 90 }}>Pontuação</th>
                <th style={{ width: 90 }}>Exp. (dias)</th>
                {mostrarEspecializacao && (
                  <th style={{ width: 110 }}>Especialização</th>
                )}
                <th style={{ width: 100 }}>Status</th>
                {idVaga !== "ALL" && <th style={{ width: 110 }}>Avaliação</th>}
                <th style={{ width: 130 }}>Enviado em</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 6 }).map((_, idx) => (
                    <tr key={idx}>
                      {Array.from({
                        length: mostrarEspecializacao ? 12 : 11,
                      }).map((__, c) => (
                        <td key={c}>
                          <S.Skeleton />
                        </td>
                      ))}
                    </tr>
                  ))
                : serverData.map((i) => {
                    const cand = i.usuario?.candidato;
                    const temDetalhe = i.status === "ENVIADA";
                    return (
                      <tr key={i.id_inscricao}>
                        <td>
                          <S.Rank
                            onClick={() => temDetalhe && abrirDetalhe(i)}
                            title={
                              temDetalhe ? "Ver detalhes / avaliar" : undefined
                            }
                            style={{
                              cursor: temDetalhe ? "pointer" : "default",
                            }}
                          >
                            {i.classificacao ?? "—"}
                          </S.Rank>
                        </td>
                        <td>
                          <S.Mono>
                            <S.TruncatedCell
                              $maxWidth="120px"
                              title={i.protocolo}
                            >
                              {i.protocolo || "—"}
                            </S.TruncatedCell>
                          </S.Mono>
                        </td>
                        <td>
                          <S.TruncatedCell
                            $maxWidth="200px"
                            title={cand?.nome_completo}
                          >
                            {cand?.nome_completo || "—"}
                          </S.TruncatedCell>
                        </td>
                        <td>
                          <S.Mono>{formatCPF(cand?.cpf)}</S.Mono>
                        </td>
                        <td>
                          <S.Mono>{formatDateBR(cand?.data_nascimento)}</S.Mono>
                        </td>
                        <td>
                          <S.TruncatedCell
                            $maxWidth="180px"
                            title={i.vaga?.nome || i.id_vaga}
                          >
                            {i.vaga?.nome || i.id_vaga || "—"}
                          </S.TruncatedCell>
                        </td>
                        <td>
                          <S.Score>{i.pontuacao_total ?? "—"}</S.Score>
                        </td>
                        <td>{i.experiencia_dias ?? "—"}</td>
                        {mostrarEspecializacao && (
                          <td>
                            <S.Score>{i.especializacao_pontos ?? "—"}</S.Score>
                          </td>
                        )}
                        <td>
                          <S.Badge $tone={statusTone(i.status)}>
                            {i.status}
                          </S.Badge>
                        </td>
                        {idVaga !== "ALL" && (
                          <td>
                            {i.avaliacao_resultado ? (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "0.25rem",
                                }}
                              >
                                <S.Badge
                                  $tone={statusTone(i.avaliacao_resultado)}
                                >
                                  {i.avaliacao_resultado}
                                </S.Badge>
                              </div>
                            ) : (
                              <S.Muted>—</S.Muted>
                            )}
                          </td>
                        )}
                        <td>{formatDateTimeBR(i.data_envio)}</td>
                      </tr>
                    );
                  })}
            </tbody>
          </S.Table>
        </S.TableWrap>

        <S.Footer>
          <S.Muted>
            {total > 0
              ? `Exibindo ${serverData.length} de ${total} inscrições`
              : "Nenhum resultado"}
          </S.Muted>
          <S.Pagination>
            <S.Button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || isLoading}
            >
              ← Anterior
            </S.Button>
            <S.PageInfo>
              {page} / {totalPages}
            </S.PageInfo>
            <S.Button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || isLoading}
              $variant="primary"
            >
              Próxima →
            </S.Button>
          </S.Pagination>
        </S.Footer>
      </S.Card>

      {/* ── MODAL DE DETALHES ── */}
      {modalDetalhe && (
        <S.Overlay onClick={fecharModal}>
          <S.Modal onClick={(e) => e.stopPropagation()}>
            <S.ModalHeader>
              <div>
                <S.ModalTitle>Detalhes da Classificação</S.ModalTitle>
                <S.ModalSub>
                  {modalDetalhe.inscricao.usuario?.candidato?.nome_completo} —
                  {modalDetalhe.inscricao.classificacao
                    ? ` Posição #${modalDetalhe.inscricao.classificacao}`
                    : " Sem classificação"}
                </S.ModalSub>
              </div>
              <S.ModalClose onClick={fecharModal}>✕</S.ModalClose>
            </S.ModalHeader>

            <S.ModalBody>
              <ModalScoreSection
                pontuacao_total={modalDetalhe.inscricao.pontuacao_total}
                experiencia_dias={modalDetalhe.inscricao.experiencia_dias}
                especializacao_pontos={
                  modalDetalhe.inscricao.especializacao_pontos
                }
                dataNascimento={
                  modalDetalhe.inscricao.usuario?.candidato?.data_nascimento
                }
                mostrarEspecializacao={mostrarEspecializacao}
              />

              <ModalDesempateSection
                mostrarEspecializacao={mostrarEspecializacao}
              />

              <ModalDocumentosSection
                isLoading={documentosQuery.isLoading}
                isError={documentosQuery.isError}
                documentos={documentosQuery.data}
                urlDocumentoView={urlDocumentoView}
              />

              <ModalAvaliacaoSection
                avaliacaoResultado={modalDetalhe.inscricao.avaliacao_resultado}
                motivoReprovacao={motivoReprovacao}
                dataAvaliacao={modalDetalhe.inscricao.data_avaliacao}
                classificacaoAntesReprovacao={
                  modalDetalhe.inscricao.classificacao_antes_reprovacao
                }
                decisaoPendente={decisaoPendente}
                isPending={avaliarMutation.isPending}
                isError={avaliarMutation.isError}
                onAprovar={() => setDecisaoPendente("APROVADO")}
                onReprovar={() => setDecisaoPendente("REPROVADO")}
                onConfirmar={() =>
                  avaliarMutation.mutate({
                    resultado: decisaoPendente!,
                    motivo: motivoReprovacao.trim(),
                  })
                }
                onCancelar={() => {
                  setDecisaoPendente(null);
                  setMotivoReprovacao("");
                }}
                onChangeMotivoReprovacao={setMotivoReprovacao}
                onEditar={() => {
                  setDecisaoPendente(null);
                  setMotivoReprovacao("");
                }}
              />
            </S.ModalBody>
          </S.Modal>
        </S.Overlay>
      )}
    </S.Page>
  );
}
