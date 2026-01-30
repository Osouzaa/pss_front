import { useMemo, useState } from "react";
import { useParams } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import * as S from "./styles";

import { getProcessoId } from "../../api/get-processo-id";
import { ModalNovaVaga } from "./components/ModalNovaVaga";
import { ModalNovoProcesso } from "../Processo/components/ModalNovoProcesso";
import { ModalNovaPergunta } from "./components/ModalNovaPerguntas";
import { buscarPerguntasProcessos } from "../../api/buscar-perguntas-processos";
import { ModalOpcoes } from "./components/ModalOpcoes";

import { toast } from "sonner";
import { deletarPergunta } from "../../api/deletar-pergunta";
import { queryClient } from "../../lib/react-query";
import { Trash2, Pencil } from "lucide-react";
import { ModalConfirmDelete } from "../../components/ModalConfirmDelete";

import { useAuth } from "../../contexts/auth-context";

function fmtDateBR(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("pt-BR");
}

/** helper de busca simples */
function normalizeText(s: string) {
  return (s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function ProcessoSeletivosDetalhes() {
  const { id } = useParams<{ id: string }>();
  const { isAdmin } = useAuth();

  const [tab, setTab] = useState("vagas");
  const [qVaga, setQVaga] = useState("");

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [vagaToEdit, setVagaToEdit] = useState<any>(null);

  const [openModalEditProcesso, setOpenModalEditProceso] =
    useState<boolean>(false);

  const [openModalOpcoes, setOpenModalOpcoes] = useState(false);
  const [perguntaSelecionada, setPerguntaSelecionada] = useState<{
    id_pergunta: string;
  } | null>(null);

  const [openModalNovaPergunta, setOpenModalNovaPergunta] = useState(false);
  const [perguntaToEdit, setPerguntaToEdit] = useState<any>(null);

  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [perguntaToDelete, setPerguntaToDelete] = useState<any>(null);

  const {
    data: processo,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["processo-id", id],
    queryFn: () => {
      if (!id) throw new Error("ID do processo não informado");
      return getProcessoId(id);
    },
    enabled: !!id,
  });

  const { data: perguntas, isLoading: isLoadingPerguntas } = useQuery({
    queryKey: ["perguntas-processos", processo?.id_processo_seletivo],
    queryFn: () => buscarPerguntasProcessos(processo?.id_processo_seletivo!),
    enabled: !!processo?.id_processo_seletivo,
  });

  const vagasFiltradas = useMemo(() => {
    const list = processo?.vagas ?? [];
    const nq = normalizeText(qVaga);
    if (!nq) return list;

    return list.filter((v) => {
      const hay = normalizeText(
        `${v.nome} ${v.nivel} ${v.quantidade_de_vagas ?? ""}`,
      );
      return hay.includes(nq);
    });
  }, [processo?.vagas, qVaga]);

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

  function onEditarPergunta(pergunta: any) {
    if (!isAdmin) {
      toast.error("Apenas administradores podem editar perguntas.");
      return;
    }
    setPerguntaToEdit(pergunta);
    setOpenModalNovaPergunta(true);
  }

  function onAbrirOpcoes(pergunta: { id_pergunta: string }) {
    if (!isAdmin) {
      toast.error("Apenas administradores podem gerenciar opções.");
      return;
    }
    setPerguntaSelecionada(pergunta);
    setOpenModalOpcoes(true);
  }

  const deletePerguntaMut = useMutation({
    mutationFn: deletarPergunta,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["perguntas-processos", processo?.id_processo_seletivo],
      });
      queryClient.invalidateQueries({
        queryKey: ["processo-id", processo?.id_processo_seletivo],
      });
    },
  });

  function onExcluirPergunta(pergunta: any) {
    if (!isAdmin) {
      toast.error("Apenas administradores podem excluir perguntas.");
      return;
    }
    setPerguntaToDelete(pergunta);
    setOpenModalDelete(true);
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

  if (isError || !processo) {
    return (
      <S.Container>
        <S.Header>
          <S.HeaderLeft>
            <S.Title>Não foi possível carregar</S.Title>
            <S.Subtitle>
              {(error as Error)?.message ?? "Tente novamente"}
            </S.Subtitle>
          </S.HeaderLeft>
        </S.Header>
      </S.Container>
    );
  }

  return (
    <S.Container>
      <S.Breadcrumbs>
        <S.BreadcrumbLink href="#">Processos</S.BreadcrumbLink>
        <S.BreadcrumbSep>/</S.BreadcrumbSep>
        <S.BreadcrumbCurrent>Detalhes</S.BreadcrumbCurrent>
      </S.Breadcrumbs>

      <S.Header>
        <S.HeaderLeft>
          <S.Title>{processo.titulo}</S.Title>
          <S.Subtitle>
            {processo.secretaria ?? "—"} • Ano {processo.ano}
          </S.Subtitle>

          <S.BadgesRow>
            <S.StatusPill $status={processo.status}>
              {processo.status}
            </S.StatusPill>

            <S.InfoChip>
              Inscrições: {fmtDateBR(processo.data_inicio_inscricoes)} →{" "}
              {fmtDateBR(processo.data_fim_inscricoes)}
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
          Vagas ({processo.vagas?.length ?? 0})
        </S.TabButton>

        <S.TabButton
          type="button"
          onClick={() => setTab("perguntas")}
          aria-current={tab === "perguntas"}
          $active={tab === "perguntas"}
        >
          Perguntas ({perguntas?.length ?? 0})
        </S.TabButton>
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
                onChange={(e) => setQVaga(e.target.value)}
                placeholder="Buscar por nome, nível..."
              />
            </S.SearchWrap>
          </S.VagasToolbar>

          {vagasFiltradas.length === 0 ? (
            <S.EmptyState>
              <S.EmptyTitle>Nenhuma vaga encontrada</S.EmptyTitle>
              <S.EmptyText>
                Tente outro termo de busca
                {isAdmin ? " ou cadastre uma nova vaga." : "."}
              </S.EmptyText>
            </S.EmptyState>
          ) : (
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
                  {vagasFiltradas.map((v) => (
                    <S.Tr key={v.id_vaga}>
                      <S.Td>
                        <S.VagaName title={v.nome}>{v.nome}</S.VagaName>
                        <S.VagaSubText>
                          Processo: {processo.id_processo_seletivo}
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
          )}
        </S.Section>
      )}

      {tab === "perguntas" && (
        <S.Section>
          <S.SectionHeader>
            <S.SectionTitle>Perguntas do Processo</S.SectionTitle>
            <S.SectionHint>
              Gerencie as perguntas utilizadas neste processo seletivo.
            </S.SectionHint>
          </S.SectionHeader>

          {isLoadingPerguntas ? (
            <S.EmptyState>
              <S.EmptyTitle>Carregando perguntas...</S.EmptyTitle>
              <S.EmptyText>Aguarde um momento.</S.EmptyText>
            </S.EmptyState>
          ) : !perguntas || perguntas.length === 0 ? (
            <S.EmptyState>
              <S.EmptyTitle>Nenhuma pergunta cadastrada</S.EmptyTitle>
              <S.EmptyText>
                {isAdmin
                  ? 'Cadastre perguntas para este processo seletivo clicando no botão "Cadastrar perguntas" acima.'
                  : "Nenhuma pergunta cadastrada para este processo seletivo."}
              </S.EmptyText>
            </S.EmptyState>
          ) : (
            <S.PerguntasTableWrap>
              <S.PerguntasTable>
                <thead>
                  <tr>
                    <S.Th style={{ width: 70 }}>Ordem</S.Th>
                    <S.Th>Pergunta</S.Th>
                    <S.Th style={{ width: 140 }}>Tipo</S.Th>
                    <S.Th style={{ width: 140 }}>Obrigatória</S.Th>
                    <S.Th style={{ width: 120 }}>Ativa</S.Th>
                    <S.Th style={{ width: 120 }}>Opções</S.Th>
                    <S.Th style={{ width: 160 }}>Criada</S.Th>
                    <S.Th style={{ width: 260, textAlign: "right" }}>
                      Ações
                    </S.Th>
                  </tr>
                </thead>

                <tbody>
                  {perguntas
                    .slice()
                    .sort((a, b) => a.orderm - b.orderm)
                    .map((pergunta, index) => {
                      const hasOpcoes =
                        Array.isArray(pergunta.opcoes) &&
                        pergunta.opcoes.length > 0;

                      const podeGerenciarOpcoes =
                        pergunta.tipo === "SELECT" ||
                        pergunta.tipo === "MULTISELECT";

                      return (
                        <S.Tr key={pergunta.id_pergunta}>
                          <S.Td>
                            <S.PerguntaOrderPill title="Ordem">
                              #{index + 1}
                            </S.PerguntaOrderPill>
                          </S.Td>

                          <S.Td>
                            <S.PerguntaTitleCell title={pergunta.titulo}>
                              {pergunta.titulo}
                            </S.PerguntaTitleCell>

                            {pergunta.descrição && (
                              <S.PerguntaDescCell title={pergunta.descrição}>
                                {pergunta.descrição}
                              </S.PerguntaDescCell>
                            )}
                          </S.Td>

                          <S.Td>
                            <S.PerguntaTipoPill $tipo={String(pergunta.tipo)} />
                          </S.Td>

                          <S.Td>
                            {pergunta.obrigatoria ? (
                              <S.YesPill>Sim</S.YesPill>
                            ) : (
                              <S.NoPill>Não</S.NoPill>
                            )}
                          </S.Td>

                          <S.Td>
                            {pergunta.ativa ? (
                              <S.YesPill>Sim</S.YesPill>
                            ) : (
                              <S.NoPill>Não</S.NoPill>
                            )}
                          </S.Td>

                          <S.Td>
                            {podeGerenciarOpcoes ? (
                              <S.OpcoesCountPill data-has={hasOpcoes}>
                                {pergunta.opcoes?.length ?? 0}
                              </S.OpcoesCountPill>
                            ) : (
                              <S.Muted>—</S.Muted>
                            )}
                          </S.Td>

                          <S.Td>
                            <S.Muted>
                              {fmtDateBR(pergunta.data_criacao)}
                            </S.Muted>
                          </S.Td>

                          <S.Td style={{ textAlign: "right" }}>
                            <S.RowActions>
                              {isAdmin ? (
                                <>
                                  <S.IconButton
                                    type="button"
                                    title="Editar"
                                    onClick={() => onEditarPergunta(pergunta)}
                                  >
                                    <Pencil size={16} />
                                  </S.IconButton>

                                  {podeGerenciarOpcoes && (
                                    <S.SecondaryButton
                                      type="button"
                                      onClick={() => onAbrirOpcoes(pergunta)}
                                    >
                                      Opções
                                    </S.SecondaryButton>
                                  )}

                                  <S.IconButton
                                    type="button"
                                    title="Excluir"
                                    className="danger"
                                    onClick={() => onExcluirPergunta(pergunta)}
                                    disabled={deletePerguntaMut.isPending}
                                  >
                                    <Trash2 size={16} />
                                  </S.IconButton>
                                </>
                              ) : (
                                <S.Muted>—</S.Muted>
                              )}
                            </S.RowActions>
                          </S.Td>
                        </S.Tr>
                      );
                    })}
                </tbody>
              </S.PerguntasTable>
            </S.PerguntasTableWrap>
          )}
        </S.Section>
      )}

      {/* ✅ Modais/admin: renderiza só se isAdmin */}
      {isAdmin && (
        <>
          <ModalNovaVaga
            open={openModal}
            onOpenChange={(v) => {
              setOpenModal(v);
              if (!v) setVagaToEdit(null);
            }}
            id_processo_seletivo={processo.id_processo_seletivo}
            vagaToEdit={vagaToEdit}
          />

          <ModalNovoProcesso
            processoToEdit={processo}
            onOpenChange={setOpenModalEditProceso}
            open={openModalEditProcesso}
          />

          <ModalNovaPergunta
            open={openModalNovaPergunta}
            onOpenChange={(v) => {
              setOpenModalNovaPergunta(v);
              if (!v) setPerguntaToEdit(null);
            }}
            id_processo_seletivo={processo.id_processo_seletivo}
            perguntaToEdit={perguntaToEdit}
          />

          <ModalOpcoes
            open={openModalOpcoes}
            onOpenChange={(v) => {
              setOpenModalOpcoes(v);
              if (!v) setPerguntaSelecionada(null);
            }}
            id_pergunta={perguntaSelecionada?.id_pergunta ?? ""}
            id_processo_seletivo={processo.id_processo_seletivo}
          />

          <ModalConfirmDelete
            open={openModalDelete}
            onOpenChange={(v) => {
              setOpenModalDelete(v);
              if (!v) setPerguntaToDelete(null);
            }}
            itemName={perguntaToDelete?.titulo ?? "Pergunta"}
            invalidateQueryKeys={[
              ["perguntas-processos", processo.id_processo_seletivo],
              ["processo-id", processo.id_processo_seletivo],
            ]}
            onConfirm={async () => {
              if (!perguntaToDelete?.id_pergunta) return;

              try {
                await deletePerguntaMut.mutateAsync(
                  perguntaToDelete.id_pergunta,
                );
                toast.success("Pergunta excluída com sucesso!");
              } catch (err: any) {
                const status = err?.response?.status;
                const msg =
                  err?.response?.data?.message ||
                  err?.response?.data?.error ||
                  "Não foi possível excluir a pergunta.";

                if (status === 409) {
                  toast.warning(
                    "Não é possível excluir esta pergunta porque existem respostas vinculadas a essa pergunta.",
                    {
                      duration: 4000,
                    },
                  );
                  return;
                }

                toast.error(msg);
              }
            }}
          />
        </>
      )}
    </S.Container>
  );
}
