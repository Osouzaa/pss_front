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
  UploadNote,
} from "./styles";

import { InputBase } from "../../../../components/InputBase";
import { SelectBase } from "../../../../components/SelectBase";
import { uploadDocumentoMe } from "../../../../api/upload-documento-me";
import { DOCUMENTO_TIPO_OPTIONS } from "../../../../utils/documentoTipos";

const DocumentoTipoEnum = z.enum(
  [
    // Identificação
    "CPF",
    "RG",
    "CNH",
    "CERTIDAO_NASCIMENTO",
    "CERTIDAO_CASAMENTO",

    "DECLARACAO_MATRICULA",
    // Endereço
    "COMPROVANTE_ENDERECO",

    // Obrigações civis
    "CERTIFICADO_RESERVISTA",
    "TITULO_ELEITOR",

    // Formação
    "DIPLOMA",
    "HISTORICO_ESCOLAR",
    "ENSINO_SUPERIOR",
    "MESTRADO",
    "DOUTORADO",
    "CURSO",

    // Experiência profissional
    "EXPERIENCIA_PROFISSIONAL",
    "CTPS",
    "CONTRATO_TRABALHO",
    "DECLARACAO_EXPERIENCIA",

    // Ações afirmativas / cotas
    "DECLARACAO_RACA_COR",

    // PCD
    "PCD_LAUDO_MEDICO",
    "PCD_RELATORIO",

    // Outros
    "COMPROVANTE_RESERVA_VAGA",
    "OUTROS",
  ],
  { message: "Selecione uma opção válida!" },
);

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

const MAX_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIMES = ["application/pdf", "image/png", "image/jpeg"] as const;

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

    // limpa o input file quando reabrir
    if (fileRef.current) fileRef.current.value = "";
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

  function validateAndSetFile(file: File | null) {
    if (!file) {
      setSelectedFile(null);
      return;
    }

    // valida tipo (mime). Obs: alguns browsers podem mandar "" em casos raros
    if (file.type && !ALLOWED_MIMES.includes(file.type as any)) {
      toast.error("Formato inválido. Envie PDF, PNG ou JPG.");
      setSelectedFile(null);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    // valida tamanho ANTES de aceitar selecionar
    if (file.size > MAX_BYTES) {
      toast.error(
        `Arquivo muito grande (${formatBytes(file.size)}). Máximo permitido: ${formatBytes(
          MAX_BYTES,
        )}.`,
      );
      setSelectedFile(null);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    setSelectedFile(file);
  }

  const onSubmit = async (data: UploadDocumentoFormData) => {
    if (!selectedFile) {
      toast.error("Selecione um arquivo (máx. 10MB).");
      return;
    }

    // redundante (segurança): garante que ninguém burle com state/DOM
    if (selectedFile.size > MAX_BYTES) {
      toast.error(
        `Arquivo muito grande (${formatBytes(selectedFile.size)}). Máximo permitido: ${formatBytes(
          MAX_BYTES,
        )}.`,
      );
      setSelectedFile(null);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    if (
      selectedFile.type &&
      !ALLOWED_MIMES.includes(selectedFile.type as any)
    ) {
      toast.error("Formato inválido. Envie PDF, PNG ou JPG.");
      setSelectedFile(null);
      if (fileRef.current) fileRef.current.value = "";
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
              <Section>
                <SectionTitle>Detalhes do documento</SectionTitle>

                <FieldGrid>
                  <SelectBase
                    label="Tipo do documento"
                    {...register("tipo")}
                    error={errors.tipo?.message}
                  >
                    <option value="">Selecione</option>

                    {DOCUMENTO_TIPO_OPTIONS.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
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

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                    marginTop: "10px",
                  }}
                >
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

                <UploadNote>
                  Envie o documento com{" "}
                  <strong>frente e verso no mesmo arquivo</strong>.
                </UploadNote>

                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const f = e.target.files?.[0] ?? null;
                    validateAndSetFile(f);

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
                      Clique para escolher um arquivo no seu computador (máx.{" "}
                      {formatBytes(MAX_BYTES)})
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
                    <div>Tamanho máximo: {formatBytes(MAX_BYTES)}</div>
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
                      ? "Selecione um arquivo (máx. 10MB)"
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
