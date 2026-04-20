import * as Dialog from "@radix-ui/react-dialog";
import { X, UploadCloud, CheckCircle2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Content,
  HeaderContent,
  Overlay,
  Footer,
  Title,
  Body,
  Section,
  SectionTitle,
  UploadZone,
  UploadName,
  UploadHint,
  FieldGrid,
  UploadNote,
  SuccessBox,
  SuccessCircle,
  SuccessTitle,
  SuccessDesc,
  SuccessFileName,
  SuccessActions,
} from "./styles";

import { InputBase } from "../../../../components/InputBase";
import { uploadDocumentoMe } from "../../../../api/upload-documento-me";
import {
  InputSelectFilter,
  type OptionBase,
} from "../../../../components/InputSelectFilter";
import { getTiposDocumento } from "../../../../api/tipo-documento";

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

function formatBytes(bytes: number) {
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

type Phase = "form" | "sending" | "success";

export function ModalAddAnexo({ open, onOpenChange, defaultTipo }: IModalAddAnexo) {
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [phase, setPhase] = useState<Phase>("form");
  const [lastSentName, setLastSentName] = useState<string>("");

  const { data: tiposDocumento = [], isLoading: isLoadingTipos } = useQuery({
    queryKey: ["tipos-documento"],
    queryFn: () => getTiposDocumento(true),
    staleTime: 5 * 60 * 1000,
  });

  const tiposOptions = useMemo<OptionBase[]>(
    () => tiposDocumento.map((t) => ({ value: t.nome, label: t.nome, description: t.descricao ?? undefined })),
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

  function resetForm() {
    reset({ tipo: defaultTipo ?? "", descricao: "" });
    setSelectedFile(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  useEffect(() => {
    if (!open) return;
    setPhase("form");
    resetForm();
  }, [open, defaultTipo]);

  function handleClose() {
    if (phase === "sending") return;
    onOpenChange(false);
  }

  function validateFile(file: File): boolean {
    if (file.type && !ALLOWED_MIMES.includes(file.type as any)) {
      toast.error("Formato inválido. Envie PDF, PNG ou JPG.");
      return false;
    }
    if (file.size > MAX_BYTES) {
      toast.error(`Arquivo muito grande (${formatBytes(file.size)}). Máximo: 10 MB.`);
      return false;
    }
    return true;
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    e.currentTarget.value = "";
    if (!f) return;
    if (!validateFile(f)) { setSelectedFile(null); return; }
    setSelectedFile(f);
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
    } catch (err: any) {
      toast.error(err?.message ?? "Erro ao enviar documento.");
      setPhase("form");
    }
  }

  function handleAddOutro() {
    setPhase("form");
    resetForm();
  }

  const canSend = !!tipo && !!selectedFile && isValid && phase === "form";

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
              <Title>Adicionar documento</Title>
              <div className="subtitle">
                {phase === "success"
                  ? "Documento enviado! Deseja enviar mais algum?"
                  : "Envie um arquivo por vez — pode repetir quantas vezes precisar."}
              </div>
            </div>
            <button type="button" onClick={handleClose} aria-label="Fechar">
              <X size={16} />
            </button>
          </HeaderContent>

          {/* ── Estado de sucesso ── */}
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
                Tem mais documentos para enviar? Por exemplo: outra especialidade,
                curso, certificado ou comprovante? Adicione quantos precisar.
              </SuccessDesc>

              <SuccessActions>
                <button type="button" className="secondary" onClick={() => onOpenChange(false)}>
                  Não, fechar
                </button>
                <button type="button" className="primary" onClick={handleAddOutro}>
                  Sim, adicionar
                </button>
              </SuccessActions>
            </SuccessBox>
          )}

          {/* ── Formulário ── */}
          {phase !== "success" && (
            <>
              <Body>
                <Section>
                  <SectionTitle>Tipo e descrição</SectionTitle>

                  <FieldGrid>
                    <Controller
                      control={control}
                      name="tipo"
                      render={({ field }) => {
                        const selected = tiposOptions.find((o) => o.value === field.value) ?? null;
                        return (
                          <InputSelectFilter
                            id="tipo_documento"
                            label="Tipo do documento"
                            placeholder="Ex: CPF, Diploma..."
                            options={tiposOptions}
                            value={(selected?.value ?? null) as any}
                            onChange={(val) => field.onChange(val ?? "")}
                            clearable
                            showCount
                            loading={isLoadingTipos}
                            disabled={phase === "sending" || isLoadingTipos}
                            error={errors.tipo?.message as any}
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
                  <SectionTitle>Arquivo</SectionTitle>

                  <UploadNote>
                    Formatos aceitos: <strong>PDF, PNG ou JPG</strong> · máx. 10 MB.
                    Inclua frente e verso no mesmo arquivo quando necessário.{" "}
                    Após enviar, você pode adicionar <strong>quantos documentos quiser</strong> — um de cada vez.
                  </UploadNote>

                  <input
                    ref={fileRef}
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />

                  <UploadZone
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={phase === "sending"}
                    $hasFile={!!selectedFile}
                  >
                    <div className="icon">
                      {selectedFile ? <CheckCircle2 size={18} /> : <UploadCloud size={18} />}
                    </div>
                    <div className="text">
                      <UploadName>
                        {selectedFile ? selectedFile.name : "Clique para selecionar o arquivo"}
                      </UploadName>
                      <UploadHint>
                        {selectedFile
                          ? `${formatBytes(selectedFile.size)} · clique para trocar`
                          : "PDF, PNG ou JPG · máx. 10 MB"}
                      </UploadHint>
                    </div>
                  </UploadZone>
                </Section>
              </Body>

              <Footer>
                <button type="button" className="secondary" onClick={handleClose} disabled={phase === "sending"}>
                  Cancelar
                </button>
                <button
                  type="button"
                  className="primary"
                  onClick={handleEnviar}
                  disabled={!canSend || phase === "sending"}
                >
                  {phase === "sending" ? "Enviando..." : "Enviar documento"}
                </button>
              </Footer>
            </>
          )}
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
