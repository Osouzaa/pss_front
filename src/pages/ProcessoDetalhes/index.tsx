// ProcessoSeletivosDetalhes.tsx
import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as S from "./styles";

import { getProcessoId } from "../../api/get-processo-id";
import { ModalNovaVaga } from "./components/ModalNovaVaga";
import { ModalNovoProcesso } from "../Processo/components/ModalNovoProcesso";

import { toast } from "sonner";

import { useAuth } from "../../contexts/auth-context";
import { formatDate } from "../../utils/fomartDate.utils";
import { TablePerguntas } from "./components/TablePerguntas";
import { ModalNovaPergunta } from "./components/ModalNovaPerguntas";
import { buscarPerguntasProcessos } from "../../api/buscar-perguntas-processos";
import { getAllVagasProcessoId } from "../../api/get-all-vagas-processoId";

import { Pagination } from "../../components/Pagination";
import { TokenSistems } from "../../constants/env.constantes";
import { excluirVaga } from "../../api/deleta-vaga";
import { api } from "../../lib/axios";

// ─── helpers ─────────────────────────────────────────────────────────────────

function normalizeText(s: string) {
  return (s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Debounce simples sem dependência externa.
 * Retorna o valor estabilizado após `delay` ms sem mudança.
 */
function useDebouncedValue<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

// ─── tabs ─────────────────────────────────────────────────────────────────────

const VALID_TABS = ["vagas", "perguntas"] as const;
type TabKey = (typeof VALID_TABS)[number];

function getInitialTab(): TabKey {
  const raw = localStorage.getItem(TokenSistems.TAB_STORAGE_KEY);

  if (!raw || !VALID_TABS.includes(raw as TabKey)) return "vagas";

  return raw as TabKey;
}

// ─── component ───────────────────────────────────────────────────────────────

export function ProcessoSeletivosDetalhes() {
  const { id } = useParams<{ id: string }>();
  const { isAdmin, user } = useAuth();
  const queryClient = useQueryClient();

  const [tab, setTab] = useState<TabKey>(() => getInitialTab());
  const [qVaga, setQVaga] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [vagaToEdit, setVagaToEdit] = useState<any>(null);
  const [openModalEditProcesso, setOpenModalEditProceso] = useState(false);

  const [openModalNovaPergunta, setOpenModalNovaPergunta] = useState(false);
  const [perguntaToEdit, setPerguntaToEdit] = useState<any>(null);

  // ── paginação ──────────────────────────────────────────────────────────────
  const [pageVagas, setPageVagas] = useState(1);
  const [pageSizeVagas, setPageSizeVagas] = useState(10);

  const [pagePerguntas, setPagePerguntas] = useState(1);
  const [pageSizePerguntas, setPageSizePerguntas] = useState(20);

  // ── search com debounce (evita 1 req por tecla) ────────────────────────────
  const qVagaDebounced = useDebouncedValue(qVaga, 400);
  const qVagaNormalized = useMemo(
    () => normalizeText(qVagaDebounced),
    [qVagaDebounced],
  );

  // ── persiste aba no localStorage ──────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem(TokenSistems.TAB_STORAGE_KEY, tab);
  }, [tab]);

  // ── queries ───────────────────────────────────────────────────────────────

  // Processo — sempre necessário para renderizar o header
  const { data: processo, isLoading } = useQuery({
    queryKey: ["processo", id],
    queryFn: () => getProcessoId(id!),
    enabled: !!id,
    staleTime: 60_000,
  });

  // Vagas — só a aba ativa, com staleTime para evitar refetch desnecessário
  const {
    data: resultAllVagas,
    isLoading: isLoadingVagas,
    isFetching: isFetchingVagas,
  } = useQuery({
    queryKey: ["vagas-processo", id, pageVagas, pageSizeVagas, qVagaNormalized],
    queryFn: () =>
      getAllVagasProcessoId(id!, {
        page: pageVagas,
        limit: pageSizeVagas,
        q: qVagaNormalized || undefined,
      }),
    enabled: !!id && tab === "vagas",
    staleTime: 30_000,
  });

  // Perguntas — só quando aba "perguntas" está ativa
  const { data: perguntas, isLoading: isLoadingPerguntas } = useQuery({
    queryKey: ["perguntas-processos", id, pagePerguntas, pageSizePerguntas],
    queryFn: () =>
      buscarPerguntasProcessos(id!, {
        page: pagePerguntas,
        limit: pageSizePerguntas,
      }),
    enabled: !!id && tab === "perguntas",
    staleTime: 30_000,
  });

  // ── mutation excluir vaga ─────────────────────────────────────────────────
  const { mutateAsync: excluirVagaAsync, isPending: isDeletingVaga } =
    useMutation({
      mutationFn: (id_vaga: string) => excluirVaga({ id_vaga }),
      onSuccess: async () => {
        toast.success("Vaga apagada com sucesso.");
        await queryClient.invalidateQueries({
          queryKey: [
            "vagas-processo",
            id,
            pageVagas,
            pageSizeVagas,
            qVagaNormalized,
          ],
        });
      },
      onError: () => {
        toast.error("Não foi possível apagar a vaga.");
      },
    });

  // ── handlers ──────────────────────────────────────────────────────────────

  const onEditarVaga = useCallback(
    (v: any) => {
      if (!isAdmin) {
        toast.error("Apenas administradores podem editar vaga.");
        return;
      }
      setVagaToEdit(v);
      setOpenModal(true);
    },
    [isAdmin],
  );

  const onCadastrarVaga = useCallback(() => {
    if (!isAdmin) {
      toast.error("Apenas administradores podem cadastrar vaga.");
      return;
    }
    setOpenModal(true);
  }, [isAdmin]);

  const onEditarProcesso = useCallback(() => {
    if (!isAdmin) {
      toast.error("Apenas administradores podem editar o processo.");
      return;
    }
    setOpenModalEditProceso(true);
  }, [isAdmin]);

  const onCadastrarPergunta = useCallback(() => {
    if (!isAdmin) {
      toast.error("Apenas administradores podem cadastrar perguntas.");
      return;
    }
    setPerguntaToEdit(null);
    setOpenModalNovaPergunta(true);
  }, [isAdmin]);

  const onApagarVaga = useCallback(
    async (v: any) => {
      if (!isAdmin) {
        toast.error("Apenas administradores podem apagar vaga.");
        return;
      }

      const ok = window.confirm(
        `Tem certeza que deseja apagar a vaga "${v?.nome}"?\n\nEssa ação não pode ser desfeita.`,
      );
      if (!ok) return;

      await excluirVagaAsync(v.id_vaga);
    },
    [isAdmin, excluirVagaAsync],
  );

  const sendEmail = useCallback(async () => {
    await api.post(
      `/processos-seletivos-inscricoes/all/${id}/notificar-rascunhos`,
    );
    toast.success("ENVIADO");
  }, [id]);

  // ── totais (fallback seguro enquanto a query ainda não rodou) ─────────────
  const totalPerguntas = perguntas?.total ?? 0;
  const vagasItems = resultAllVagas?.items ?? [];
  const vagasTotal = resultAllVagas?.meta?.total ?? 0;

  // ── loading inicial do processo ───────────────────────────────────────────
  if (isLoading) {
    return (
      <S.Container>
        <S.Header>
          <S.HeaderLeft>
            <S.Title>Carregando...</S.Title>
            <S.Subtitle>Buscando dados do processo seletivo</S.Subtitle>
          </S.HeaderLeft>
        </S.Header>
      </S.Container>
    );
  }

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <S.Container>
      <S.Breadcrumbs>
        <S.BreadcrumbLink href="#">Processos</S.BreadcrumbLink>
        <S.BreadcrumbSep>/</S.BreadcrumbSep>
        <S.BreadcrumbCurrent>Detalhes</S.BreadcrumbCurrent>
      </S.Breadcrumbs>

      <S.Header>
        <S.HeaderLeft>
          <S.Title>{processo?.titulo}</S.Title>
          <S.Subtitle>
            {processo?.secretaria ?? "—"} • Ano {processo?.ano}
          </S.Subtitle>

          <S.BadgesRow>
            <S.StatusPill $status={processo?.status!}>
              {processo?.status}
            </S.StatusPill>

            <S.InfoChip>
              Inscrições: {formatDate(processo?.data_inicio_inscricoes)} →{" "}
              {formatDate(processo?.data_fim_inscricoes)}
            </S.InfoChip>
          </S.BadgesRow>
        </S.HeaderLeft>

        <S.HeaderRight>
          {isAdmin && (
            <>
              <S.SecondaryButton type="button" onClick={onEditarProcesso}>
                Editar processo
              </S.SecondaryButton>

              <S.PrimaryButton type="button" onClick={onCadastrarVaga}>
                Cadastrar vaga
              </S.PrimaryButton>

              <S.PrimaryButton type="button" onClick={onCadastrarPergunta}>
                Cadastrar perguntas
              </S.PrimaryButton>

              {user?.email === "gabriel.alves@ibirite.mg.gov.br" && (
                <S.PrimaryButton type="button" onClick={sendEmail}>
                  Enviar e-mail
                </S.PrimaryButton>
              )}
            </>
          )}
        </S.HeaderRight>
      </S.Header>

      {/* ── tabs ── */}
      <S.Tabs>
        <S.TabButton
          type="button"
          onClick={() => setTab("vagas")}
          aria-current={tab === "vagas"}
          $active={tab === "vagas"}
        >
          Vagas ({vagasTotal})
        </S.TabButton>

        <S.TabButton
          type="button"
          onClick={() => setTab("perguntas")}
          aria-current={tab === "perguntas"}
          $active={tab === "perguntas"}
        >
          Perguntas ({totalPerguntas})
        </S.TabButton>
      </S.Tabs>

      {/* ── aba vagas ── */}
      {tab === "vagas" && (
        <S.Section>
          <S.SectionHeader>
            <S.SectionTitle>Vagas</S.SectionTitle>
            <S.SectionHint>Gerencie as vagas deste processo.</S.SectionHint>
          </S.SectionHeader>

          <S.VagasToolbar>
            <S.SearchWrap>
              <S.SearchLabel htmlFor="qvaga">Buscar vaga</S.SearchLabel>
              <S.SearchInput
                id="qvaga"
                value={qVaga}
                onChange={(e) => {
                  setQVaga(e.target.value);
                  setPageVagas(1);
                }}
                placeholder="Buscar por nome, nível..."
              />
            </S.SearchWrap>
          </S.VagasToolbar>

          {isLoadingVagas ? (
            <S.EmptyState>
              <S.EmptyTitle>Carregando vagas...</S.EmptyTitle>
              <S.EmptyText>Buscando vagas do processo.</S.EmptyText>
            </S.EmptyState>
          ) : vagasItems.length === 0 ? (
            <S.EmptyState>
              <S.EmptyTitle>Nenhuma vaga encontrada</S.EmptyTitle>
              <S.EmptyText>
                Tente outro termo de busca
                {isAdmin ? " ou cadastre uma nova vaga." : "."}
              </S.EmptyText>
            </S.EmptyState>
          ) : (
            <>
              <S.VagasTableWrap>
                <S.VagasTable>
                  <thead>
                    <tr>
                      <S.Th>Vaga</S.Th>
                      <S.Th style={{ width: 180 }}>Nível</S.Th>
                      <S.Th style={{ width: 180 }}>Quantidade</S.Th>
                      <S.Th style={{ width: 220, textAlign: "right" }}>
                        Ações
                      </S.Th>
                    </tr>
                  </thead>

                  <tbody>
                    {vagasItems.map((v) => (
                      <S.Tr key={v.id_vaga}>
                        <S.Td>
                          <S.VagaName title={v.nome}>{v.nome}</S.VagaName>
                          <S.VagaSubText>
                            Processo: {v.id_processo_seletivo}
                          </S.VagaSubText>
                        </S.Td>

                        <S.Td>
                          <S.CountPill title="Nível mínimo">
                            {v.nivel}
                          </S.CountPill>
                        </S.Td>

                        <S.Td>
                          <S.CountPill title="Quantidade de vagas">
                            {Number(v.quantidade_de_vagas)} vagas
                          </S.CountPill>
                        </S.Td>

                        <S.Td style={{ textAlign: "right" }}>
                          <S.RowActions>
                            {isAdmin ? (
                              <>
                                <S.SecondaryButton
                                  type="button"
                                  onClick={() => onEditarVaga(v)}
                                  disabled={isDeletingVaga}
                                >
                                  Editar
                                </S.SecondaryButton>

                                <S.DangerButton
                                  type="button"
                                  onClick={() => onApagarVaga(v)}
                                  disabled={isDeletingVaga}
                                >
                                  Apagar
                                </S.DangerButton>
                              </>
                            ) : (
                              <S.Muted>—</S.Muted>
                            )}
                          </S.RowActions>
                        </S.Td>
                      </S.Tr>
                    ))}
                  </tbody>
                </S.VagasTable>
              </S.VagasTableWrap>

              <Pagination
                page={pageVagas}
                total={vagasTotal}
                pageSize={pageSizeVagas}
                onPageChange={setPageVagas}
                showPageSize
                onPageSizeChange={(s) => {
                  setPageVagas(1);
                  setPageSizeVagas(s);
                }}
                loading={isFetchingVagas}
              />
            </>
          )}
        </S.Section>
      )}

      {/* ── aba perguntas ── */}
      {tab === "perguntas" && (
        <TablePerguntas
          processo_seletivo_id={id!}
          isAdmin={isAdmin}
          setOpenModalNovaPergunta={setOpenModalNovaPergunta}
          setPerguntaToEdit={setPerguntaToEdit}
          perguntas={perguntas}
          isLoadingPerguntas={isLoadingPerguntas}
          page={pagePerguntas}
          pageSize={pageSizePerguntas}
          onPageChange={setPagePerguntas}
          onPageSizeChange={(s) => {
            setPagePerguntas(1);
            setPageSizePerguntas(s);
          }}
        />
      )}

      {isAdmin && (
        <>
          <ModalNovaVaga
            open={openModal}
            onOpenChange={(v) => {
              setOpenModal(v);
              if (!v) setVagaToEdit(null);
            }}
            id_processo_seletivo={id!}
            vagaToEdit={vagaToEdit}
          />

          <ModalNovoProcesso
            processoToEdit={processo}
            onOpenChange={setOpenModalEditProceso}
            open={openModalEditProcesso}
          />
        </>
      )}

      <ModalNovaPergunta
        open={openModalNovaPergunta}
        onOpenChange={(v) => {
          setOpenModalNovaPergunta(v);
          if (!v) setPerguntaToEdit(null);
        }}
        id_processo_seletivo={id!}
        perguntaToEdit={perguntaToEdit}
      />
    </S.Container>
  );
}