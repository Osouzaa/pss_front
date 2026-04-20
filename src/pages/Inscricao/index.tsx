import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import { ModalDocsFaltando } from "./components/ModalDocsFaltando";
import { type DocFaltando } from "./useInscricaoActions";

import * as S from "./styles";

import type { RespostasState } from "./types";
import { useInscricaoData } from "./useInscricaoData";
import { useInscricaoActions } from "./useInscricaoActions";

import { VagaSelect } from "./components/VagaSelect";
import { PerguntasSection } from "./components/PerguntasSection";
import { ActionsBar } from "./components/ActionsBar";
import { toDateInputValue } from "./components/PerguntaField";
import { AnexosUser } from "../../components/AnexosUser";
import { InscricaoSkeleton } from "../../components/SkeletonInscricao";
import { uploadDocumentoMe } from "../../api/upload-documento-me";

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
  const [docsFaltando, setDocsFaltando] = useState<DocFaltando[]>([]);
  const [modalDocsOpen, setModalDocsOpen] = useState(false);
  const [anexoFiles, setAnexoFiles] = useState<Record<string, { file: File; tipo: string }>>({});
  const [isUploadingAnexos, setIsUploadingAnexos] = useState(false);

  // ✅ em vez de boolean, guarda QUAL inscrição foi hidratada
  const hydratedIdRef = useRef<string | null>(null);

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
    hydratedIdRef.current = null;
    setRespostas({});
    setAnexoFiles({});
  }, [idInscricao]);

  // hidratar respostas
  useEffect(() => {
    if (!idInscricao) return;
    if (!inscricaoQuery.data) return;

    // ✅ se já hidratou esse id, não faz de novo
    if (hydratedIdRef.current === idInscricao) return;

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

    // ✅ marca que hidratou essa inscrição
    hydratedIdRef.current = idInscricao;
  }, [idInscricao, inscricaoQuery.data]);

  const queryClient = useQueryClient();

  const { iniciarMut, salvarMut, enviarMut, buildPayload } =
    useInscricaoActions({
      idProcesso,
      idInscricao,
      perguntas,
      respostas,
      onDocumentosFaltando: (docs) => {
        setDocsFaltando(docs);
        setModalDocsOpen(true);
      },
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

    const uploads = Object.values(anexoFiles);

    try {
      // 1. Upload dos arquivos ANEXO (antes de salvar/enviar)
      if (uploads.length > 0) {
        setIsUploadingAnexos(true);
        try {
          await Promise.all(
            uploads.map(({ file, tipo }) => uploadDocumentoMe({ file, tipo })),
          );
          queryClient.invalidateQueries({ queryKey: ["me-documentos"] });
        } catch {
          toast.error("Erro ao enviar os arquivos anexados. Verifique e tente novamente.");
          return;
        } finally {
          setIsUploadingAnexos(false);
        }
      }

      // 2. Salvar respostas + enviar inscrição
      await salvarMut.mutateAsync({
        body: buildPayload(),
        silent: true,
      });

      await enviarMut.mutateAsync();

      navigate("/minhas-inscricoes");
    } catch {
      // salvarMut e enviarMut já exibem toast via onError
    }
  }

  if (!idProcesso) return <S.Page>Processo inválido.</S.Page>;
  if (processoQuery.isLoading) return <S.Page>Carregando processo...</S.Page>;
  if (processoQuery.isError || !processo)
    return <S.Page>Não foi possível carregar o processo.</S.Page>;
  if (idInscricao && inscricaoQuery.isLoading) return <InscricaoSkeleton />;

  const iniciou = !!idInscricao;
  const vagaSelecionada = vagas?.find((v) => v.id_vaga === idVaga) ?? null;
  const nivel = vagaSelecionada?.nivel ?? null;
  const MANY_QUESTIONS_THRESHOLD = 12;
  const isLongForm = (perguntas?.length ?? 0) >= MANY_QUESTIONS_THRESHOLD;

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
          <S.Layout $singleColumn={isLongForm}>
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
                    nivel={nivel}
                    anexoFiles={Object.fromEntries(
                      Object.entries(anexoFiles).map(([k, v]) => [k, v.file]),
                    )}
                    onChangeResposta={(idPergunta, next) =>
                      setRespostas((prev) => ({ ...prev, [idPergunta]: next }))
                    }
                    onFileSelect={(idPergunta, file) => {
                      const pergunta = perguntas?.find((p: any) => p.id_pergunta === idPergunta) as any;
                      const tipo = pergunta?.label_comprovante ?? "Documento";
                      setAnexoFiles((prev) => {
                        if (!file) {
                          const next = { ...prev };
                          delete next[idPergunta];
                          return next;
                        }
                        return { ...prev, [idPergunta]: { file, tipo } };
                      });
                    }}
                  />
                ) : null}
              </S.Grid>

              {iniciou ? (
                <ActionsBar
                  primaryLabel={
                    isUploadingAnexos
                      ? "Enviando anexos..."
                      : enviarMut.isPending || salvarMut.isPending
                        ? "Finalizando..."
                        : "Finalizar edição"
                  }
                  onPrimary={handleFinalizar}
                  primaryDisabled={isUploadingAnexos || salvarMut.isPending || enviarMut.isPending}
                />
              ) : null}
            </S.Main>

            <S.Side $singleColumn={isLongForm}>
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
      <ModalDocsFaltando
        open={modalDocsOpen}
        onOpenChange={setModalDocsOpen}
        docs={docsFaltando}
      />
    </S.Page>
  );
}
