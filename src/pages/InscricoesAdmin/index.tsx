import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
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

// ─── tipos ────────────────────────────────────────────────────
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

function calcIdade(dataNascimento?: string | null): string {
  if (!dataNascimento) return "—";
  const anos = Math.floor(
    (Date.now() - new Date(dataNascimento).getTime()) /
      (1000 * 60 * 60 * 24 * 365.25),
  );
  return `${anos} anos`;
}

function statusTone(status: string) {
  const s = (status || "").toUpperCase();
  if (s === "ENVIADA" || s === "DEFERIDA") return "success" as const;
  if (s === "RASCUNHO" || s === "ANALISE") return "warning" as const;
  if (s === "CANCELADA" || s === "INDEFERIDA") return "danger" as const;
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

  const [idVaga, setIdVaga] = useState<string>("ALL");
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [debNome, setDebNome] = useState("");
  const [debCpf, setDebCpf] = useState("");
  const [modalDetalhe, setModalDetalhe] = useState<ModalDetalhe | null>(null);

  useEffect(() => {
    const t = setTimeout(() => { setDebNome(nome.trim()); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [nome]);

  useEffect(() => {
    const t = setTimeout(() => { setDebCpf(onlyDigits(cpf)); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [cpf]);

  useEffect(() => { setPage(1); }, [idVaga, limit]);

  // fecha modal com ESC
  useEffect(() => {
    if (!modalDetalhe) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalDetalhe(null);
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
      if (debCpf)  q.cpf  = debCpf;

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
  const total      = inscricoesQuery.data?.total      ?? 0;
  const totalPages = inscricoesQuery.data?.totalPages ?? 1;
  const processo   = processoQuery.data;

  const isLoading      = inscricoesQuery.isLoading;
  const isError        = inscricoesQuery.isError;
  const isVagasLoading = vagasQuery.isLoading;

  // ─── ações ──────────────────────────────────────────────────
  function abrirDetalhe(i: Inscricao) {
    let detalhes: DetalheItem[] = [];
    try {
      detalhes = i.pontuacao_detalhe_json
        ? JSON.parse(i.pontuacao_detalhe_json)
        : [];
    } catch {
      detalhes = [];
    }
    setModalDetalhe({ inscricao: i, detalhes });
  }

  function clearFilters() {
    setIdVaga("ALL");
    setNome("");
    setCpf("");
    setPage(1);
    setLimit(20);
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
        {/* filtros */}
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
          <S.Empty>
            Nenhuma inscrição encontrada com os filtros atuais.
          </S.Empty>
        )}

        {/* tabela */}
        <S.TableWrap>
          <S.Table>
            <thead>
              <tr>
                <th style={{ width: 48 }}>#</th>
                <th>Protocolo</th>
                <th>Candidato</th>
                <th>CPF</th>
                <th>Nascimento</th>
                <th>Vaga</th>
                <th>Pontuação</th>
                <th>Exp. (dias)</th>
                {mostrarEspecializacao && <th>Especialização</th>}
                <th>Status</th>
                <th>Enviado em</th>
              </tr>
            </thead>

            <tbody>
              {isLoading
                ? Array.from({ length: 6 }).map((_, idx) => (
                    <tr key={idx}>
                      {Array.from({
                        length: mostrarEspecializacao ? 11 : 10,
                      }).map((__, c) => (
                        <td key={c}>
                          <S.Skeleton />
                        </td>
                      ))}
                    </tr>
                  ))
                : serverData.map((i) => {
                    const cand = i.usuario?.candidato;
                    const temDetalhe = Boolean(i.classificacao);

                    return (
                      <tr key={i.id_inscricao}>
                        <td>
                          <S.Rank
                            onClick={() => temDetalhe && abrirDetalhe(i)}
                            title={
                              temDetalhe
                                ? "Ver detalhes da classificação"
                                : undefined
                            }
                          >
                            {i.classificacao ?? "—"}
                          </S.Rank>
                        </td>
                        <td>
                          <S.Mono>{i.protocolo || "—"}</S.Mono>
                        </td>
                        <td title={cand?.nome_completo}>
                          {cand?.nome_completo || "—"}
                        </td>
                        <td>
                          <S.Mono>{formatCPF(cand?.cpf)}</S.Mono>
                        </td>
                        <td>
                          <S.Mono>{formatDateBR(cand?.data_nascimento)}</S.Mono>
                        </td>
                        <td>{i.vaga?.nome || i.id_vaga || "—"}</td>
                        <td>
                          <S.Score>{i.pontuacao_total ?? "—"}</S.Score>
                        </td>
                        <td>{i.experiencia_dias ?? "—"}</td>
                        {mostrarEspecializacao && (
                          <td>
                            <S.Score>
                              {i.especializacao_pontos ?? "—"}
                            </S.Score>
                          </td>
                        )}
                        <td>
                          <S.Badge $tone={statusTone(i.status)}>
                            {i.status}
                          </S.Badge>
                        </td>
                        <td>{formatDateTimeBR(i.data_envio)}</td>
                      </tr>
                    );
                  })}
            </tbody>
          </S.Table>
        </S.TableWrap>

        {/* footer paginação */}
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
        <S.Overlay onClick={() => setModalDetalhe(null)}>
          <S.Modal onClick={(e) => e.stopPropagation()}>
            <S.ModalHeader>
              <div>
                <S.ModalTitle>Detalhes da Classificação</S.ModalTitle>
                <S.ModalSub>
                  {modalDetalhe.inscricao.usuario?.candidato?.nome_completo} —
                  Posição{" "}
                  <strong>#{modalDetalhe.inscricao.classificacao}</strong>
                </S.ModalSub>
              </div>
              <S.ModalClose onClick={() => setModalDetalhe(null)}>
                ✕
              </S.ModalClose>
            </S.ModalHeader>

            <S.ModalBody>
              {/* resumo */}
              <S.ModalScoreRow>
                <S.ModalScoreBox>
                  <S.StatValue>
                    {modalDetalhe.inscricao.pontuacao_total ?? 0}
                  </S.StatValue>
                  <S.StatLabel>Pontuação total</S.StatLabel>
                </S.ModalScoreBox>

                <S.ModalScoreBox>
                  <S.StatValue>
                    {modalDetalhe.inscricao.experiencia_dias ?? 0}
                  </S.StatValue>
                  <S.StatLabel>Dias de experiência</S.StatLabel>
                </S.ModalScoreBox>

                {mostrarEspecializacao && (
                  <S.ModalScoreBox>
                    <S.StatValue>
                      {modalDetalhe.inscricao.especializacao_pontos ?? 0}
                    </S.StatValue>
                    <S.StatLabel>Pts titulação</S.StatLabel>
                  </S.ModalScoreBox>
                )}

                <S.ModalScoreBox>
                  <S.StatValue>
                    {calcIdade(
                      modalDetalhe.inscricao.usuario?.candidato
                        ?.data_nascimento,
                    )}
                  </S.StatValue>
                  <S.StatLabel>Idade</S.StatLabel>
                </S.ModalScoreBox>
              </S.ModalScoreRow>

              {/* critérios de desempate */}
              <S.ModalSection>
                <S.ModalSectionTitle>
                  Critérios de desempate (ordem)
                </S.ModalSectionTitle>
                <S.TieList>
                  <S.TieItem>
                    <S.TieNum>1</S.TieNum> Maior pontuação total
                  </S.TieItem>
                  <S.TieItem>
                    <S.TieNum>2</S.TieNum> Prioridade idade ≥ 60 anos
                  </S.TieItem>
                  {mostrarEspecializacao && (
                    <S.TieItem>
                      <S.TieNum>3</S.TieNum> Maior pontuação em titulação
                      (especialização + mestrado + doutorado)
                    </S.TieItem>
                  )}
                  <S.TieItem>
                    <S.TieNum>{mostrarEspecializacao ? 4 : 3}</S.TieNum> Maior
                    tempo de experiência
                  </S.TieItem>
                  <S.TieItem>
                    <S.TieNum>{mostrarEspecializacao ? 5 : 4}</S.TieNum> Mais
                    velho (data de nascimento)
                  </S.TieItem>
                </S.TieList>
              </S.ModalSection>

              {/* detalhes por pergunta */}
              {modalDetalhe.detalhes.length > 0 && (
                <S.ModalSection>
                  <S.ModalSectionTitle>
                    Pontuação por critério
                  </S.ModalSectionTitle>
                  <S.DetalheTable>
                    <thead>
                      <tr>
                        <th>Critério</th>
                        <th>Tipo</th>
                        <th style={{ textAlign: "right" }}>Pontos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {modalDetalhe.detalhes.map((d) => (
                        <tr key={d.id_pergunta}>
                          <td>{d.titulo}</td>
                          <td>
                            <S.Mono>{d.tipo}</S.Mono>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <S.Score>{d.pontos}</S.Score>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </S.DetalheTable>
                </S.ModalSection>
              )}
            </S.ModalBody>
          </S.Modal>
        </S.Overlay>
      )}
    </S.Page>
  );
}