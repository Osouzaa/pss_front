import { useMemo, useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import * as S from "./styles";

import { getProcessoId } from "../../api/get-processo-id";
import { ModalNovaVaga } from "./components/ModalNovaVaga";
import { ModalNovoProcesso } from "../Processo/components/ModalNovoProcesso";

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

  const [tab, setTab] = useState<"vagas">("vagas");
  const [qVaga, setQVaga] = useState("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [vagaToEdit, setVagaToEdit] = useState<any>(null);
  const [openModalEditProcesso, setOpenModalEditProceso] = useState<boolean>(false)
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
    setVagaToEdit(v);
    setOpenModal(true);
  }

  function onCadastrarVaga() {
    setOpenModal(true);
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
          <S.SecondaryButton type="button" onClick={() => setOpenModalEditProceso(true)}>
            Editar processo
          </S.SecondaryButton>

          <S.PrimaryButton type="button" onClick={onCadastrarVaga}>
            Cadastrar vaga
          </S.PrimaryButton>
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
                Tente outro termo de busca ou cadastre uma nova vaga.
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
                          <S.SecondaryButton
                            type="button"
                            onClick={() => onEditarVaga(v)}
                          >
                            Editar
                          </S.SecondaryButton>
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
    </S.Container>
  );
}
