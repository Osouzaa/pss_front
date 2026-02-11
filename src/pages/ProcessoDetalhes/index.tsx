import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import * as S from "./styles";

import { getProcessoId } from "../../api/get-processo-id";
import { ModalNovaVaga } from "./components/ModalNovaVaga";
import { ModalNovoProcesso } from "../Processo/components/ModalNovoProcesso";

import { toast } from "sonner";

import { useAuth } from "../../contexts/auth-context";
import { formatDate } from "../../utils/fomartDate.utils";
import { getAllInscricoesByProcessoId } from "../../api/get-all-inscricoes-by-processoId";
import { TablePerguntas } from "./components/TablePerguntas";
import { TableInscricoes } from "./components/TableInscricoes";
import { ModalNovaPergunta } from "./components/ModalNovaPerguntas";
import { buscarPerguntasProcessos } from "../../api/buscar-perguntas-processos";
import { getAllVagasProcessoId } from "../../api/get-all-vagas-processoId";

import { Pagination } from "../../components/Pagination"; // ✅ ajuste o path conforme seu projeto
import { TokenSistems } from "../../constants/env.constantes";

function normalizeText(s: string) {
  return (s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

const VALID_TABS = ["vagas", "perguntas", "inscricoes"] as const;
type TabKey = (typeof VALID_TABS)[number];

function getInitialTab(isAdmin: boolean): TabKey {
  const raw = localStorage.getItem(TokenSistems.TAB_STORAGE_KEY);

  if (!raw) return "vagas";

  if (!VALID_TABS.includes(raw as TabKey)) {
    return "vagas";
  }

  if (!isAdmin && raw === "inscricoes") {
    return "vagas";
  }

  return raw as TabKey;
}

export function ProcessoSeletivosDetalhes() {
  const { id } = useParams<{ id: string }>();
  const { isAdmin } = useAuth();

  const [tab, setTab] = useState<string>(() => getInitialTab(isAdmin));
  const [qVaga, setQVaga] = useState("");

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [vagaToEdit, setVagaToEdit] = useState<any>(null);
  const [openModalEditProcesso, setOpenModalEditProceso] =
    useState<boolean>(false);

  const [openModalNovaPergunta, setOpenModalNovaPergunta] = useState(false);
  const [perguntaToEdit, setPerguntaToEdit] = useState<any>(null);

  // ===== PAGINAÇÃO VAGAS =====
  const [pageVagas, setPageVagas] = useState(1);
  const [pageSizeVagas, setPageSizeVagas] = useState(10);

  // ===== PAGINAÇÃO INSCRIÇÕES =====
  const [pageInscricoes, setPageInscricoes] = useState(1);
  const [pageSizeInscricoes, setPageSizeInscricoes] = useState(20);

  // ===== PAGINAÇÃO PERGUNTAS =====
  const [pagePerguntas, setPagePerguntas] = useState(1);
  const [pageSizePerguntas, setPageSizePerguntas] = useState(20);

  const qVagaNormalized = useMemo(() => normalizeText(qVaga), [qVaga]);

  useEffect(() => {
    if (!isAdmin && tab === "inscricoes") {
      setTab("vagas");
      localStorage.setItem(TokenSistems.TAB_STORAGE_KEY, "vagas");
      return;
    }

    localStorage.setItem(TokenSistems.TAB_STORAGE_KEY, tab);
  }, [tab, isAdmin]);

  const { data: processo, isLoading } = useQuery({
    queryKey: ["processo", id],
    queryFn: () => getProcessoId(id!),
    enabled: !!id,
  });

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
    enabled: !!id,
    staleTime: 30_000,
  });

  const { data: perguntas, isLoading: isLoadingPerguntas } = useQuery({
    queryKey: ["perguntas-processos", id, pagePerguntas, pageSizePerguntas],
    queryFn: () =>
      buscarPerguntasProcessos(id!, {
        page: pagePerguntas,
        limit: pageSizePerguntas,
      }),
    enabled: !!id,
  });

  const { data: resultAllInscricoes, isLoading: isLoadingInscricoes } =
    useQuery({
      queryKey: ["all-inscricoes", id, pageInscricoes, pageSizeInscricoes],
      queryFn: () =>
        getAllInscricoesByProcessoId(id!, {
          page: pageInscricoes,
          limit: pageSizeInscricoes,
        }),
      enabled: !!id,
      staleTime: 30_000,
    });

  function onEditarVaga(v: any) {
    if (!isAdmin) {
      toast.error("Apenas administradores podem editar vaga.");
      return;
    }
    setVagaToEdit(v);
    setOpenModal(true);
  }

  function onCadastrarVaga() {
    if (!isAdmin) {
      toast.error("Apenas administradores podem cadastrar vaga.");
      return;
    }
    setOpenModal(true);
  }

  function onEditarProcesso() {
    if (!isAdmin) {
      toast.error("Apenas administradores podem editar o processo.");
      return;
    }
    setOpenModalEditProceso(true);
  }

  function onCadastrarPergunta() {
    if (!isAdmin) {
      toast.error("Apenas administradores podem cadastrar perguntas.");
      return;
    }
    setPerguntaToEdit(null);
    setOpenModalNovaPergunta(true);
  }

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

  const totalInscricoes = resultAllInscricoes?.total ?? 0;
  const totalPerguntas = perguntas?.total ?? 0;

  const vagasItems = resultAllVagas?.items ?? [];
  const vagasTotal = resultAllVagas?.meta?.total ?? 0;

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
            </>
          )}
        </S.HeaderRight>
      </S.Header>

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

        {isAdmin && (
          <S.TabButton
            type="button"
            onClick={() => setTab("inscricoes")}
            aria-current={tab === "inscricoes"}
            $active={tab === "inscricoes"}
          >
            Inscrições ({totalInscricoes})
          </S.TabButton>
        )}
      </S.Tabs>

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
                  setPageVagas(1); // ✅ quando busca muda, volta pra 1
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
                              <S.SecondaryButton
                                type="button"
                                onClick={() => onEditarVaga(v)}
                              >
                                Editar
                              </S.SecondaryButton>
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

              {/* ✅ PAGINAÇÃO */}
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

      {tab === "inscricoes" && isAdmin && (
        <TableInscricoes
          isLoadingInscricoes={isLoadingInscricoes}
          resultAllInscricoes={resultAllInscricoes}
          page={pageInscricoes}
          pageSize={pageSizeInscricoes}
          onPageChange={setPageInscricoes}
          onPageSizeChange={(s) => {
            setPageInscricoes(1);
            setPageSizeInscricoes(s);
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
