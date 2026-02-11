import { useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  FiArrowLeft,
  FiClipboard,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiPaperclip,
  FiExternalLink,
} from "react-icons/fi";
import * as S from "./styles";
import { api } from "../../lib/axios";
import { env } from "../../env";

type StorageProvider = "LOCAL" | "S3" | "AZURE" | "GCS";

type FullInscricaoResponse = {
  inscricao: {
    id_inscricao: string;
    id_processo_seletivo: string;
    id_vaga: string;
    status: string;
    protocolo: string;
    data_criacao?: string | null;
    data_envio?: string | null;
    observacao?: string | null;
    pontuacao_total?: number | null;
    pontuacao_detalhe?: any;
    vaga?: any;
    usuario?: {
      id_usuario: string;
      tipo: string;
      candidato?: any;
    } | null;
  };

  itens: Array<{
    id_pergunta: string;
    pergunta: {
      id_pergunta: string;
      titulo: string;
      descricao?: string | null;
      tipo: string;
      obrigatoria: boolean;
      ordem?: number | null;
      exige_comprovante?: boolean;
      label_comprovante?: string | null;
      regra_json?: any;
      opcoes?: Array<{
        id_opcao: string;
        label: string;
        pontos?: number;
        ordem?: number | null;
      }>;
    };
    resposta: {
      existe: boolean;
      id_resposta?: string | null;
      id_inscricao: string;
      id_pergunta: string;
      opcao_id?: string | null;
      opcao?: {
        id_opcao: string;
        label: string;
        pontos?: number;
      } | null;
      value?: any;
      raw?: {
        valor_texto?: string | null;
        valor_numero?: number | null;
        valor_boolean?: boolean | null;
        valor_data?: string | null;
      };
      pontos_calculados?: number | null;
      pontos_detalhe?: any;
    };
  }>;

  // ✅ documentos anexados (ajustado para os campos do backend novo)
  documentos: Array<{
    id_candidato_documento: string;
    tipo: string;
    status: string;
    descricao?: string | null;
    data_criacao: string;
    data_atualizacao: string;
    arquivo: null | {
      id_arquivo: string;

      nome_original: string;
      nome_armazenado: string;

      mime_type: string | null;
      tamanho_bytes: number;

      provider: StorageProvider;
      storage_key: string;
      url_publica: string | null;

      sha256?: string | null;
    };
  }>;
};

function formatDateBR(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
}

function formatBool(v: any) {
  if (v === true) return "Sim";
  if (v === false) return "Não";
  return "—";
}

function formatNumber(v: any) {
  if (v === null || v === undefined || v === "") return "—";
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  return n.toLocaleString("pt-BR");
}

function formatBytes(bytes?: number | null) {
  if (!bytes || bytes <= 0) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}
function guessFileName(doc: FullInscricaoResponse["documentos"][number]) {
  const a = doc.arquivo;
  if (!a) return doc.tipo;
  const nome = (a.nome_original ?? "").trim();
  if (nome) return nome;
  const stored = (a.nome_armazenado ?? "").trim();
  if (stored) return stored;
  return doc.tipo;
}

function buildFileUrl(
  arquivo: NonNullable<FullInscricaoResponse["documentos"][number]["arquivo"]>,
) {
  if (arquivo.url_publica) return arquivo.url_publica;

  if (arquivo.provider === "LOCAL") {
    const base = env.VITE_API_URL.replace(/\/api\/?$/, "");
    const key = String(arquivo.storage_key || "")
      .replace(/^\/+/, "")
      .replace(/^uploads\/+/, "");

    return `${base}/uploads/${key}`;
  }

  return null;
}

function renderResposta(item: FullInscricaoResponse["itens"][number]) {
  const tipo = String(item.pergunta.tipo ?? "").toUpperCase();
  const r = item.resposta;

  if (!r?.existe) return "—";

  if (tipo === "SELECT") return r.opcao?.label ?? "—";

  if (tipo === "BOOLEAN" || tipo === "BOOLEANO" || tipo === "BOOL") {
    return formatBool(r.value);
  }

  if (tipo === "DATA") return formatDateBR(r.value);

  if (tipo === "NUMERO" || tipo === "EXPERIENCIA_DIAS") {
    return formatNumber(r.value);
  }

  if (typeof r.value === "string") {
    const txt = r.value.trim();
    return txt ? txt : "—";
  }

  return r.value ?? "—";
}

async function fetchInscricaoFull(idInscricao: string) {
  const { data } = await api.get<FullInscricaoResponse>(
    `/processos-seletivos-inscricoes/${idInscricao}/full`,
  );
  return data;
}

export default function InscricaoDetalhePage() {
  // ⚠️ sua rota usa :id_inscricao, não :idInscricao
  const { id_inscricao } = useParams();
  const navigate = useNavigate();

  const enabled = !!id_inscricao;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["inscricao-full", id_inscricao],
    queryFn: () => fetchInscricaoFull(String(id_inscricao)),
    enabled,
    staleTime: 60_000,
  });

  const header = useMemo(() => {
    const i = data?.inscricao;
    if (!i) return null;

    const candidatoNome =
      i.usuario?.candidato?.nome ||
      i.usuario?.candidato?.nome_completo ||
      i.usuario?.candidato?.nm_candidato ||
      "Candidato";

    const vagaNome =
      i.vaga?.titulo ||
      i.vaga?.nome ||
      i.vaga?.descricao ||
      i.vaga?.nome_vaga ||
      "Vaga";

    const pontuacao = Number(i.pontuacao_total ?? 0);

    return {
      protocolo: i.protocolo ?? "—",
      status: i.status ?? "—",
      candidatoNome,
      vagaNome,
      pontuacao,
      criadoEm: formatDateBR(i.data_criacao ?? null),
      enviadoEm: formatDateBR(i.data_envio ?? null),
      observacao: (i.observacao ?? "").trim() || null,
    };
  }, [data]);

  const documentos = data?.documentos ?? [];
  const temDocumentos = documentos.length > 0;

  return (
    <S.Page>
      <S.Header>
        <S.HeaderTop>
          <S.BackButton type="button" onClick={() => navigate(-1)}>
            <FiArrowLeft />
            Voltar
          </S.BackButton>

          <S.HeaderTitleArea>
            <S.Title>Detalhe da Inscrição</S.Title>
            <S.Subtitle>
              Visualize perguntas, respostas e documentos anexados.
            </S.Subtitle>
          </S.HeaderTitleArea>
        </S.HeaderTop>

        {isLoading && (
          <S.StateBox>
            <S.StateTitle>Carregando…</S.StateTitle>
            <S.StateText>Buscando dados da inscrição.</S.StateText>
          </S.StateBox>
        )}

        {isError && (
          <S.StateBox $variant="danger">
            <S.StateTitle>Erro ao carregar</S.StateTitle>
            <S.StateText>
              {(error as any)?.response?.data?.message ??
                (error as any)?.message ??
                "Não foi possível carregar."}
            </S.StateText>
            <S.StateActions>
              <S.ActionButton type="button" onClick={() => refetch()}>
                Tentar novamente
              </S.ActionButton>
            </S.StateActions>
          </S.StateBox>
        )}

        {!isLoading && !isError && header && (
          <S.MetaGrid>
            <S.MetaCard>
              <S.MetaIcon>
                <FiClipboard />
              </S.MetaIcon>
              <S.MetaBody>
                <S.MetaLabel>Protocolo</S.MetaLabel>
                <S.MetaValue>{header.protocolo}</S.MetaValue>
              </S.MetaBody>
            </S.MetaCard>

            <S.MetaCard>
              <S.MetaIcon>
                <FiCheckCircle />
              </S.MetaIcon>
              <S.MetaBody>
                <S.MetaLabel>Status</S.MetaLabel>
                <S.MetaValue>{header.status}</S.MetaValue>
              </S.MetaBody>
            </S.MetaCard>

            <S.MetaCard>
              <S.MetaIcon>
                <FiFileText />
              </S.MetaIcon>
              <S.MetaBody>
                <S.MetaLabel>Vaga</S.MetaLabel>
                <S.MetaValue title={header.vagaNome}>
                  {header.vagaNome}
                </S.MetaValue>
              </S.MetaBody>
            </S.MetaCard>

            <S.MetaCard>
              <S.MetaIcon>
                <FiClock />
              </S.MetaIcon>
              <S.MetaBody>
                <S.MetaLabel>Enviada em</S.MetaLabel>
                <S.MetaValue>{header.enviadoEm}</S.MetaValue>
              </S.MetaBody>
            </S.MetaCard>

            <S.MetaWideCard>
              <S.MetaWideTop>
                <S.MetaWideTitle>{header.candidatoNome}</S.MetaWideTitle>
                <S.ScorePill>
                  Pontuação: <b>{header.pontuacao}</b>
                </S.ScorePill>
              </S.MetaWideTop>

              <S.MetaWideBottom>
                <S.MetaLine>
                  <span>Criada em:</span>
                  <strong>{header.criadoEm}</strong>
                </S.MetaLine>
                <S.MetaLine>
                  <span>Enviada em:</span>
                  <strong>{header.enviadoEm}</strong>
                </S.MetaLine>
              </S.MetaWideBottom>

              {header.observacao && (
                <S.ObsBox>
                  <S.ObsTitle>Observação do candidato</S.ObsTitle>
                  <S.ObsText>{header.observacao}</S.ObsText>
                </S.ObsBox>
              )}
            </S.MetaWideCard>
          </S.MetaGrid>
        )}
      </S.Header>

      {/* ✅ CARD: DOCUMENTOS */}
      {!isLoading && !isError ? (
        <S.Card>
          <S.CardHeader>
            <S.CardTitle>
              <span
                style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
              >
                <FiPaperclip /> Documentos anexados
              </span>
            </S.CardTitle>
            <S.CardDesc>
              Lista dos documentos ativos anexados pelo candidato nesta
              inscrição.
            </S.CardDesc>
          </S.CardHeader>

          {!temDocumentos ? (
            <S.EmptyCompact>
              <S.EmptyTitle>Nenhum documento anexado</S.EmptyTitle>
              <S.EmptyText>
                O candidato ainda não enviou documentos.
              </S.EmptyText>
            </S.EmptyCompact>
          ) : (
            <S.DocList>
              {documentos.map((doc) => {
                const a = doc.arquivo;
                const nomeArquivo = guessFileName(doc);
                const tamanho = formatBytes(a?.tamanho_bytes ?? null);
                const mime = a?.mime_type ?? "—";
                const url = a ? buildFileUrl(a) : null;

                return (
                  <S.DocItem key={doc.id_candidato_documento}>
                    <S.DocLeft>
                      <S.DocType>{doc.tipo}</S.DocType>
                      <S.DocName title={nomeArquivo}>{nomeArquivo}</S.DocName>

                      <S.DocMeta>
                        <span>{mime}</span>
                        <S.Dot />
                        <span>{tamanho}</span>
                        <S.Dot />
                        <span>Enviado: {formatDateBR(doc.data_criacao)}</span>
                      </S.DocMeta>

                      {doc.descricao ? (
                        <S.DocDesc title={doc.descricao}>
                          {doc.descricao}
                        </S.DocDesc>
                      ) : null}
                    </S.DocLeft>

                    <S.DocRight>
                      {url ? (
                        <S.DocLink href={url} target="_blank" rel="noreferrer">
                          <FiExternalLink />
                          Abrir
                        </S.DocLink>
                      ) : (
                        <S.DocDisabled title="Sem URL disponível no arquivo">
                          Sem link
                        </S.DocDisabled>
                      )}
                    </S.DocRight>
                  </S.DocItem>
                );
              })}
            </S.DocList>
          )}
        </S.Card>
      ) : null}

      {/* ✅ CARD: PERGUNTAS */}
      {!isLoading && !isError && data?.itens?.length ? (
        <S.Card>
          <S.CardHeader>
            <S.CardTitle>Perguntas e Respostas</S.CardTitle>
            <S.CardDesc>
              Abaixo estão as perguntas do processo e as respostas registradas
              nesta inscrição.
            </S.CardDesc>
          </S.CardHeader>

          <S.List>
            {data.itens.map((item) => {
              const respostaTxt = renderResposta(item);
              const tipo = String(item.pergunta.tipo ?? "").toUpperCase();

              return (
                <S.Item key={item.id_pergunta}>
                  <S.ItemTop>
                    <S.QuestionTitle>
                      {item.pergunta.titulo}
                      {item.pergunta.obrigatoria && <S.Required>*</S.Required>}
                    </S.QuestionTitle>

                    <S.TypePill title="Tipo da pergunta">
                      {tipo || "—"}
                    </S.TypePill>
                  </S.ItemTop>

                  {item.pergunta.descricao ? (
                    <S.QuestionDesc>{item.pergunta.descricao}</S.QuestionDesc>
                  ) : null}

                  <S.AnswerBox>
                    <S.AnswerLabel>Resposta</S.AnswerLabel>
                    <S.AnswerValue title={String(respostaTxt)}>
                      {String(respostaTxt)}
                    </S.AnswerValue>

                    <S.AnswerMeta>
                      <S.MetaChip>
                        Pontos:{" "}
                        <b>{Number(item.resposta.pontos_calculados ?? 0)}</b>
                      </S.MetaChip>

                      {item.pergunta.exige_comprovante &&
                      item.pergunta.label_comprovante ? (
                        <S.MetaChip title="Documento exigido">
                          Doc: <b>{item.pergunta.label_comprovante}</b>
                        </S.MetaChip>
                      ) : null}
                    </S.AnswerMeta>
                  </S.AnswerBox>
                </S.Item>
              );
            })}
          </S.List>
        </S.Card>
      ) : !isLoading && !isError ? (
        <S.Empty>
          <S.EmptyTitle>Nenhuma pergunta encontrada</S.EmptyTitle>
          <S.EmptyText>
            Não há perguntas ativas ou não foi possível montar o formulário
            dessa inscrição.
          </S.EmptyText>
        </S.Empty>
      ) : null}
    </S.Page>
  );
}
