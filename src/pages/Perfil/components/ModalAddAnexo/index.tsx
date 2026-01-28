import * as Dialog from "@radix-ui/react-dialog";
import { X, UploadCloud, FileText } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Content,
  FormStyles,
  HeaderContent,
  Overlay,
  Footer,
  Title,
  Body,
  Section,
  SectionTitle,
  UploadZone,
  UploadMeta,
  UploadName,
  UploadHint,
  Chip,
  FieldGrid,
} from "./styles";

import { InputBase } from "../../../../components/InputBase";
import { SelectBase } from "../../../../components/SelectBase";
import { uploadDocumentoMe } from "../../../../api/upload-documento-me";

const DocumentoTipoEnum = z.enum([
  "COMPROVANTE_ENDERECO",
  "CPF",
  "DIPLOMA",
  "ENSINO_SUPERIOR",
  "MESTRADO",
  "DOUTORADO",
  "CURSO",
  "EXPERIENCIA_PROFISSIONAL",
  "OUTROS",
]);

type DocumentoTipo = z.infer<typeof DocumentoTipoEnum>;

const uploadDocumentoSchema = z.object({
  tipo: DocumentoTipoEnum,
  descricao: z
    .string()
    .trim()
    .max(255, "Descrição muito longa (máx. 255)")
    .optional()
    .or(z.literal("")),
});

type UploadDocumentoFormData = z.infer<typeof uploadDocumentoSchema>;

interface IModalAddAnexo {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTipo?: DocumentoTipo;
}

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(2)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(2)} GB`;
}

function labelTipo(tipo: DocumentoTipo) {
  switch (tipo) {
    case "CPF":
      return "CPF";
    case "COMPROVANTE_ENDERECO":
      return "Comprovante de endereço";
    case "DIPLOMA":
      return "Diploma";
    case "ENSINO_SUPERIOR":
      return "Ensino Superior";
    case "MESTRADO":
      return "Mestrado (até 2)";
    case "DOUTORADO":
      return "Doutorado";
    case "CURSO":
      return "Cursos";
    case "EXPERIENCIA_PROFISSIONAL":
      return "Experiencia Profissional";
    case "OUTROS":
      return "Outros";
    default:
      return tipo;
  }
}

export function ModalAddAnexo({
  open,
  onOpenChange,
  defaultTipo,
}: IModalAddAnexo) {
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<UploadDocumentoFormData>({
    resolver: zodResolver(uploadDocumentoSchema),
    mode: "onChange",
    defaultValues: {
      tipo: defaultTipo ?? "OUTROS",
      descricao: "",
    },
  });

  const tipo = watch("tipo");

  useEffect(() => {
    if (!open) return;

    reset({
      tipo: defaultTipo ?? "OUTROS",
      descricao: "",
    });
    setSelectedFile(null);
  }, [open, defaultTipo, reset]);

  function handleClose() {
    onOpenChange(false);
  }

  const titleText = useMemo(() => "Adicionar documento", []);
  const submitText = useMemo(() => "Enviar arquivo", []);

  const { mutateAsync: uploadFn } = useMutation({
    mutationFn: uploadDocumentoMe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me-documentos"] });
      toast.success("Documento enviado com sucesso!");
      handleClose();
    },
    onError: (e: any) => {
      toast.error(
        e?.response?.data?.message ?? e?.message ?? "Falha ao enviar documento",
      );
    },
  });

  const onSubmit = async (data: UploadDocumentoFormData) => {
    if (!selectedFile) {
      toast.error("Selecione um arquivo");
      return;
    }

    const allowed = ["application/pdf", "image/png", "image/jpeg"];
    if (selectedFile.type && !allowed.includes(selectedFile.type)) {
      toast.error("Formato inválido. Envie PDF, PNG ou JPG.");
      return;
    }

    const maxBytes = 10 * 1024 * 1024; // 10MB
    if (selectedFile.size > maxBytes) {
      toast.error("Arquivo muito grande. Máximo 10MB.");
      return;
    }

    const descricao = (data.descricao ?? "").trim();
    await uploadFn({
      file: selectedFile,
      tipo: data.tipo,
      // só envia quando OUTROS, mas pode enviar sempre se quiser
      descricao: descricao ? descricao : undefined,
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Overlay />
        <Content
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <HeaderContent>
            <div>
              <Title>{titleText}</Title>
              <div className="subtitle">
                Escolha o tipo e envie seu arquivo com segurança.
              </div>
            </div>

            <button type="button" onClick={handleClose} aria-label="Fechar">
              <X size={16} />
            </button>
          </HeaderContent>

          <Body>
            <FormStyles onSubmit={handleSubmit(onSubmit)}>
              {/* ===== Seção: Tipo e Detalhes ===== */}
              <Section>
                <SectionTitle>Detalhes do documento</SectionTitle>

                <FieldGrid>
                  <SelectBase
                    label="Tipo do documento"
                    {...register("tipo")}
                    error={errors.tipo?.message}
                  >
                    <option value="">Selecione</option>
                    <option value="CPF">CPF</option>
                    <option value="COMPROVANTE_ENDERECO">
                      Comprovante de endereço
                    </option>
                    <option value="DIPLOMA">Diploma</option>
                    <option value="ENSINO_SUPERIOR">Ensino Superior</option>
                    <option value="MESTRADO">Mestrado (até 2)</option>
                    <option value="DOUTORADO">Doutorado</option>
                    <option value="CURSO">Cursos</option>
                    <option value="EXPERIENCIA_PROFISSIONAL">
                      Experiêcia Profissional
                    </option>
                    <option value="OUTROS">Outros</option>
                  </SelectBase>

                  <InputBase
                    label="Descrição (opcional)"
                    placeholder={
                      tipo === "CURSO"
                        ? "Ex: Certificado - Excel Avançado"
                        : "Ex: Frente e verso"
                    }
                    {...register("descricao")}
                    error={errors.descricao?.message}
                    disabled={isSubmitting}
                  />
                </FieldGrid>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Chip>
                    <FileText size={14} />
                    {labelTipo(tipo)}
                  </Chip>
                  <Chip>
                    <UploadCloud size={14} />
                    PDF/PNG/JPG • até 10MB
                  </Chip>
                </div>
              </Section>

              {/* ===== Seção: Upload ===== */}
              <Section>
                <SectionTitle>Arquivo</SectionTitle>

                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const f = e.target.files?.[0] ?? null;
                    setSelectedFile(f);

                    // permite selecionar o mesmo arquivo novamente
                    e.currentTarget.value = "";
                  }}
                />

                <UploadZone
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={isSubmitting}
                >
                  <div className="icon">
                    <UploadCloud size={18} />
                  </div>

                  <div className="text">
                    <UploadName>
                      {selectedFile ? "Trocar arquivo" : "Selecionar arquivo"}
                    </UploadName>
                    <UploadHint>
                      Clique para escolher um arquivo no seu computador
                    </UploadHint>
                  </div>
                </UploadZone>

                {selectedFile ? (
                  <UploadMeta>
                    <div>
                      <strong>Arquivo:</strong> {selectedFile.name}
                    </div>
                    <div>
                      <strong>Tamanho:</strong> {formatBytes(selectedFile.size)}
                    </div>
                    <div>
                      <strong>Tipo:</strong>{" "}
                      {selectedFile.type ? selectedFile.type : "desconhecido"}
                    </div>
                  </UploadMeta>
                ) : (
                  <UploadMeta>
                    <div>Formatos aceitos: PDF, PNG, JPG</div>
                    <div>Tamanho máximo: 10MB</div>
                  </UploadMeta>
                )}
              </Section>

              <Footer>
                <button
                  type="button"
                  className="secondary"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="primary"
                  title={
                    !selectedFile
                      ? "Selecione um arquivo"
                      : !isValid
                        ? "Preencha os campos corretamente"
                        : submitText
                  }
                  disabled={isSubmitting || !selectedFile || !isValid}
                >
                  {isSubmitting ? "Enviando..." : submitText}
                </button>
              </Footer>
            </FormStyles>
          </Body>
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
