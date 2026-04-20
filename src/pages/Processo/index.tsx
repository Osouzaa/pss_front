import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { FiSearch, FiX } from "react-icons/fi";
import * as S from "./styles";

import { getAllProcessos, type ProcessoSeletivoStatus } from "../../api/get-all-processos";
import { formatDate } from "../../utils/fomartDate.utils";

import { ModalNovoProcesso } from "./components/ModalNovoProcesso";
import { ModalPrimeiroAcesso } from "./components/ModalPrimeiroAcesso";
import { useAuth } from "../../contexts/auth-context";

/* ── anos disponíveis no select ── */
const currentYear = new Date().getFullYear();
const ANOS = Array.from({ length: currentYear - 2019 }, (_, i) => currentYear - i);

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Todos os status" },
  { value: "ABERTO", label: "Aberto" },
  { value: "PRORROGADO", label: "Prorrogado" },
  { value: "EM_ANALISE", label: "Em Análise" },
  { value: "ENCERRADO", label: "Encerrado" },
  { value: "RASCUNHO", label: "Rascunho (admin)" },
];

const LIMIT = 15;

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <S.SkeletonRow key={i}>
          <td><S.SkeletonCell $w="90%" /></td>
          <td><S.SkeletonCell $w="70%" /></td>
          <td><S.SkeletonCell $w="40px" /></td>
          <td><S.SkeletonCell $w="72px" /></td>
          <td><S.SkeletonCell $w="80%" /></td>
          <td><S.SkeletonCell $w="120px" /></td>
        </S.SkeletonRow>
      ))}
    </>
  );
}

export function Processo() {
  const navigate = useNavigate();
  const { user, isAdmin, isPrimeiroAcesso, isLoading: loadingMe } = useAuth();

  const isPerfilIncompleto = useMemo(
    () => user?.tipo === "CANDIDATO" && !user?.id_candidato,
    [user?.tipo, user?.id_candidato],
  );

  /* ── filtros draft (não disparam query) ── */
  const [qDraft, setQDraft] = useState("");
  const [statusDraft, setStatusDraft] = useState<ProcessoSeletivoStatus | "">("");
  const [anoDraft, setAnoDraft] = useState<number | "">("");

  /* ── filtros aplicados (disparam query) ── */
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<ProcessoSeletivoStatus | "">("");
  const [ano, setAno] = useState<number | "">("");

  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [openFirstAccess, setOpenFirstAccess] = useState(false);

  const hasFilters = Boolean(q || status || ano);

  const { data: result, isLoading, isError } = useQuery({
    queryKey: ["all-processos", page, q, status, ano],
    queryFn: () =>
      getAllProcessos({
        page,
        limit: LIMIT,
        q: q || undefined,
        status: status || undefined,
        ano: ano || undefined,
      }),
    enabled: !loadingMe,
  });

  const meta = result?.meta;
  const items = result?.items ?? [];

  useEffect(() => {
    if (loadingMe) return;
    setOpenFirstAccess(user?.tipo === "CANDIDATO" && !!isPrimeiroAcesso);
  }, [loadingMe, user?.tipo, isPrimeiroAcesso]);

  function applyFilter() {
    setPage(1);
    setQ(qDraft.trim());
    setStatus(statusDraft);
    setAno(anoDraft);
  }

  function clearFilter() {
    setQDraft("");
    setStatusDraft("");
    setAnoDraft("");
    setPage(1);
    setQ("");
    setStatus("");
    setAno("");
  }

  function handleSubscribe(id: string) {
    if (isPerfilIncompleto) { navigate("/perfil"); return; }
    navigate(`/processos/${id}/inscricao/`);
  }

  const canSubscribe = (s: string) => s === "ABERTO" || s === "PRORROGADO";

  return (
    <S.ContainerProcesso>
      {/* ── alerta perfil incompleto ── */}
      {isPerfilIncompleto && (
        <S.ProfileWarn>
          <S.ProfileWarnInfo>
            <S.ProfileWarnTitle>Atualize seu perfil</S.ProfileWarnTitle>
            <S.ProfileWarnText>
              Para se inscrever em um processo, complete suas informações no Perfil.
            </S.ProfileWarnText>
          </S.ProfileWarnInfo>
          <S.ProfileWarnButton type="button" onClick={() => navigate("/perfil")}>
            Atualizar agora
          </S.ProfileWarnButton>
        </S.ProfileWarn>
      )}

      {/* ── cabeçalho ── */}
      <S.PageHeader>
        <S.TitleArea>
          <S.Title>Processos</S.Title>
          <S.Subtitle>Consulte os processos disponíveis e faça sua inscrição.</S.Subtitle>
        </S.TitleArea>
        <S.HeaderActions>
          {isAdmin && (
            <S.CreateButton type="button" onClick={() => setOpenModal(true)}>
              + Criar processo
            </S.CreateButton>
          )}
        </S.HeaderActions>
      </S.PageHeader>

      {/* ── barra de filtros ── */}
      <S.Toolbar>
        {/* busca por texto */}
        <S.FilterGroup style={{ flex: 2, minWidth: 200 }}>
          <S.FilterLabel htmlFor="q">
            <FiSearch size={11} style={{ marginRight: 4 }} />
            Buscar
          </S.FilterLabel>
          <S.SearchInput
            id="q"
            value={qDraft}
            onChange={(e) => setQDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") applyFilter(); }}
            placeholder="Título, secretaria..."
          />
        </S.FilterGroup>

        {/* filtro status */}
        <S.FilterGroup style={{ minWidth: 160 }}>
          <S.FilterLabel htmlFor="status">Status</S.FilterLabel>
          <S.FilterSelect
            id="status"
            value={statusDraft}
            onChange={(e) => setStatusDraft(e.target.value as ProcessoSeletivoStatus | "")}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </S.FilterSelect>
        </S.FilterGroup>

        {/* filtro ano */}
        <S.FilterGroup style={{ minWidth: 120 }}>
          <S.FilterLabel htmlFor="ano">Ano</S.FilterLabel>
          <S.FilterSelect
            id="ano"
            value={anoDraft}
            onChange={(e) =>
              setAnoDraft(e.target.value ? Number(e.target.value) : "")
            }
          >
            <option value="">Todos</option>
            {ANOS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </S.FilterSelect>
        </S.FilterGroup>

        {/* ações */}
        <S.FilterActions>
          <S.FilterButton type="button" onClick={applyFilter}>
            Filtrar
          </S.FilterButton>
          <S.ClearButton
            type="button"
            onClick={clearFilter}
            disabled={!qDraft && !statusDraft && !anoDraft && !hasFilters}
            title="Limpar filtros"
          >
            <FiX size={13} />
          </S.ClearButton>
        </S.FilterActions>

        {/* contador */}
        {meta && (
          <S.Counter>
            <b>{meta.total}</b>&nbsp;{meta.total === 1 ? "processo" : "processos"}
            <S.CounterMuted>· Página {meta.page} de {meta.pages}</S.CounterMuted>
          </S.Counter>
        )}
      </S.Toolbar>

      {/* ── tabela ── */}
      <S.TableCard>
        <S.TableScrollWrap>
          <S.Table>
            <S.Thead>
              <tr>
                <S.Th>Título</S.Th>
                <S.Th>Secretaria</S.Th>
                <S.Th $center>Ano</S.Th>
                <S.Th>Status</S.Th>
                <S.Th>Período de Inscrições</S.Th>
                <S.Th $small>Ações</S.Th>
              </tr>
            </S.Thead>

            <S.Tbody>
              {isLoading ? (
                <SkeletonRows />
              ) : isError ? (
                <tr>
                  <td colSpan={6}>
                    <S.EmptyState>
                      <S.EmptyTitle>Não foi possível carregar</S.EmptyTitle>
                      <S.EmptyText>Verifique sua conexão e tente novamente.</S.EmptyText>
                    </S.EmptyState>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <S.EmptyState>
                      <S.EmptyTitle>Nenhum processo encontrado</S.EmptyTitle>
                      <S.EmptyText>
                        {hasFilters
                          ? "Tente ajustar os filtros."
                          : isAdmin
                          ? "Crie o primeiro processo."
                          : "Não há processos disponíveis no momento."}
                      </S.EmptyText>
                    </S.EmptyState>
                  </td>
                </tr>
              ) : (
                items.map((p) => {
                  const inscricaoDesabilitada =
                    !canSubscribe(p.status) || isPerfilIncompleto;
                  const tooltipInscricao = isPerfilIncompleto
                    ? "Complete seu perfil para se inscrever"
                    : !canSubscribe(p.status)
                    ? "Inscrições não estão abertas"
                    : undefined;

                  return (
                    <S.Tr key={p.id_processo_seletivo}>
                      <S.TdTitle>
                        <S.TitleText title={p.titulo}>{p.titulo}</S.TitleText>
                      </S.TdTitle>

                      <S.Td $muted={!p.secretaria}>
                        {p.secretaria ?? "—"}
                      </S.Td>

                      <S.Td $center>{p.ano}</S.Td>

                      <S.Td>
                        <S.StatusPill $status={p.status}>{p.status}</S.StatusPill>
                      </S.Td>

                      <S.Td $muted>
                        {formatDate(p.data_inicio_inscricoes)}
                        {" — "}
                        {formatDate(p.data_fim_inscricoes)}
                      </S.Td>

                      <S.TdActions>
                        <S.ActionGroup>
                          <S.SecondaryButton
                            type="button"
                            onClick={() =>
                              navigate(`/processos_detalhes/${p.id_processo_seletivo}`)
                            }
                          >
                            Detalhes
                          </S.SecondaryButton>

                          <S.PrimaryButton
                            type="button"
                            disabled={inscricaoDesabilitada}
                            title={tooltipInscricao}
                            onClick={() => handleSubscribe(p.id_processo_seletivo)}
                          >
                            Inscrever
                          </S.PrimaryButton>

                          {isAdmin && (
                            <S.SecondaryButton
                              type="button"
                              onClick={() =>
                                navigate(`/all-inscricoes/${p.id_processo_seletivo}`)
                              }
                            >
                              Inscrições
                            </S.SecondaryButton>
                          )}
                        </S.ActionGroup>
                      </S.TdActions>
                    </S.Tr>
                  );
                })
              )}
            </S.Tbody>
          </S.Table>
        </S.TableScrollWrap>
      </S.TableCard>

      {/* ── paginação ── */}
      {meta && meta.pages > 1 && (
        <S.Pagination>
          <S.PageButton
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={meta.page <= 1}
          >
            ← Anterior
          </S.PageButton>

          <S.PageInfo>
            Página <b>{meta.page}</b> de <b>{meta.pages}</b>
          </S.PageInfo>

          <S.PageButton
            type="button"
            onClick={() => setPage((p) => Math.min(meta.pages, p + 1))}
            disabled={meta.page >= meta.pages}
          >
            Próxima →
          </S.PageButton>
        </S.Pagination>
      )}

      {isAdmin && (
        <ModalNovoProcesso open={openModal} onOpenChange={setOpenModal} />
      )}

      <ModalPrimeiroAcesso
        open={openFirstAccess}
        onOpenChange={setOpenFirstAccess}
        lockClose={true}
        onGoProfile={() => navigate("/perfil")}
      />
    </S.ContainerProcesso>
  );
}
