import { useMemo } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import * as S from "./styles";

import type { InscricaoStatus } from "../../api/inscricoes";
import { getInscricoesMe } from "../../api/get-inscricoes-me";
import { ModalLembrete } from "../../components/ModalLembrete";

function fmtDateTimeBR(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("pt-BR");
}

function normalizeStatusLabel(s?: string) {
  if (!s) return "—";
  return s.replaceAll("_", " ");
}

type VagaResponse = {
  id_vaga: string;
  nome: string;
};

type ProcessoResponse = {
  id_processo_seletivo: string;
  titulo: string;
  ano?: number;
  status?: string;
  secretaria?: string;
};

export type MinhaInscricaoListItem = {
  id_inscricao: string;
  id_processo_seletivo: string;
  id_vaga?: string | null;

  status: InscricaoStatus;
  pontuacao_total: number;

  protocolo?: string | null;

  data_criacao: string;
  data_envio?: string | null;

  vaga?: VagaResponse | null;
  processo?: ProcessoResponse | null;
};

type ProcessoComMinhasInscricoes = {
  id_processo_seletivo: string;
  titulo?: string;
  ano?: number;
  status?: string;
  secretaria?: string;
  data_criacao?: string;

  data_inicio_inscricoes?: string | null;
  data_fim_inscricoes?: string | null;

  minhas_inscricoes: MinhaInscricaoListItem[];
};

type InscricoesMeResponse = ProcessoComMinhasInscricoes[];

export function MinhasInscricoes() {
  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch } =
    useQuery<InscricoesMeResponse>({
      queryKey: ["minhas-inscricoes", "me"],
      queryFn: async () => {
        const res = await getInscricoesMe();
        // se o TS reclamar por causa do tipo do getInscricoesMe, use unknown:
        return res as unknown as InscricoesMeResponse;
      },
    });

  // ✅ achata todas as inscrições e injeta o processo (pra sempre ter titulo/ano)
  const items = useMemo(() => {
    const processos = data ?? [];
    return processos.flatMap((p) =>
      (p.minhas_inscricoes ?? []).map((ins) => ({
        ...ins,
        processo: ins.processo ?? {
          id_processo_seletivo: p.id_processo_seletivo,
          titulo: p.titulo ?? "Processo seletivo",
          ano: p.ano,
          status: p.status,
          secretaria: p.secretaria,
        },
      })),
    );
  }, [data]);

  const total = items.length;

  const counters = useMemo(() => {
    return { total };
  }, [total]);

  function handleOpen(item: MinhaInscricaoListItem) {
    const pid =
      item.id_processo_seletivo ?? item.processo?.id_processo_seletivo;

    const iid = item.id_inscricao;

    if (!pid || !iid) return;

    navigate(`/processos/${pid}/inscricao/${iid}`);
  }

  return (
    <S.Page>
      <S.Header>
        <S.TitleWrap>
          <S.Title>Minhas inscrições</S.Title>
          <S.Subtitle>
            Acompanhe o status das suas inscrições e reabra um rascunho quando
            precisar.
          </S.Subtitle>
        </S.TitleWrap>

        <S.HeaderRight>
          <S.CounterPill>
            <b>{counters.total}</b>{" "}
            {counters.total === 1 ? "inscrição" : "inscrições"}
          </S.CounterPill>

          <S.RefreshButton
            type="button"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            Atualizar
          </S.RefreshButton>
        </S.HeaderRight>
      </S.Header>

      {/* ✅ só design dos filtros (sem lógica) */}
      <S.Toolbar>
        <S.SearchWrap>
          <S.SearchLabel htmlFor="q">Buscar</S.SearchLabel>
          <S.SearchInput
            id="q"
            defaultValue=""
            placeholder="Buscar por título do processo, vaga ou protocolo..."
          />
        </S.SearchWrap>

        <S.SelectWrap>
          <S.SelectLabel htmlFor="status">Status</S.SelectLabel>
          <S.Select id="status" defaultValue="TODAS">
            <option value="TODAS">Todas</option>
            <option value="RASCUNHO">Rascunho</option>
            <option value="ENVIADA">Enviada</option>
            <option value="CANCELADA">Cancelada</option>
          </S.Select>
        </S.SelectWrap>

        <S.MetaRight>
          <S.MetaText>
            Total: <b>{total}</b>
          </S.MetaText>
          <S.MetaMuted>
            Mostrando {items.length} de {total}
          </S.MetaMuted>
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
      ) : items.length === 0 ? (
        <S.State>
          <S.StateTitle>Nenhuma inscrição encontrada</S.StateTitle>
          <S.StateText>
            Quando você se inscrever em um processo, ela aparecerá aqui.
          </S.StateText>
        </S.State>
      ) : (
        <S.Grid>
          {items.map((i) => {
            const pid =
              i.id_processo_seletivo ?? i.processo?.id_processo_seletivo;

            const processoTitulo = i.processo?.titulo ?? "Processo seletivo";
            const processoAno = i.processo?.ano ? ` • ${i.processo.ano}` : "";

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
                    <S.MetaLabel>Vaga</S.MetaLabel>
                    <S.MetaValue>{i.vaga?.nome ?? "—"}</S.MetaValue>
                  </S.MetaItem>

                  <S.MetaItem>
                    <S.MetaLabel>Pontuação</S.MetaLabel>
                    <S.MetaValue>{i.pontuacao_total ?? 0}</S.MetaValue>
                  </S.MetaItem>

                  <S.MetaItem>
                    <S.MetaLabel>Criada em</S.MetaLabel>
                    <S.MetaValue>{fmtDateTimeBR(i.data_criacao)}</S.MetaValue>
                  </S.MetaItem>

                  <S.MetaItem>
                    <S.MetaLabel>Enviada em</S.MetaLabel>
                    <S.MetaValue>{fmtDateTimeBR(i.data_envio)}</S.MetaValue>
                  </S.MetaItem>
                </S.MetaRow>

                <S.CardFooter>
                  <S.SecondaryButton
                    type="button"
                    onClick={() =>
                      pid && navigate(`/processos_detalhes/${pid}`)
                    }
                    disabled={!pid}
                    title={
                      !pid
                        ? "Processo não encontrado na inscrição"
                        : "Ver detalhes do processo"
                    }
                  >
                    Ver processo
                  </S.SecondaryButton>

                  <S.PrimaryButton
                    type="button"
                    onClick={() => handleOpen(i)}
                    disabled={!pid}
                    title={
                      !pid
                        ? "Processo não encontrado na inscrição"
                        : "Abrir inscrição"
                    }
                  >
                    {i.status === "RASCUNHO" ? "Continuar" : "Ver inscrição"}
                  </S.PrimaryButton>
                </S.CardFooter>
              </S.Card>
            );
          })}
        </S.Grid>
      )}
    </S.Page>
  );
}
