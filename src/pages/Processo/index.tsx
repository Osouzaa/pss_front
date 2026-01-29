import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import * as S from "./styles";
import { ModalNovoProcesso } from "./components/ModalNovoProcesso";
import { useQuery } from "@tanstack/react-query";
import { getAllProcessos } from "../../api/get-all-processos";
import { formatDate } from "../../utils/fomartDate.utils";
import { getMe } from "../../api/get-me";
import { ModalPrimeiroAcesso } from "./components/ModalPrimeiroAcesso";

export function Processo() {
  const navigate = useNavigate();

  const [q, setQ] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [page, setPage] = useState(1);

  const {
    data: result,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["all-processos", page, q],
    queryFn: () => getAllProcessos({ page, limit: 10, q }),
  });

  const meta = result?.meta;

  function handleCreate() {
    setOpenModal(true);
  }

  function handleDetails(id: string) {
    navigate(`/processos_detalhes/${id}`);
  }

  async function handleSubscribe(id: string) {
    navigate(`/processos/${id}/inscricao/`);
  }

  const items = result?.items ?? [];
  const hasData = items.length > 0;

  const { data: resultMe } = useQuery({
    queryKey: ["get-me"],
    queryFn: getMe,
  });

  const [openFirstAccess, setOpenFirstAccess] = useState(false);

  useEffect(() => {
    if (!resultMe) return;

    if (resultMe.fl_primeiro_acesso === true) {
      setOpenFirstAccess(true);
    }
  }, [result]);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <S.ContainerProcesso>
      <S.PageHeader>
        <S.TitleArea>
          <S.Title>Processos</S.Title>
          <S.Subtitle>
            Consulte os processos disponíveis e faça sua inscrição.
          </S.Subtitle>
        </S.TitleArea>

        <S.HeaderActions>
          <S.CreateButton type="button" onClick={handleCreate}>
            Criar processo
          </S.CreateButton>
        </S.HeaderActions>
      </S.PageHeader>

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
            placeholder="Buscar por título, secretaria, status..."
          />
        </S.SearchWrap>

        <S.Counter>
          {meta ? (
            <>
              {meta.total} {meta.total === 1 ? "processo" : "processos"}
              <S.CounterMuted>
                Página {meta.page} de {meta.pages}
              </S.CounterMuted>
            </>
          ) : null}
        </S.Counter>
      </S.Toolbar>

      {isLoading ? (
        <S.LoadingState>
          <S.LoadingTitle>Carregando processos...</S.LoadingTitle>
          <S.LoadingText>Isso pode levar alguns segundos.</S.LoadingText>
        </S.LoadingState>
      ) : isError ? (
        <S.EmptyState>
          <S.EmptyTitle>Não foi possível carregar</S.EmptyTitle>
          <S.EmptyText>
            Tente novamente. Se persistir, verifique sua conexão.
          </S.EmptyText>
        </S.EmptyState>
      ) : !hasData ? (
        <S.EmptyState>
          <S.EmptyTitle>Nenhum processo encontrado</S.EmptyTitle>
          <S.EmptyText>
            Tente outro termo de busca ou crie um novo processo.
          </S.EmptyText>
        </S.EmptyState>
      ) : (
        <>
          <S.Grid>
            {items.map((p) => (
              <S.Card key={p.id_processo_seletivo}>
                <S.CardTop>
                  <S.CardTitle>{p.titulo}</S.CardTitle>
                  <S.StatusPill $status={p.status}>{p.status}</S.StatusPill>
                </S.CardTop>

                <S.MetaRow>
                  <S.MetaItem>
                    <S.MetaLabel>Secretaria</S.MetaLabel>
                    <S.MetaValue>{p.secretaria ?? "—"}</S.MetaValue>
                  </S.MetaItem>

                  <S.MetaItem>
                    <S.MetaLabel>Período</S.MetaLabel>
                    <S.MetaValue>
                      {formatDate(p.data_inicio_inscricoes)} •{" "}
                      {formatDate(p.data_fim_inscricoes)}
                    </S.MetaValue>
                  </S.MetaItem>

                  <S.MetaItem>
                    <S.MetaLabel>Status</S.MetaLabel>
                    <S.MetaValue>{p.status}</S.MetaValue>
                  </S.MetaItem>
                </S.MetaRow>

                <S.CardFooter>
                  <S.SecondaryButton
                    type="button"
                    onClick={() => handleDetails(p.id_processo_seletivo)}
                  >
                    Ver detalhes
                  </S.SecondaryButton>

                  <S.PrimaryButton
                    type="button"
                    disabled={p.status !== "ABERTO"}
                    onClick={() => handleSubscribe(p.id_processo_seletivo)}
                  >
                    Inscrever
                  </S.PrimaryButton>
                </S.CardFooter>
              </S.Card>
            ))}
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

      <ModalNovoProcesso open={openModal} onOpenChange={setOpenModal} />
      <ModalPrimeiroAcesso
        open={openFirstAccess}
        onOpenChange={setOpenFirstAccess}
        lockClose={true}
        onGoProfile={() => navigate("/perfil")}
      />
    </S.ContainerProcesso>
  );
}
