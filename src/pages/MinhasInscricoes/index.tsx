// src/pages/MinhasInscricoes/index.tsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import * as S from "./styles";

import { getInscricoesMe, type InscricaoStatus } from "../../api/get-inscricoes-me";

type ProcessoVM = {
  id_processo_seletivo: string;
  titulo?: string;
  ano?: number;
  status?: string;
};

type InscricaoVM = {
  id_inscricao: string;
  numero_inscricao: string;
  cargo_funcao: string;
  status: InscricaoStatus;
  pontuacao_total: number;
  data_criacao: string;
  data_atualizacao: string;
  processo?: ProcessoVM;
  id_processo_seletivo?: string;
};

type Meta = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

type ListResponse = {
  meta: Meta;
  items: InscricaoVM[];
};

function fmtDateTimeBR(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("pt-BR");
}

function normalizeStatusLabel(s?: string) {
  if (!s) return "—";
  return s.replaceAll("_", " ");
}

export function MinhasInscricoes() {
  const navigate = useNavigate();

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<InscricaoStatus | "TODAS">("TODAS");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, refetch } = useQuery<ListResponse>({
    queryKey: ["minhas-inscricoes", page, q, status],
    queryFn: async () => {
      const res = await getInscricoesMe({
        page,
        limit: 10,
        q,
        status: status === "TODAS" ? undefined : status,
      });

      return res as ListResponse;
    },
  });

  const meta = data?.meta;
  const items = data?.items ?? [];
  const hasData = items.length > 0;

  const counters = useMemo(() => {
    return { total: meta?.total ?? 0 };
  }, [meta?.total]);

  function handleOpen(item: InscricaoVM) {
    const pid = item.id_processo_seletivo ?? item.processo?.id_processo_seletivo;
    if (!pid) return;
    navigate(`/processos/${pid}/inscricao`);
  }

  return (
    <S.Page>
      <S.Header>
        <S.TitleWrap>
          <S.Title>Minhas inscrições</S.Title>
          <S.Subtitle>
            Acompanhe o status das suas inscrições e reabra um rascunho quando precisar.
          </S.Subtitle>
        </S.TitleWrap>

        <S.HeaderRight>
          <S.CounterPill>
            <b>{counters.total}</b> {counters.total === 1 ? "inscrição" : "inscrições"}
          </S.CounterPill>

          <S.RefreshButton type="button" onClick={() => refetch()} disabled={isLoading}>
            Atualizar
          </S.RefreshButton>
        </S.HeaderRight>
      </S.Header>

      <S.Toolbar>
        <S.SearchWrap>
          <S.SearchLabel htmlFor="q">Buscar</S.SearchLabel>
          <S.SearchInput
            id="q"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Buscar por nº, cargo ou título do processo..."
          />
        </S.SearchWrap>

        <S.SelectWrap>
          <S.SelectLabel htmlFor="status">Status</S.SelectLabel>
          <S.Select
            id="status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as any);
              setPage(1);
            }}
          >
            <option value="TODAS">Todas</option>
            <option value="RASCUNHO">Rascunho</option>
            <option value="ENVIADA">Enviada</option>
            <option value="EM_ANALISE">Em análise</option>
            <option value="DEFERIDA">Deferida</option>
            <option value="INDEFERIDA">Indeferida</option>
          </S.Select>
        </S.SelectWrap>

        <S.MetaRight>
          {meta ? (
            <>
              <S.MetaText>
                Página <b>{meta.page}</b> de <b>{meta.pages}</b>
              </S.MetaText>
              <S.MetaMuted>
                Mostrando {items.length} de {meta.total}
              </S.MetaMuted>
            </>
          ) : (
            <S.MetaMuted>—</S.MetaMuted>
          )}
        </S.MetaRight>
      </S.Toolbar>

      {isLoading ? (
        <S.State>
          <S.StateTitle>Carregando suas inscrições...</S.StateTitle>
          <S.StateText>Isso pode levar alguns segundos.</S.StateText>
        </S.State>
      ) : isError ? (
        <S.State $variant="error">
          <S.StateTitle>Não foi possível carregar</S.StateTitle>
          <S.StateText>
            {(error as any)?.response?.data?.message ??
              (error as Error)?.message ??
              "Tente novamente. Se persistir, verifique sua conexão."}
          </S.StateText>
        </S.State>
      ) : !hasData ? (
        <S.State>
          <S.StateTitle>Nenhuma inscrição encontrada</S.StateTitle>
          <S.StateText>
            Quando você se inscrever em um processo, ela aparecerá aqui.
          </S.StateText>
        </S.State>
      ) : (
        <>
          <S.Grid>
            {items.map((i) => {
              const pid = i.id_processo_seletivo ?? i.processo?.id_processo_seletivo;
              const processoTitulo = i.processo?.titulo ?? "Processo seletivo";
              const processoAno = i.processo?.ano ? ` • ${i.processo?.ano}` : "";

              return (
                <S.Card key={i.id_inscricao}>
                  <S.CardTop>
                    <S.CardTitle>
                      {processoTitulo}
                      {processoAno}
                    </S.CardTitle>

                    <S.StatusPill $status={i.status}>
                      {normalizeStatusLabel(i.status)}
                    </S.StatusPill>
                  </S.CardTop>

                  <S.MetaRow>
                    <S.MetaItem>
                      <S.MetaLabel>Nº inscrição</S.MetaLabel>
                      <S.MetaValue>{i.numero_inscricao}</S.MetaValue>
                    </S.MetaItem>

                    <S.MetaItem>
                      <S.MetaLabel>Cargo/Função</S.MetaLabel>
                      <S.MetaValue>{i.cargo_funcao || "—"}</S.MetaValue>
                    </S.MetaItem>

                    <S.MetaItem>
                      <S.MetaLabel>Pontuação</S.MetaLabel>
                      <S.MetaValue>{i.pontuacao_total ?? 0}</S.MetaValue>
                    </S.MetaItem>

                    <S.MetaItem>
                      <S.MetaLabel>Criada em</S.MetaLabel>
                      <S.MetaValue>{fmtDateTimeBR(i.data_criacao)}</S.MetaValue>
                    </S.MetaItem>
                  </S.MetaRow>

                  <S.CardFooter>
                    <S.SecondaryButton
                      type="button"
                      onClick={() => pid && navigate(`/processos_detalhes/${pid}`)}
                      disabled={!pid}
                      title={!pid ? "Processo não encontrado na inscrição" : "Ver detalhes do processo"}
                    >
                      Ver processo
                    </S.SecondaryButton>

                    <S.PrimaryButton
                      type="button"
                      onClick={() => handleOpen(i)}
                      disabled={!pid}
                      title={!pid ? "Processo não encontrado na inscrição" : "Abrir inscrição"}
                    >
                      {i.status === "RASCUNHO" ? "Continuar" : "Abrir"}
                    </S.PrimaryButton>
                  </S.CardFooter>
                </S.Card>
              );
            })}
          </S.Grid>

          {!!meta && meta.pages > 1 && (
            <S.Pagination>
              <S.PageButton
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={meta.page <= 1}
              >
                Anterior
              </S.PageButton>

              <S.PageInfo>
                Página <b>{meta.page}</b> de <b>{meta.pages}</b>
              </S.PageInfo>

              <S.PageButton
                type="button"
                onClick={() => setPage((p) => Math.min(meta.pages, p + 1))}
                disabled={meta.page >= meta.pages}
              >
                Próxima
              </S.PageButton>
            </S.Pagination>
          )}
        </>
      )}
    </S.Page>
  );
}
