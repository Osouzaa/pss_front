import * as S from "../styles";

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

interface ModalDocumentosSectionProps {
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

export function ModalDocumentosSection({
  isLoading,
  isError,
  documentos,
  urlDocumentoView,
}: ModalDocumentosSectionProps) {
  return (
    <S.ModalSection>
      <S.ModalSectionTitle>Documentos anexados</S.ModalSectionTitle>

      {isLoading && <S.Muted>Carregando documentos...</S.Muted>}

      {isError && <S.ErrorBox>Erro ao carregar documentos.</S.ErrorBox>}

      {!isLoading && documentos?.length === 0 && (
        <S.Empty>Nenhum documento anexado.</S.Empty>
      )}

      {documentos && documentos.length > 0 && (
        <S.DocList>
          {documentos.map((doc) => (
            <S.DocItem key={doc.id_candidato_documento}>
              <S.DocInfo>
                <S.DocIcon>
                  {doc.arquivo.mime_type === "application/pdf" ? "📄" : "🖼️"}
                </S.DocIcon>
                <div>
                  <S.DocNome>{doc.arquivo.nome_original}</S.DocNome>
                  <S.DocMeta>
                    {doc.tipo} · {formatBytes(doc.arquivo.tamanho_bytes)}
                    {doc.descricao ? ` · ${doc.descricao}` : ""}
                  </S.DocMeta>
                </div>
              </S.DocInfo>

              <S.Button
                as="a"
                href={urlDocumentoView(doc.id_candidato_documento)}
                target="_blank"
                rel="noreferrer"
                $variant="ghost"
                type="button"
              >
                Abrir →
              </S.Button>
            </S.DocItem>
          ))}
        </S.DocList>
      )}
    </S.ModalSection>
  );
}