import * as Dialog from "@radix-ui/react-dialog";
import {
  CheckCircle2,
  FileText,
  FileUp,
  Image,
  Loader2,
  Plus,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Body,
  Content,
  FieldGrid,
  Footer,
  FormatList,
  FormatPill,
  HeaderContent,
  Overlay,
  RemoveFileButton,
  Section,
  SectionDesc,
  SectionHeader,
  SectionTitle,
  SuccessActions,
  SuccessBox,
  SuccessCircle,
  SuccessDesc,
  SuccessFileName,
  SuccessTitle,
  Title,
  TitleIcon,
  TitleRow,
  UploadHint,
  UploadName,
  UploadNote,
  UploadZone,
} from "./styles";

import { getTiposDocumento } from "../../../../api/tipo-documento";
import { uploadDocumentoMe } from "../../../../api/upload-documento-me";
import { InputBase } from "../../../../components/InputBase";
import {
  InputSelectFilter,
  type OptionBase,
} from "../../../../components/InputSelectFilter";

const schema = z.object({
  tipo: z.string().min(1, "Selecione um tipo"),
  descricao: z.string().trim().max(255).optional().or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

interface IModalAddAnexo {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTipo?: string;
}

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIMES = ["application/pdf", "image/png", "image/jpeg"] as const;
type AllowedMime = (typeof ALLOWED_MIMES)[number];

type Phase = "form" | "sending" | "success";

function formatBytes(bytes: number) {
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

function isAllowedMime(mime: string): mime is AllowedMime {
  return ALLOWED_MIMES.includes(mime as AllowedMime);
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message;
  return "Erro ao enviar documento.";
}

export function ModalAddAnexo({ open, onOpenChange, defaultTipo }: IModalAddAnexo) {
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [phase, setPhase] = useState<Phase>("form");
  const [lastSentName, setLastSentName] = useState("");

  const { data: tiposDocumento = [], isLoading: isLoadingTipos } = useQuery({
    queryKey: ["tipos-documento"],
    queryFn: () => getTiposDocumento(true),
    staleTime: 5 * 60 * 1000,
  });

  const tiposOptions = useMemo<OptionBase[]>(
    () =>
      tiposDocumento.map((tipoDocumento) => ({
        value: tipoDocumento.nome,
        label: tipoDocumento.nome,
        description: tipoDocumento.descricao ?? undefined,
      })),
    [tiposDocumento],
  );

  const {
    register,
    reset,
    watch,
    control,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { tipo: defaultTipo ?? "", descricao: "" },
  });

  const tipo = watch("tipo");

  const resetForm = useCallback(() => {
    reset({ tipo: defaultTipo ?? "", descricao: "" });
    setSelectedFile(null);
    setIsDragging(false);
    if (fileRef.current) fileRef.current.value = "";
  }, [defaultTipo, reset]);

  useEffect(() => {
    if (!open) return;
    setPhase("form");
    resetForm();
  }, [open, resetForm]);

  function handleClose() {
    if (phase === "sending") return;
    onOpenChange(false);
  }

  function validateFile(file: File): boolean {
    if (file.type && !isAllowedMime(file.type)) {
      toast.error("Formato inválido. Envie PDF, PNG ou JPG.");
      return false;
    }

    if (file.size > MAX_BYTES) {
      toast.error(`Arquivo muito grande (${formatBytes(file.size)}). Máximo: 10 MB.`);
      return false;
    }

    return true;
  }

  function handleSelectedFile(file: File | null) {
    if (!file) return;

    if (!validateFile(file)) {
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    e.currentTarget.value = "";
    handleSelectedFile(file);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    if (phase !== "sending") setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    if (phase === "sending") return;
    handleSelectedFile(e.dataTransfer.files?.[0] ?? null);
  }

  function handleOpenFilePicker() {
    if (phase === "sending") return;
    fileRef.current?.click();
  }

  function handleUploadKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    handleOpenFilePicker();
  }

  function handleRemoveFile(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleEnviar() {
    if (!tipo || !selectedFile) return;

    const descricao = watch("descricao")?.trim() || undefined;

    setPhase("sending");
    try {
      await uploadDocumentoMe({ file: selectedFile, tipo, descricao });
      queryClient.invalidateQueries({ queryKey: ["me-documentos"] });
      setLastSentName(selectedFile.name);
      setPhase("success");
    } catch (error) {
      toast.error(getErrorMessage(error));
      setPhase("form");
    }
  }

  function handleAddOutro() {
    setPhase("form");
    resetForm();
  }

  const isSending = phase === "sending";
  const canSend = !!tipo && !!selectedFile && isValid && phase === "form";

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Overlay />
        <Content
          onPointerDownOutside={(event) => event.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
          onEscapeKeyDown={(event) => event.preventDefault()}
        >
          <HeaderContent>
            <div>
              <TitleRow>
                <TitleIcon>
                  <FileUp size={18} />
                </TitleIcon>
                <Title>Adicionar documento</Title>
              </TitleRow>
              <div className="subtitle">
                {phase === "success"
                  ? "Documento enviado! Deseja enviar mais algum?"
                  : "Envie um arquivo por vez. Depois você pode adicionar outros documentos."}
              </div>
            </div>
            <button type="button" onClick={handleClose} aria-label="Fechar">
              <X size={16} />
            </button>
          </HeaderContent>

          {phase === "success" && (
            <SuccessBox>
              <SuccessCircle>
                <CheckCircle2 size={30} />
              </SuccessCircle>

              <div>
                <SuccessTitle>Documento enviado!</SuccessTitle>
                <SuccessDesc style={{ marginTop: 6 }}>
                  O arquivo foi salvo com sucesso.
                </SuccessDesc>
              </div>

              <SuccessFileName>{lastSentName}</SuccessFileName>

              <SuccessDesc>
                Tem mais documentos para enviar? Adicione quantos precisar, um de cada vez.
              </SuccessDesc>

              <SuccessActions>
                <button type="button" className="secondary" onClick={() => onOpenChange(false)}>
                  Não, fechar
                </button>
                <button type="button" className="primary" onClick={handleAddOutro}>
                  <Plus size={15} />
                  Sim, adicionar
                </button>
              </SuccessActions>
            </SuccessBox>
          )}

          {phase !== "success" && (
            <>
              <Body>
                <Section>
                  <SectionHeader>
                    <SectionTitle>Tipo e descrição</SectionTitle>
                    <SectionDesc>Informe como esse arquivo deve aparecer na análise.</SectionDesc>
                  </SectionHeader>

                  <FieldGrid>
                    <Controller
                      control={control}
                      name="tipo"
                      render={({ field }) => {
                        const selected = tiposOptions.find((option) => option.value === field.value) ?? null;
                        return (
                          <InputSelectFilter
                            id="tipo_documento"
                            label="Tipo do documento"
                            placeholder="Ex: CPF, Diploma..."
                            options={tiposOptions}
                            value={selected?.value ?? null}
                            onChange={(value) => field.onChange(value ?? "")}
                            clearable
                            showCount
                            loading={isLoadingTipos}
                            disabled={phase === "sending" || isLoadingTipos}
                            error={errors.tipo?.message}
                          />
                        );
                      }}
                    />

                    <InputBase
                      label="Descrição (opcional)"
                      placeholder="Ex: Frente e verso"
                      {...register("descricao")}
                      error={errors.descricao?.message}
                      disabled={phase === "sending"}
                    />
                  </FieldGrid>
                </Section>

                <Section>
                  <SectionHeader>
                    <SectionTitle>Arquivo</SectionTitle>
                    <SectionDesc>Use um arquivo legível, com frente e verso juntos quando necessário.</SectionDesc>
                  </SectionHeader>

                  <UploadNote>
                    <FormatList aria-label="Formatos aceitos">
                      <FormatPill>
                        <FileText size={14} />
                        PDF
                      </FormatPill>
                      <FormatPill>
                        <Image size={14} />
                        PNG
                      </FormatPill>
                      <FormatPill>
                        <Image size={14} />
                        JPG
                      </FormatPill>
                      <FormatPill>até 10 MB</FormatPill>
                    </FormatList>
                  </UploadNote>

                  <input
                    ref={fileRef}
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />

                  <UploadZone
                    role="button"
                    tabIndex={isSending ? -1 : 0}
                    aria-disabled={isSending}
                    onClick={handleOpenFilePicker}
                    onKeyDown={handleUploadKeyDown}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    $hasFile={!!selectedFile}
                    $isDragging={isDragging}
                    $disabled={isSending}
                  >
                    <div className="icon">
                      {selectedFile ? <CheckCircle2 size={20} /> : <UploadCloud size={20} />}
                    </div>
                    <div className="text">
                      <UploadName>
                        {selectedFile ? selectedFile.name : "Clique ou arraste o arquivo aqui"}
                      </UploadName>
                      <UploadHint>
                        {selectedFile
                          ? `${formatBytes(selectedFile.size)} · clique para trocar`
                          : "PDF, PNG ou JPG · máximo de 10 MB"}
                      </UploadHint>
                    </div>
                    {selectedFile ? (
                      <RemoveFileButton
                        type="button"
                        aria-label="Remover arquivo selecionado"
                        onClick={handleRemoveFile}
                      >
                        <Trash2 size={15} />
                      </RemoveFileButton>
                    ) : null}
                  </UploadZone>
                </Section>
              </Body>

              <Footer>
                <button type="button" className="secondary" onClick={handleClose} disabled={isSending}>
                  Cancelar
                </button>
                <button
                  type="button"
                  className="primary"
                  onClick={handleEnviar}
                  disabled={!canSend || isSending}
                >
                  {isSending ? <Loader2 className="spin" size={15} /> : <UploadCloud size={15} />}
                  {isSending ? "Enviando..." : "Enviar documento"}
                </button>
              </Footer>
            </>
          )}
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
