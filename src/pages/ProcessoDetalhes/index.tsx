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
import { Trash2, Pencil, Eye } from "lucide-react";
import { ModalConfirmDelete } from "../../components/ModalConfirmDelete";

import { useAuth } from "../../contexts/auth-context";
import { formatDate } from "../../utils/fomartDate.utils";
import {
  getAllInscricoesByProcessoId,
  type Inscricao,
} from "../../api/get-all-inscricoes-by-processoId";

/** helper de busca simples */
function normalizeText(s: string) {
  return (s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function formatPhoneBR(phone?: string | null) {
  const digits = (phone ?? "").replace(/\D/g, "");
  if (!digits) return "—";

  // 11 dígitos: (31) 98299-1526
  if (digits.length === 11) {
    const ddd = digits.slice(0, 2);
    const p1 = digits.slice(2, 7);
    const p2 = digits.slice(7);
    return `(${ddd}) ${p1}-${p2}`;
  }

  // 10 dígitos: (31) 3299-1526
  if (digits.length === 10) {
    const ddd = digits.slice(0, 2);
    const p1 = digits.slice(2, 6);
    const p2 = digits.slice(6);
    return `(${ddd}) ${p1}-${p2}`;
  }

  return phone ?? "—";
}

function getNomeInscricao(i: Inscricao) {
  return (
    i.usuario?.candidato?.nome_completo ||
    i.usuario?.nome_completo ||
    i.usuario?.email ||
    "—"
  );
}

function getTelefoneInscricao(i: Inscricao) {
  return formatPhoneBR(i.usuario?.candidato?.telefone);
}

function getEnderecoCompleto(i: Inscricao) {
  const c = i.usuario?.candidato;
  if (!c) return "—";

  const parts: string[] = [];

  if (c.logradouro) parts.push(c.logradouro);
  if (c.numero) parts.push(c.numero);
  if (c.complemento) parts.push(c.complemento);
  if (c.bairro) parts.push(c.bairro);

  const cidadeUf = [c.cidade, c.uf].filter(Boolean).join(" - ");
  if (cidadeUf) parts.push(cidadeUf);

  const full = parts.join(", ").trim();
  return full || "—";
}

function getDataInscricao(i: Inscricao) {
  // regra: se enviou, mostra data_envio; senão data_criacao
  const iso = i.data_envio ?? i.data_criacao ?? i.data_atualizacao;
  return iso ? formatDate(iso) : "—";
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

  const [openModalVerMais, setOpenModalVerMais] = useState(false);
  const [inscricaoSelecionada, setInscricaoSelecionada] =
    useState<Inscricao | null>(null);

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

  const { data: resultAllInscricoes, isLoading: isLoadingInscricoes } =
    useQuery<Inscricao[]>({
      queryKey: ["all-inscricoes", id],
      queryFn: () => getAllInscricoesByProcessoId(id!),
      enabled: !!id,
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

  const inscricoesOrdenadas = useMemo(() => {
    const list = resultAllInscricoes ?? [];
    return list.slice().sort((a, b) => {
      const da = new Date(a.data_envio ?? a.data_criacao).getTime();
      const db = new Date(b.data_envio ?? b.data_criacao).getTime();
      return db - da;
    });
  }, [resultAllInscricoes]);

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

  function onVerMaisInscricao(i: Inscricao) {
    setInscricaoSelecionada(i);
    setOpenModalVerMais(true);

    // se preferir, pode navegar para uma rota:
    // navigate(`/processos/${id}/inscricoes/${i.id_inscricao}`)
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
              Inscrições: {formatDate(processo.data_inicio_inscricoes)} →{" "}
              {formatDate(processo.data_fim_inscricoes)}
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

        <S.TabButton
          type="button"
          onClick={() => setTab("inscricoes")}
          aria-current={tab === "inscricoes"}
          $active={tab === "inscricoes"}
        >
          Inscrições ({resultAllInscricoes?.length ?? 0})
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
                              {formatDate(pergunta.data_criacao)}
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

      {tab === "inscricoes" && (
        <S.Section>
          <S.SectionHeader>
            <S.SectionTitle>Inscrições</S.SectionTitle>
            <S.SectionHint>
              Veja todas as inscrições feitas neste processo seletivo.
            </S.SectionHint>
          </S.SectionHeader>

          {isLoadingInscricoes ? (
            <S.EmptyState>
              <S.EmptyTitle>Carregando inscrições...</S.EmptyTitle>
              <S.EmptyText>Aguarde um momento.</S.EmptyText>
            </S.EmptyState>
          ) : !inscricoesOrdenadas || inscricoesOrdenadas.length === 0 ? (
            <S.EmptyState>
              <S.EmptyTitle>Nenhuma inscrição encontrada</S.EmptyTitle>
              <S.EmptyText>
                Quando alguém se inscrever, aparecerá aqui.
              </S.EmptyText>
            </S.EmptyState>
          ) : (
            <S.InscricoesTableWrap>
              <S.InscricoesTable>
                <thead>
                  <tr>
                    <S.Th style={{ width: 170 }}>Data</S.Th>
                    <S.Th style={{ width: 260 }}>Nome</S.Th>
                    <S.Th style={{ width: 180 }}>Telefone</S.Th>
                    <S.Th style={{ width: 180 }}> Vaga</S.Th>
                    <S.Th>Endereço</S.Th>
                    <S.Th style={{ width: 160, textAlign: "right" }}>
                      Ações
                    </S.Th>
                  </tr>
                </thead>

                <tbody>
                  {inscricoesOrdenadas.map((i) => (
                    <S.Tr key={i.id_inscricao}>
                      <S.Td>
                        <S.Muted>{getDataInscricao(i)}</S.Muted>
                      </S.Td>

                      <S.Td>
                        <S.CellStrong title={getNomeInscricao(i)}>
                          {getNomeInscricao(i)}
                        </S.CellStrong>
                        <S.CellSub title={i.usuario?.email ?? ""}>
                          {i.usuario?.email ?? "—"}
                        </S.CellSub>
                      </S.Td>

                      <S.Td>
                        <S.CellMono title={getTelefoneInscricao(i)}>
                          {getTelefoneInscricao(i)}
                        </S.CellMono>
                      </S.Td>
                      <S.Td>
                        <S.CellMono title={i.vaga.nome}>
                          {i.vaga.nome}
                        </S.CellMono>
                      </S.Td>

                      <S.Td>
                        <S.CellClamp2 title={getEnderecoCompleto(i)}>
                          {getEnderecoCompleto(i)}
                        </S.CellClamp2>
                      </S.Td>

                      <S.Td style={{ textAlign: "right" }}>
                        <S.RowActions>
                          <S.SecondaryButton
                            type="button"
                            onClick={() => onVerMaisInscricao(i)}
                            title="Ver detalhes"
                          >
                            <S.BtnInline>
                              <Eye size={16} />
                              Ver mais
                            </S.BtnInline>
                          </S.SecondaryButton>
                        </S.RowActions>
                      </S.Td>
                    </S.Tr>
                  ))}
                </tbody>
              </S.InscricoesTable>
            </S.InscricoesTableWrap>
          )}
        </S.Section>
      )}

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

          {/* Modal "Ver mais" (placeholder simples) */}
          {openModalVerMais && (
            <S.SimpleOverlay
              role="dialog"
              aria-modal="true"
              onClick={() => setOpenModalVerMais(false)}
            >
              <S.SimpleModal onClick={(e) => e.stopPropagation()}>
                <S.SimpleModalHeader>
                  <S.SimpleModalTitle>Detalhes da inscrição</S.SimpleModalTitle>
                  <S.IconButton
                    type="button"
                    title="Fechar"
                    onClick={() => setOpenModalVerMais(false)}
                  >
                    ✕
                  </S.IconButton>
                </S.SimpleModalHeader>

                <S.SimpleModalBody>
                  <S.KV>
                    <S.KVRow>
                      <S.K>Protocolo</S.K>
                      <S.V>{inscricaoSelecionada?.protocolo ?? "—"}</S.V>
                    </S.KVRow>

                    <S.KVRow>
                      <S.K>Nome</S.K>
                      <S.V>
                        {inscricaoSelecionada
                          ? getNomeInscricao(inscricaoSelecionada)
                          : "—"}
                      </S.V>
                    </S.KVRow>

                    <S.KVRow>
                      <S.K>Telefone</S.K>
                      <S.V>
                        {inscricaoSelecionada
                          ? getTelefoneInscricao(inscricaoSelecionada)
                          : "—"}
                      </S.V>
                    </S.KVRow>

                    <S.KVRow>
                      <S.K>Endereço</S.K>
                      <S.V>
                        {inscricaoSelecionada
                          ? getEnderecoCompleto(inscricaoSelecionada)
                          : "—"}
                      </S.V>
                    </S.KVRow>

                    <S.KVRow>
                      <S.K>Status</S.K>
                      <S.V>{inscricaoSelecionada?.status ?? "—"}</S.V>
                    </S.KVRow>

                    <S.KVRow>
                      <S.K>Data</S.K>
                      <S.V>
                        {inscricaoSelecionada
                          ? getDataInscricao(inscricaoSelecionada)
                          : "—"}
                      </S.V>
                    </S.KVRow>
                  </S.KV>
                </S.SimpleModalBody>

                <S.SimpleModalFooter>
                  <S.SecondaryButton
                    type="button"
                    onClick={() => setOpenModalVerMais(false)}
                  >
                    Fechar
                  </S.SecondaryButton>
                </S.SimpleModalFooter>
              </S.SimpleModal>
            </S.SimpleOverlay>
          )}
        </>
      )}
    </S.Container>
  );
}
