// src/pages/Perfil/components/AnexosUser/index.tsx
import { useState } from "react";
import {
  FiFileText,
  FiUploadCloud,
  FiShield,
  FiTrash2,
  FiDownload,
} from "react-icons/fi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import * as S from "./styles";
import { getDocumentosMe } from "../../api/get-documentos-me";
import {
  removeDocumentoMe,
  type CandidatoDocumentoDTO,
} from "../../api/remove-documento-me";
import { ModalAddAnexo } from "../../pages/Perfil/components/ModalAddAnexo";

import { downloadDocumentoMe } from "../../api/download-documento-me";
import { saveBlob } from "../../utils/save-blob";
import { uploadDocUser } from "../../errs/upload-doc-user";

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(2)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(2)} GB`;
}

export function AnexosUser() {
  const queryClient = useQueryClient();
  const [openModal, setOpenModal] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const {
    data: docs = [],
    isLoading: isLoadingDocs,
    isFetching: isFetchingDocs,
  } = useQuery({
    queryKey: ["me-documentos"],
    queryFn: getDocumentosMe,
  });

  const removeDocMutation = useMutation({
    mutationFn: removeDocumentoMe,
    onSuccess: () => {
      toast.success("Documento removido!");
      queryClient.invalidateQueries({ queryKey: ["me-documentos"] });
    },
    onError: () => toast.error("Erro ao remover documento."),
  });

  async function handleDownload(d: CandidatoDocumentoDTO) {
    try {
      setDownloadingId(d.id_candidato_documento);

      const blob = await downloadDocumentoMe(d.id_candidato_documento);
      saveBlob(blob, d.arquivo.nome_original);

      toast.success("Download iniciado.");
    } catch (err) {
      toast.error(uploadDocUser(err));
    } finally {
      setDownloadingId(null);
    }
  }

  const docsBusy = isLoadingDocs || isFetchingDocs;

  return (
    <S.Card>
      <S.CardHeader>
        <S.CardIcon $variant="success">
          <FiFileText />
        </S.CardIcon>

        <S.CardHeaderText>
          <S.CardTitle>Documentos</S.CardTitle>
          <S.CardDesc>Envie arquivos e mantenha tudo organizado.</S.CardDesc>
        </S.CardHeaderText>
      </S.CardHeader>

      <S.DocActions>
        <S.UploadButton type="button" onClick={() => setOpenModal(true)}>
          <FiUploadCloud />
          Adicionar arquivo
        </S.UploadButton>
      </S.DocActions>

      {docsBusy ? (
        <S.Empty>
          <S.EmptyTitle>Carregando documentos...</S.EmptyTitle>
        </S.Empty>
      ) : docs.length === 0 ? (
        <S.Empty>
          <S.EmptyIcon>
            <FiShield />
          </S.EmptyIcon>
          <S.EmptyTitle>Nenhum documento enviado</S.EmptyTitle>
          <S.EmptyDesc>
            Clique em <strong>Adicionar arquivo</strong> para enviar seus
            documentos.
          </S.EmptyDesc>
        </S.Empty>
      ) : (
        <S.DocList>
          {docs.map((d: CandidatoDocumentoDTO) => {
            const isDownloading = downloadingId === d.id_candidato_documento;

            return (
              <S.DocItem key={d.id_candidato_documento}>
                <S.DocLeft>
                  <S.DocBadge>{d.tipo}</S.DocBadge>
                  <S.DocInfo>
                    <S.DocName title={d.arquivo.nome_original}>
                      {d.arquivo.nome_original}
                    </S.DocName>
                    <S.DocMeta>
                      {formatBytes(d.arquivo.tamanho_bytes)} •{" "}
                      {new Date(d.data_criacao).toLocaleDateString("pt-BR")}
                    </S.DocMeta>
                  </S.DocInfo>
                </S.DocLeft>

                <S.DocRight>
                  <S.IconButton
                    type="button"
                    title={isDownloading ? "Baixando..." : "Baixar"}
                    disabled={isDownloading || removeDocMutation.isPending}
                    onClick={() => handleDownload(d)}
                  >
                    <FiDownload />
                  </S.IconButton>

                  <S.DangerIconButton
                    type="button"
                    title="Remover"
                    disabled={removeDocMutation.isPending || isDownloading}
                    onClick={() =>
                      removeDocMutation.mutate(d.id_candidato_documento)
                    }
                  >
                    <FiTrash2 />
                  </S.DangerIconButton>
                </S.DocRight>
              </S.DocItem>
            );
          })}
        </S.DocList>
      )}

      <ModalAddAnexo open={openModal} onOpenChange={setOpenModal} />
    </S.Card>
  );
}
