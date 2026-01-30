import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import * as S from "./styles";

import type { RespostasState } from "./types";
import { useInscricaoData } from "./useInscricaoData";
import { useInscricaoActions } from "./useInscricaoActions";

import { VagaSelect } from "./components/VagaSelect";
import { PerguntasSection } from "./components/PerguntasSection";
import { ActionsBar } from "./components/ActionsBar";
import { toDateInputValue } from "./components/PerguntaField";
import { AnexosUser } from "../../components/AnexosUser";

export function InscricaoPage() {
  const navigate = useNavigate();
  const { id, id_inscricao } = useParams<{
    id: string;
    id_inscricao?: string;
  }>();

  const idProcesso = id ?? "";
  const [idInscricao, setIdInscricao] = useState<string>(id_inscricao ?? "");
  const [idVaga, setIdVaga] = useState<string>("");

  const [respostas, setRespostas] = useState<RespostasState>({});
  const hydratedRef = useRef(false);

  useEffect(() => {
    setIdInscricao(id_inscricao ?? "");
  }, [id_inscricao]);

  const { processoQuery, inscricaoQuery, processo, vagas, perguntas } =
    useInscricaoData({
      idProcesso,
      idInscricao,
    });

  // reset ao trocar inscrição
  useEffect(() => {
    hydratedRef.current = false;
    setRespostas({});
  }, [idInscricao]);

  // hidratar respostas
  useEffect(() => {
    if (!inscricaoQuery.data) return;
    if (hydratedRef.current) return;

    const { inscricao, respostas: respostasApi } = inscricaoQuery.data;

    setIdVaga(inscricao?.id_vaga ?? "");

    const next: RespostasState = {};
    for (const r of respostasApi ?? []) {
      const pid = r.id_pergunta;
      if (!pid) continue;

      if (r.opcao_id) next[pid] = r.opcao_id;
      else if (r.valor_boolean !== null && r.valor_boolean !== undefined)
        next[pid] = r.valor_boolean;
      else if (r.valor_numero !== null && r.valor_numero !== undefined)
        next[pid] = r.valor_numero;
      else if (r.valor_texto !== null && r.valor_texto !== undefined)
        next[pid] = r.valor_texto;
      else if (r.valor_data) next[pid] = toDateInputValue(r.valor_data);
      else next[pid] = null;
    }

    setRespostas(next);
    hydratedRef.current = true;
  }, [inscricaoQuery.data]);

  const { iniciarMut, salvarMut, enviarMut, buildPayload } =
    useInscricaoActions({
      idProcesso,
      idInscricao,
      perguntas,
      respostas,
    });

  async function handleIniciar() {
    if (!idVaga) return toast.error("Selecione uma vaga para iniciar.");

    const response = await iniciarMut.mutateAsync({
      id_processo_seletivo: idProcesso,
      id_vaga: idVaga,
    });

    if (response.readonly) {
      toast.warning(
        "Voce já tem uma inscrição nessa vaga! Vamos levar você para atualizar informações.",
      );
    }

    const newId = response?.id_inscricao as string | undefined;
    if (!newId) return toast.error("Backend não retornou id_inscricao.");

    setIdInscricao(newId);
    navigate(`/processos/${idProcesso}/inscricao/${newId}`, { replace: true });
  }

  async function handleFinalizar() {
    if (!idVaga) return toast.error("Selecione uma vaga.");
    if (!idInscricao) return toast.error("Inicie a inscrição primeiro.");

    await salvarMut.mutateAsync(buildPayload());
    await enviarMut.mutateAsync();
  }

  if (!idProcesso) return <S.Page>Processo inválido.</S.Page>;
  if (processoQuery.isLoading) return <S.Page>Carregando processo...</S.Page>;
  if (processoQuery.isError || !processo)
    return <S.Page>Não foi possível carregar o processo.</S.Page>;
  if (idInscricao && inscricaoQuery.isLoading)
    return <S.Page>Carregando inscrição...</S.Page>;

  const iniciou = !!idInscricao;

  return (
    <S.Page>
      <S.Card>
        <S.CardHeader>
          <S.HeaderRight>
            <S.ProcessoLabel>Processo</S.ProcessoLabel>
            <S.ProcessoTitle>{processo.titulo}</S.ProcessoTitle>
            <S.ProcessoSubtitle>
              {iniciou
                ? "Você pode editar e salvar a qualquer momento."
                : "Selecione a vaga e clique em iniciar."}
            </S.ProcessoSubtitle>
          </S.HeaderRight>
        </S.CardHeader>

        <S.Form onSubmit={(e) => e.preventDefault()}>
          <S.Layout>
            <S.Main>
              <S.Grid>
                <div style={{ gridColumn: "1 / -1" }}>
                  <VagaSelect
                    vagas={vagas}
                    value={idVaga}
                    onChange={setIdVaga}
                    disabled={iniciou}
                  />

                  {!iniciou ? (
                    <ActionsBar
                      hideBorderTop
                      secondaryLabel="Voltar"
                      onSecondary={() => navigate(-1)}
                      primaryLabel={
                        iniciarMut.isPending
                          ? "Iniciando..."
                          : "Iniciar inscrição"
                      }
                      onPrimary={handleIniciar}
                      primaryDisabled={!idVaga || iniciarMut.isPending}
                    />
                  ) : null}
                </div>

                {iniciou ? (
                  <PerguntasSection
                    perguntas={perguntas}
                    respostas={respostas}
                    onChangeResposta={(idPergunta, next) =>
                      setRespostas((prev) => ({ ...prev, [idPergunta]: next }))
                    }
                  />
                ) : null}
              </S.Grid>

              {iniciou ? (
                <ActionsBar
                  primaryLabel={
                    enviarMut.isPending ? "Finalizando..." : "Finalizar edição"
                  }
                  onPrimary={handleFinalizar}
                  primaryDisabled={salvarMut.isPending || enviarMut.isPending}
                />
              ) : null}
            </S.Main>

            <S.Side>
              <S.SideCard>
                <S.SideHeader>
                  <S.SideTitle>Anexos</S.SideTitle>
                </S.SideHeader>

                <S.SideBody>
                  <AnexosUser />
                </S.SideBody>
              </S.SideCard>
            </S.Side>
          </S.Layout>
        </S.Form>
      </S.Card>
    </S.Page>
  );
}
