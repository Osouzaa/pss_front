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
  FiUser,
  FiMapPin,
  FiPhone,
  FiMail,
  FiAward,
  FiHelpCircle,
} from "react-icons/fi";
import * as S from "./styles";
import { getInscricaoFull, type InscricaoFull } from "../../api/get-inscricao-full";
import { env } from "../../env";

/* ===================== Utils ===================== */
function formatDateBR(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
}

function formatBytes(bytes?: string | number | null) {
  const n = Number(bytes);
  if (!n || n <= 0) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let size = n;
  let i = 0;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function formatCPF(cpf: string) {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function formatTelefone(tel: string) {
  const d = tel.replace(/\D/g, "");
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return tel;
}

function buildFileUrl(storageKey: string): string {
  const base = env.VITE_API_URL.replace(/\/api\/?$/, "");
  const key = String(storageKey).replace(/^\/+/, "").replace(/^uploads\/+/, "");
  return `${base}/uploads/${key}`;
}

function renderResposta(pergunta: InscricaoFull["processo"]["perguntas"][number]) {
  const r = pergunta.resposta_candidato;
  if (!r) return "—";
  const tipo = pergunta.tipo.toUpperCase();

  if (tipo === "SELECT") return r.opcao_selecionada?.label ?? r.opcao_id ?? "—";
  
  if (tipo === "BOOLEAN") {
    if (r.valor_boolean === true) return "Sim";
    if (r.valor_boolean === false) return "Não";
    return "—";
  }

  if (tipo === "NUMBER" || tipo === "NUMERO") 
    return r.valor_numero != null ? String(r.valor_numero) : "—";

  // ✅ EXPERIENCIA_DIAS — valor fica em valor_numero (dias)
  if (tipo === "EXPERIENCIA_DIAS")
    return r.valor_numero != null ? `${r.valor_numero} dias` : "—";

  if (tipo === "DATE" || tipo === "DATA") 
    return formatDateBR(r.valor_data as unknown as string);

  return r.valor_texto ?? "—";
}
/* ===================== Skeleton ===================== */
function Skeleton() {
  return (
    <S.Page>
      <S.SkeletonHeader />
      <S.SkeletonCard />
      <S.SkeletonCard />
    </S.Page>
  );
}

/* ===================== Page ===================== */
export default function InscricaoDetalhePage() {
  const { id_inscricao } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["inscricao-full", id_inscricao],
    queryFn: () => getInscricaoFull(String(id_inscricao)),
    enabled: !!id_inscricao,
  });

  if (isLoading) return <Skeleton />;
  if (isError || !data) return (
    <S.Page>
      <S.ErrorBox>Não foi possível carregar a inscrição.</S.ErrorBox>
    </S.Page>
  );

  const { candidato, inscricao, processo } = data;

  const enderecoCompleto = [
    candidato.logradouro,
    candidato.numero,
    candidato.complemento,
    candidato.bairro,
    candidato.cidade,
    candidato.uf,
  ].filter(Boolean).join(", ");

  // Todos os documentos da inscrição agrupados por pergunta (suporta múltiplos)
  const documentosAnexados = processo.perguntas
    .filter((p) => p.comprovantes_anexados?.length > 0)
    .flatMap((p) =>
      (p.comprovantes_anexados ?? []).map((doc) => ({ pergunta: p, doc })),
    );

  return (
    <S.Page>
      {/* ================= HEADER ================= */}
      <S.Header>
        <S.HeaderTop>
          <S.BackButton onClick={() => navigate(-1)}>
            <FiArrowLeft size={15} />
            Voltar
          </S.BackButton>
          <S.TitleArea>
            <S.Title>Ficha de Inscrição</S.Title>
            <S.Subtitle>{processo.titulo} — {processo.secretaria}</S.Subtitle>
          </S.TitleArea>
          <S.StatusBadge status={inscricao.status}>{inscricao.status}</S.StatusBadge>
        </S.HeaderTop>

        <S.MetaGrid>
          <S.MetaCard>
            <FiClipboard size={16} />
            <div>
              <span>Protocolo</span>
              <strong>{inscricao.protocolo ?? "—"}</strong>
            </div>
          </S.MetaCard>
          <S.MetaCard>
            <FiFileText size={16} />
            <div>
              <span>Vaga</span>
              <strong>{inscricao.vaga.nome}</strong>
            </div>
          </S.MetaCard>
          <S.MetaCard>
            <FiAward size={16} />
            <div>
              <span>Nível</span>
              <strong>{inscricao.vaga.nivel}</strong>
            </div>
          </S.MetaCard>
          <S.MetaCard>
            <FiClock size={16} />
            <div>
              <span>Enviada em</span>
              <strong>{formatDateBR(inscricao.data_envio)}</strong>
            </div>
          </S.MetaCard>

          <S.MetaWide>
            <S.ScoreRow>
              <div>
                <S.CandidatoNome>{candidato.nome_completo}</S.CandidatoNome>
                <S.CandidatoCPF>CPF: {formatCPF(candidato.cpf)}</S.CandidatoCPF>
              </div>
              <S.ScoreBadge>
                <FiAward size={14} />
                {inscricao.pontuacao_total} pts
              </S.ScoreBadge>
            </S.ScoreRow>
            {inscricao.observacao && <S.Obs>{inscricao.observacao}</S.Obs>}
          </S.MetaWide>
        </S.MetaGrid>
      </S.Header>

      {/* ================= DADOS DO CANDIDATO ================= */}
      <S.Card>
        <S.CardHeader>
          <h3><FiUser size={15} /> Dados Pessoais</h3>
        </S.CardHeader>
        <S.CandidatoGrid>
          <S.InfoItem>
            <S.InfoLabel><FiMail size={12} /> E-mail</S.InfoLabel>
            <S.InfoValue>{candidato.email}</S.InfoValue>
          </S.InfoItem>
          <S.InfoItem>
            <S.InfoLabel><FiPhone size={12} /> Telefone</S.InfoLabel>
            <S.InfoValue>{formatTelefone(candidato.telefone)}</S.InfoValue>
          </S.InfoItem>
          <S.InfoItem>
            <S.InfoLabel>RG</S.InfoLabel>
            <S.InfoValue>{candidato.rg ?? "—"}</S.InfoValue>
          </S.InfoItem>
          <S.InfoItem>
            <S.InfoLabel>Data de Nascimento</S.InfoLabel>
            <S.InfoValue>
              {candidato.data_nascimento
                ? new Date(candidato.data_nascimento + "T00:00:00").toLocaleDateString("pt-BR")
                : "—"}
            </S.InfoValue>
          </S.InfoItem>
          {enderecoCompleto && (
            <S.InfoItemWide>
              <S.InfoLabel><FiMapPin size={12} /> Endereço</S.InfoLabel>
              <S.InfoValue>{enderecoCompleto}</S.InfoValue>
            </S.InfoItemWide>
          )}
        </S.CandidatoGrid>
      </S.Card>

      {/* ================= DOCUMENTOS ================= */}
      <S.Card>
        <S.CardHeader>
          <h3><FiPaperclip size={15} /> Documentos Anexados</h3>
        </S.CardHeader>
        {!documentosAnexados.length ? (
          <S.Empty>Nenhum documento anexado.</S.Empty>
        ) : (
          <S.DocGrid>
            {documentosAnexados.map(({ pergunta, doc }) => {
              const url = doc.arquivo ? buildFileUrl(doc.arquivo.storage_key) : null;
              return (
                <S.DocItem key={doc.id_candidato_documento}>
                  <S.DocInfo>
                    <strong>{doc.tipo}</strong>
                    <div>{doc.arquivo?.nome_original ?? "—"}</div>
                    <small>
                      {doc.arquivo?.mime_type ?? "—"} • {formatBytes(doc.arquivo?.tamanho_bytes)}
                    </small>
                    <S.DocPerguntaRef>{pergunta.titulo}</S.DocPerguntaRef>
                  </S.DocInfo>
                  {url ? (
                    <S.DocLink href={url} target="_blank" rel="noopener noreferrer">
                      <FiExternalLink size={14} /> Abrir
                    </S.DocLink>
                  ) : (
                    <S.DocDisabled>Sem link</S.DocDisabled>
                  )}
                </S.DocItem>
              );
            })}
          </S.DocGrid>
        )}
      </S.Card>

      {/* ================= PERGUNTAS ================= */}
      <S.Card>
        <S.CardHeader>
          <h3><FiHelpCircle size={15} /> Perguntas e Respostas</h3>
          <S.QCount>{processo.perguntas.length} pergunta{processo.perguntas.length !== 1 ? "s" : ""}</S.QCount>
        </S.CardHeader>
        {!processo.perguntas.length ? (
          <S.Empty>Nenhuma pergunta neste processo.</S.Empty>
        ) : (
          <S.ScrollArea>
            {processo.perguntas.map((pergunta, idx) => {
              const respostaTxt = renderResposta(pergunta);
              const temResposta = !!pergunta.resposta_candidato;
              const pontos = pergunta.resposta_candidato?.pontos_calculados ?? 0;

              return (
                <S.Ficha key={pergunta.id_pergunta} respondida={temResposta}>
                  <S.FichaHeader>
                    <S.FichaLeft>
                      <S.QIndex>Q{String(idx + 1).padStart(2, "0")}</S.QIndex>
                      <div>
                        <S.QuestionTitle>
                          {pergunta.titulo}
                          {pergunta.obrigatoria && <S.Required title="Obrigatória">*</S.Required>}
                        </S.QuestionTitle>
                        {pergunta.descricao && (
                          <S.QuestionDesc>{pergunta.descricao}</S.QuestionDesc>
                        )}
                      </div>
                    </S.FichaLeft>
                    <S.FichaRight>
                      <S.TypePill>{pergunta.tipo}</S.TypePill>
                      {temResposta && (
                        <S.Points positive={pontos > 0}>{pontos} pts</S.Points>
                      )}
                    </S.FichaRight>
                  </S.FichaHeader>

                  <S.FichaBody>
                    <S.AnswerBlock respondida={temResposta}>
                      <span>Resposta</span>
                      <strong>{String(respostaTxt)}</strong>
                    </S.AnswerBlock>

                    <S.DocBlock>
                      <span>Comprovante</span>
                      {!pergunta.exige_comprovante ? (
                        <S.DocStatus type="none">Não exigido</S.DocStatus>
                      ) : pergunta.comprovantes_anexados?.length > 0 ? (
                        <S.DocMultiList>
                          {pergunta.comprovantes_anexados.map((c) => (
                            <S.DocStatus key={c.id_candidato_documento} type="ok">
                              <FiCheckCircle size={12} />
                              {c.arquivo?.nome_original ?? pergunta.label_comprovante}
                            </S.DocStatus>
                          ))}
                        </S.DocMultiList>
                      ) : (
                        <S.DocStatus type="missing">Não anexado</S.DocStatus>
                      )}
                    </S.DocBlock>
                  </S.FichaBody>

                  {/* Opções SELECT */}
                  {pergunta.tipo === "SELECT" && pergunta.opcoes.length > 0 && (
                    <S.OpcoesList>
                      {pergunta.opcoes.map((op) => (
                        <S.OpcaoItem
                          key={op.id_opcao}
                          selected={pergunta.resposta_candidato?.opcao_id === op.id_opcao}
                        >
                          {op.label}
                        </S.OpcaoItem>
                      ))}
                    </S.OpcoesList>
                  )}
                </S.Ficha>
              );
            })}
          </S.ScrollArea>
        )}
      </S.Card>
    </S.Page>
  );
}