import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import * as S from "./styles";

import { useQuery } from "@tanstack/react-query";

import { getAllProcessos } from "../../api/get-all-processos";
import { formatDate } from "../../utils/fomartDate.utils";

import { ModalNovoProcesso } from "./components/ModalNovoProcesso";
import { ModalPrimeiroAcesso } from "./components/ModalPrimeiroAcesso";

import { useAuth } from "../../contexts/auth-context";

export function Processo() {
  const navigate = useNavigate();

  const { user, isAdmin, isPrimeiroAcesso, isLoading: loadingMe } = useAuth();

  // ✅ regra: candidato sem id_candidato => perfil incompleto
  const isPerfilIncompleto = useMemo(() => {
    return user?.tipo === "CANDIDATO" && !user?.id_candidato;
  }, [user?.tipo, user?.id_candidato]);

  // ✅ qDraft = input (não dispara busca)
  const [qDraft, setQDraft] = useState("");
  // ✅ q = filtro aplicado (dispara busca)
  const [q, setQ] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [page, setPage] = useState(1);
  const [openFirstAccess, setOpenFirstAccess] = useState(false);

  const {
    data: result,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["all-processos", page, q],
    queryFn: () => getAllProcessos({ page, limit: 10, q }),
    enabled: !loadingMe,
  });

  const meta = result?.meta;
  const items = result?.items ?? [];
  const hasData = items.length > 0;

  useEffect(() => {
    if (loadingMe) return;

    const shouldOpen = user?.tipo === "CANDIDATO" && !!isPrimeiroAcesso;
    setOpenFirstAccess(shouldOpen);
  }, [loadingMe, user?.tipo, isPrimeiroAcesso]);

  function handleCreate() {
    if (!isAdmin) return;
    setOpenModal(true);
  }

  function handleDetails(id: string) {
    navigate(`/processos_detalhes/${id}`);
  }

  function handleSubscribe(id: string) {
    // ✅ bloqueia navegação se perfil incompleto
    if (isPerfilIncompleto) {
      // pode trocar por toast se quiser
      navigate("/perfil");
      return;
    }

    navigate(`/processos/${id}/inscricao/`);
  }

  // ✅ aplica filtro só ao clicar (ou Enter)
  function applyFilter() {
    const next = qDraft.trim();
    setPage(1);
    setQ(next);
  }

  function clearFilter() {
    setQDraft("");
    setPage(1);
    setQ("");
  }

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <S.ContainerProcesso>
      {/* ✅ ALERTA de perfil incompleto */}
      {isPerfilIncompleto && (
        <S.ProfileWarn>
          <S.ProfileWarnInfo>
            <S.ProfileWarnTitle>Atualize seu perfil</S.ProfileWarnTitle>
            <S.ProfileWarnText>
              Para se inscrever em um processo, complete suas informações no
              Perfil.
            </S.ProfileWarnText>
          </S.ProfileWarnInfo>

          <S.ProfileWarnButton
            type="button"
            onClick={() => navigate("/perfil")}
          >
            Atualizar agora
          </S.ProfileWarnButton>
        </S.ProfileWarn>
      )}

      <S.PageHeader>
        <S.TitleArea>
          <S.Title>Processos</S.Title>
          <S.Subtitle>
            Consulte os processos disponíveis e faça sua inscrição.
          </S.Subtitle>
        </S.TitleArea>

        <S.HeaderActions>
          {isAdmin && (
            <S.CreateButton type="button" onClick={handleCreate}>
              Criar processo
            </S.CreateButton>
          )}
        </S.HeaderActions>
      </S.PageHeader>

      <S.Toolbar>
        <S.SearchWrap>
          <S.SearchLabel htmlFor="q">Buscar</S.SearchLabel>
          <S.SearchInput
            id="q"
            value={qDraft}
            onChange={(e) => setQDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") applyFilter();
            }}
            placeholder="Buscar por título, secretaria, status..."
          />
        </S.SearchWrap>

        <S.FilterActions>
          <S.FilterButton type="button" onClick={applyFilter}>
            Filtrar
          </S.FilterButton>

          <S.ClearButton
            type="button"
            onClick={clearFilter}
            disabled={!qDraft && !q}
            title="Limpar filtro"
          >
            Limpar
          </S.ClearButton>
        </S.FilterActions>

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

      {isError ? (
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
            Tente outro termo de busca.
            {isAdmin ? " Ou crie um novo processo." : ""}
          </S.EmptyText>
        </S.EmptyState>
      ) : (
        <>
          <S.Grid>
            {items.map((p) => {
              const bloqueadoPorPerfil = isPerfilIncompleto;
              const bloqueadoPorStatus = p.status !== "ABERTO";

              const disabled = bloqueadoPorStatus || bloqueadoPorPerfil;

              const title = bloqueadoPorPerfil
                ? "Complete seu perfil para se inscrever"
                : bloqueadoPorStatus
                  ? "Inscrições não estão abertas"
                  : undefined;

              return (
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
                      disabled={disabled}
                      title={title}
                      onClick={() => handleSubscribe(p.id_processo_seletivo)}
                    >
                      Inscrever
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
