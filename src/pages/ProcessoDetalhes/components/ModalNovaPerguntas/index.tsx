import * as Dialog from "@radix-ui/react-dialog";
import {
  Content,
  FormStyles,
  HeaderContent,
  Overlay,
  Row,
  Footer,
  Title,
} from "./styles";
import { X } from "lucide-react";

import { InputBase } from "../../../../components/InputBase";
import { SelectBase } from "../../../../components/SelectBase";
import { TextAreaBase } from "../../../../components/TextAreaBase";

import { useEffect, useMemo } from "react";
import {
  Controller,
  useForm,
  type Resolver,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createNovaPerguntaSchema,
  type CreateNovaPerguntaFormData,
} from "../../../../schemas/create-nova-pergunta";

import { criarPergunta } from "../../../../api/criar-pergunta";
import { editarPergunta } from "../../../../api/editar-pergunta";
import { DOCUMENTO_TIPO_OPTIONS } from "../../../../utils/documentoTipos";
import { InputSelectFilter } from "../../../../components/InputSelectFilter";

type PerguntaTipo =
  | "BOOLEAN"
  | "NUMERO"
  | "TEXTO"
  | "SELECT"
  | "MULTISELECT"
  | "DATA"
  | "EXPERIENCIA_DIAS";

type PerguntaToEdit = {
  id_pergunta: string;
  titulo: string;
  descricao?: string | null;
  tipo: PerguntaTipo;
  obrigatoria: boolean;
  ordem: number;
  ativa: boolean;

  pontuacao_fundamental?: number | null;
  pontuacao_medio?: number | null;
  pontuacao_superior?: number | null;

  exige_comprovante?: boolean | null;
  label_comprovante?: string | null;

  regra_json?: string | null;
};

interface IModalNovaPergunta {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id_processo_seletivo: string;
  perguntaToEdit?: PerguntaToEdit | null;
}

type FaixaForm = { ate: number; medio: number | null; superior: number | null };

const DEFAULT_FAIXAS: FaixaForm[] = [
  { ate: 365, medio: null, superior: null },
  { ate: 730, medio: null, superior: null },
  { ate: 1095, medio: null, superior: null },
  { ate: 1460, medio: null, superior: null },
  { ate: 999999, medio: null, superior: null },
];

function safeParseRegraJson(v?: string | null) {
  if (!v) return null;
  try {
    return JSON.parse(v);
  } catch {
    return null;
  }
}

function normalizeFaixasFromEdit(regra: any): FaixaForm[] | null {
  if (!regra || regra.tipo !== "FAIXAS_DIAS" || !Array.isArray(regra.faixas)) {
    return null;
  }

  const incoming: FaixaForm[] = regra.faixas
    .map((f: any) => ({
      ate: Number(f?.ate ?? 0),
      medio:
        f?.medio === null || f?.medio === undefined ? null : Number(f.medio),
      superior:
        f?.superior === null || f?.superior === undefined
          ? null
          : Number(f.superior),
    }))
    .filter((f: FaixaForm) => Number.isFinite(f.ate) && f.ate > 0)
    .sort((a: { ate: number }, b: { ate: number }) => a.ate - b.ate);

  const map = new Map<number, FaixaForm>();
  for (const f of incoming) map.set(f.ate, f);

  return DEFAULT_FAIXAS.map((d) => map.get(d.ate) ?? d);
}

export function ModalNovaPergunta({
  open,
  onOpenChange,
  id_processo_seletivo,
  perguntaToEdit,
}: IModalNovaPergunta) {
  const queryClient = useQueryClient();
  const isEdit = !!perguntaToEdit?.id_pergunta;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CreateNovaPerguntaFormData>({
    resolver: zodResolver(
      createNovaPerguntaSchema,
    ) as unknown as Resolver<CreateNovaPerguntaFormData>,
    mode: "onChange",
    defaultValues: {
      titulo: "",
      descricao: "",
      tipo: "BOOLEAN",
      obrigatoria: false,
      ordem: 0,
      ativa: true,

      pontuacao_fundamental: null,
      pontuacao_medio: null,
      pontuacao_superior: null,

      faixas: DEFAULT_FAIXAS,

      exige_comprovante: false,
      label_comprovante: null,
    },
  });

  const tipo = watch("tipo");
  const exigeComprovante = watch("exige_comprovante"); // ✅ agora vai ser boolean estável
  const faixasWatch = watch("faixas") ?? [];

  useEffect(() => {
    if (!open) return;

    if (perguntaToEdit) {
      const regra = safeParseRegraJson(perguntaToEdit.regra_json);
      const faixasFromEdit = normalizeFaixasFromEdit(regra);

      const exige = !!perguntaToEdit.exige_comprovante;
      const doc = perguntaToEdit.label_comprovante ?? null;

      reset({
        titulo: perguntaToEdit.titulo ?? "",
        descricao: perguntaToEdit.descricao ?? "",
        tipo: (perguntaToEdit.tipo ?? "BOOLEAN") as any,
        obrigatoria: !!perguntaToEdit.obrigatoria,
        ordem: Number(perguntaToEdit.ordem ?? 0),
        ativa: !!perguntaToEdit.ativa,

        pontuacao_fundamental: perguntaToEdit.pontuacao_fundamental ?? null,
        pontuacao_medio: perguntaToEdit.pontuacao_medio ?? null,
        pontuacao_superior: perguntaToEdit.pontuacao_superior ?? null,

        faixas: faixasFromEdit ?? DEFAULT_FAIXAS,

        exige_comprovante: exige,
        label_comprovante: exige ? doc : null,
      });

      // ✅ reforço
      queueMicrotask(() => {
        setValue("exige_comprovante", exige, { shouldValidate: true });
        setValue("label_comprovante", exige ? doc : null, {
          shouldValidate: true,
        });
      });

      return;
    }

    reset({
      titulo: "",
      descricao: "",
      tipo: "BOOLEAN",
      obrigatoria: false,
      ordem: 0,
      ativa: true,

      pontuacao_fundamental: null,
      pontuacao_medio: null,
      pontuacao_superior: null,

      faixas: DEFAULT_FAIXAS,

      exige_comprovante: false,
      label_comprovante: null,
    });
  }, [open, perguntaToEdit, reset, setValue]);

  // ✅ limpa pontuação se não for BOOLEAN
  useEffect(() => {
    if (!open) return;

    if (tipo !== "BOOLEAN") {
      setValue("pontuacao_fundamental", null, { shouldValidate: true });
      setValue("pontuacao_medio", null, { shouldValidate: true });
      setValue("pontuacao_superior", null, { shouldValidate: true });
    }
  }, [tipo, open, setValue]);

  // ✅ se não exige comprovante, limpa o documento
  useEffect(() => {
    if (!open) return;

    if (!exigeComprovante) {
      setValue("label_comprovante", null, { shouldValidate: true });
    }
  }, [exigeComprovante, open, setValue]);

  function handleClose() {
    onOpenChange(false);
  }

  const { mutateAsync: criarPerguntaFn } = useMutation({
    mutationFn: criarPergunta,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["perguntas-processos", id_processo_seletivo],
      });
      queryClient.invalidateQueries({
        queryKey: ["processo-id", id_processo_seletivo],
      });
    },
  });

  const { mutateAsync: editarPerguntaFn } = useMutation({
    mutationFn: editarPergunta,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["perguntas-processos", id_processo_seletivo],
      });
      queryClient.invalidateQueries({
        queryKey: ["processo-id", id_processo_seletivo],
      });
    },
  });

  const titleText = useMemo(
    () => (isEdit ? "Editar pergunta" : "Cadastrar nova pergunta"),
    [isEdit],
  );

  const submitText = useMemo(
    () => (isEdit ? "Salvar alterações" : "Cadastrar pergunta"),
    [isEdit],
  );

  const showPontuacaoPorNivel = tipo === "BOOLEAN";
  const showExperiencia = tipo === "EXPERIENCIA_DIAS";

  const onSubmit: SubmitHandler<CreateNovaPerguntaFormData> = async (data) => {
    try {
      const payload: any = {
        titulo: data.titulo,
        descricao: data.descricao ? data.descricao : null,
        tipo: data.tipo,
        obrigatoria: data.obrigatoria,
        ordem: data.ordem,
        ativa: data.ativa,

        pontuacao_fundamental: data.pontuacao_fundamental ?? null,
        pontuacao_medio: data.pontuacao_medio ?? null,
        pontuacao_superior: data.pontuacao_superior ?? null,

        exige_comprovante: data.exige_comprovante ?? false,
        label_comprovante: data.exige_comprovante
          ? (data.label_comprovante ?? null)
          : null,
      };

      if (data.tipo === "EXPERIENCIA_DIAS") {
        payload.regra_json = JSON.stringify({
          tipo: "FAIXAS_DIAS",
          faixas: (data.faixas ?? [])
            .slice()
            .sort((a, b) => Number(a.ate) - Number(b.ate))
            .map((f) => ({
              ate: Number(f.ate),
              medio: f.medio ?? 0,
              superior: f.superior ?? 0,
            })),
        });

        payload.pontuacao_fundamental = null;
        payload.pontuacao_medio = null;
        payload.pontuacao_superior = null;
      } else {
        payload.regra_json = null;
      }

      if (isEdit && perguntaToEdit?.id_pergunta) {
        await editarPerguntaFn({
          id_pergunta: perguntaToEdit.id_pergunta,
          payload,
        });

        toast.success("Pergunta atualizada com sucesso!");
        handleClose();
        return;
      }

      await criarPerguntaFn({
        id_processo_seletivo,
        payload,
      });

      toast.success("Pergunta cadastrada com sucesso!");
      handleClose();
    } catch (e: any) {
      toast.error(e?.message ?? "Não foi possível salvar a pergunta");
    }
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
            <Title>{titleText}</Title>
            <button type="button" onClick={handleClose} aria-label="Fechar">
              <X size={16} />
            </button>
          </HeaderContent>

          <FormStyles onSubmit={handleSubmit(onSubmit)}>
            <InputBase
              label="Título da pergunta"
              placeholder="Ex: Quantos dias de experiência você tem?"
              {...register("titulo")}
              error={errors.titulo?.message}
            />

            <TextAreaBase
              label="Descrição (opcional)"
              placeholder="Ex: Informe o total de dias de experiência comprovável."
              {...register("descricao")}
            />

            <Row>
              <SelectBase
                label="Tipo"
                {...register("tipo")}
                error={errors.tipo?.message as any}
              >
                <option value="">Selecione</option>
                <option value="BOOLEAN">Sim/Não (BOOLEAN)</option>
                <option value="NUMERO">Número (NUMERO)</option>
                <option value="TEXTO">Texto (TEXTO)</option>
                <option value="SELECT">Seleção Única (SELECT)</option>
                <option value="DATA">Data (DATA)</option>
                <option value="EXPERIENCIA_DIAS">Experiência (em dias)</option>
              </SelectBase>

              <InputBase
                label="Ordem"
                type="number"
                placeholder="0"
                {...register("ordem", { valueAsNumber: true })}
                error={errors.ordem?.message}
              />
            </Row>

            <Row>
              <SelectBase
                label="Obrigatória?"
                {...register("obrigatoria", {
                  setValueAs: (v) => v === true || v === "true",
                })}
              >
                <option value="false">Não</option>
                <option value="true">Sim</option>
              </SelectBase>

              <SelectBase
                label="Ativa?"
                {...register("ativa", {
                  setValueAs: (v) => v === true || v === "true",
                })}
                error={errors.ativa?.message}
              >
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </SelectBase>
            </Row>

            {/* ✅ anexo (Controller nos DOIS campos) */}
            <Row>
              <Controller
                control={control}
                name="exige_comprovante"
                render={({ field }) => (
                  <SelectBase
                    label="Precisa de anexo?"
                    value={field.value ? "true" : "false"}
                    onChange={(e) => field.onChange(e.target.value === "true")}
                  >
                    <option value="false">Não</option>
                    <option value="true">Sim</option>
                  </SelectBase>
                )}
              />

              {exigeComprovante ? (
                <Controller
                  control={control}
                  name="label_comprovante"
                  render={({ field }) => {
                    // ✅ transforma suas options pra o formato do InputSelectFilter
                    const documentoOptions = DOCUMENTO_TIPO_OPTIONS.map(
                      (d) => ({
                        value: d.value,
                        label: d.label,
                        // se quiser: description: d.description
                      }),
                    );

                    // ✅ acha a option atual (pra controlar o value)
                    const selected =
                      documentoOptions.find(
                        (o) => o.value === (field.value ?? ""),
                      ) ?? null;

                    return (
                      <InputSelectFilter
                        id="label_comprovante"
                        label="Qual documento?"
                        placeholder="Digite para buscar..."
                        options={documentoOptions}
                        value={selected?.value ?? null}
                        onChange={(val) => field.onChange(val ?? null)}
                        clearable
                        loading={false}
                        error={errors.label_comprovante?.message as any}
                        helperText="Digite para filtrar e selecione um documento."
                        showCount
                        // ✅ opcional: se você quiser busca remota no backend
                        // onSearch={(term) => setDocumentoTerm(term)}
                      />
                    );
                  }}
                />
              ) : (
                <div />
              )}
            </Row>

            {exigeComprovante ? (
              <p style={{ marginTop: 6, fontSize: 12, opacity: 0.8 }}>
                Se o candidato tentar finalizar sem esse documento, o backend
                deve bloquear.
              </p>
            ) : null}

            {showPontuacaoPorNivel ? (
              <>
                <Row className="row-grid">
                  <InputBase
                    label="Pontuação (Fundamental)"
                    type="number"
                    placeholder="Ex: 0"
                    {...register("pontuacao_fundamental", {
                      valueAsNumber: true,
                    })}
                    error={errors.pontuacao_fundamental?.message}
                  />

                  <InputBase
                    label="Pontuação (Médio)"
                    type="number"
                    placeholder="Ex: 10"
                    {...register("pontuacao_medio", { valueAsNumber: true })}
                    error={errors.pontuacao_medio?.message}
                  />

                  <InputBase
                    label="Pontuação (Superior)"
                    type="number"
                    placeholder="Ex: 5"
                    {...register("pontuacao_superior", { valueAsNumber: true })}
                    error={errors.pontuacao_superior?.message}
                  />
                </Row>

                <p style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>
                  Para perguntas SELECT/MULTISELECT, a pontuação deve ficar nas
                  opções.
                </p>
              </>
            ) : null}

            {showExperiencia ? (
              <>
                <div style={{ marginTop: 8, fontSize: 13, fontWeight: 600 }}>
                  Faixas de experiência (dias)
                </div>

                <p style={{ marginTop: 6, fontSize: 12, opacity: 0.8 }}>
                  A pontuação será calculada pelo nível da vaga (Médio/Superior)
                  conforme a faixa:
                  <br />
                  0–365, 366–730, 731–1095, 1096–1460 e acima de 1460.
                </p>

                {faixasWatch.slice(0, 5).map((_, idx) => (
                  <Row key={idx} className="row-grid">
                    <InputBase
                      label={
                        idx === 0
                          ? "Até 365 dias"
                          : idx === 1
                            ? "Até 730 dias"
                            : idx === 2
                              ? "Até 1095 dias"
                              : idx === 3
                                ? "Até 1460 dias"
                                : "Acima de 1460 dias"
                      }
                      type="number"
                      placeholder={idx === 4 ? "999999" : "Ex: 365"}
                      {...register(`faixas.${idx}.ate` as const, {
                        valueAsNumber: true,
                      })}
                      error={(errors.faixas as any)?.[idx]?.ate?.message}
                      disabled
                    />

                    <InputBase
                      label="Pontos (Médio)"
                      type="number"
                      placeholder="Ex: 10"
                      {...register(`faixas.${idx}.medio` as const, {
                        setValueAs: (v) =>
                          v === "" || v === null || v === undefined
                            ? null
                            : Number(v),
                      })}
                      error={(errors.faixas as any)?.[idx]?.medio?.message}
                    />

                    <InputBase
                      label="Pontos (Superior)"
                      type="number"
                      placeholder="Ex: 15"
                      {...register(`faixas.${idx}.superior` as const, {
                        setValueAs: (v) =>
                          v === "" || v === null || v === undefined
                            ? null
                            : Number(v),
                      })}
                      error={(errors.faixas as any)?.[idx]?.superior?.message}
                    />
                  </Row>
                ))}

                {errors.faixas ? (
                  <p style={{ marginTop: 8, fontSize: 12, color: "#DC2626" }}>
                    {(errors.faixas as any)?.message}
                  </p>
                ) : null}
              </>
            ) : null}

            <Footer>
              <button type="button" className="secondary" onClick={handleClose}>
                Cancelar
              </button>

              <button
                type="submit"
                className="primary"
                title={
                  !isValid ? "Preencha os campos corretamente" : submitText
                }
                disabled={isSubmitting || !isValid}
              >
                {isSubmitting ? "Salvando..." : submitText}
              </button>
            </Footer>
          </FormStyles>
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
