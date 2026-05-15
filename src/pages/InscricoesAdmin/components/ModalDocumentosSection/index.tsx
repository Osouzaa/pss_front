import { ExternalLink, FileText, Image } from "lucide-react";
import * as S from "./styles";

type Documento = {
  id_candidato_documento: string;
  tipo: string;
  descricao?: string | null;
  data_criacao?: string | null;
  arquivo: {
    id_arquivo: string;
    nome_original: string;
    mime_type: string;
    tamanho_bytes: number;
  };
};

interface Props {
  isLoading: boolean;
  isError: boolean;
  documentos?: Documento[];
  urlDocumentoView: (idDoc: string) => string;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatTipo(tipo: string) {
  return tipo.replace(/_/g, " ");
}

export function ModalDocumentosSection({
  isLoading,
  isError,
  documentos,
  urlDocumentoView,
}: Props) {
  return (
    <S.Section>
      <S.SectionTitle>Documentos anexados</S.SectionTitle>

      {isLoading && <S.Muted>Carregando documentos...</S.Muted>}
      {isError && <S.ErrorBox>Erro ao carregar documentos.</S.ErrorBox>}

      {!isLoading && !isError && documentos?.length === 0 && (
        <S.Empty>Nenhum documento anexado.</S.Empty>
      )}

      {documentos && documentos.length > 0 && (
        <S.DocList>
          {documentos.map((doc) => {
            const isPdf = doc.arquivo.mime_type === "application/pdf";

            return (
              <S.DocItem key={doc.id_candidato_documento}>
                <S.DocLeft>
                  <S.DocIconWrap $isPdf={isPdf}>
                    {isPdf ? <FileText size={18} /> : <Image size={18} />}
                  </S.DocIconWrap>

                  <S.DocMeta>
                    <S.DocTipoBadge title={doc.tipo}>
                      {formatTipo(doc.tipo)}
                    </S.DocTipoBadge>
                    <S.DocNome title={doc.arquivo.nome_original}>
                      {doc.arquivo.nome_original}
                    </S.DocNome>
                    <S.DocInfo>
                      {formatBytes(doc.arquivo.tamanho_bytes)}
                      {doc.descricao ? ` · ${doc.descricao}` : ""}
                      {doc.data_criacao
                        ? ` · ${new Date(doc.data_criacao).toLocaleDateString("pt-BR")}`
                        : ""}
                    </S.DocInfo>
                  </S.DocMeta>
                </S.DocLeft>

                <S.OpenButton
                  href={urlDocumentoView(doc.id_candidato_documento)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExternalLink size={13} />
                  Abrir
                </S.OpenButton>
              </S.DocItem>
            );
          })}
        </S.DocList>
      )}
    </S.Section>
  );
}
