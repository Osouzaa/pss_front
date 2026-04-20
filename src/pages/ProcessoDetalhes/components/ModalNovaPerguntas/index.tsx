import * as Dialog from "@radix-ui/react-dialog";
import {
  Content,
  FormStyles,
  HeaderContent,
  Row,
  Footer,
  Title,
  Subtitle,
  Section,
  SectionTitle,
  TypeGrid,
  TypeCard,
  TypeCardName,
  TypeCardDesc,
  InfoNote,
  FaixasTable,
  FaixasHeader,
  FaixaRow,
  FaixaLabel,
  FaixaLabelMain,
  FaixaLabelSub,
  FaixaInput,
  Overlay,
} from "./styles";
import { X, Info } from "lucide-react";

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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createNovaPerguntaSchema,
  type CreateNovaPerguntaFormData,
} from "../../../../schemas/create-nova-pergunta";

import { criarPergunta } from "../../../../api/criar-pergunta";
import { editarPergunta } from "../../../../api/editar-pergunta";
import { getTiposDocumento } from "../../../../api/tipo-documento";
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
  { ate: 365,    medio: null, superior: null },
  { ate: 730,    medio: null, superior: null },
  { ate: 1095,   medio: null, superior: null },
  { ate: 1460,   medio: null, superior: null },
  { ate: 999999, medio: null, superior: null },
];

const FAIXA_LABELS = [
  { main: "1 ano completo",   sub: "365 dias" },
  { main: "1 a 2 anos",       sub: "366 – 730 dias" },
  { main: "2 a 3 anos",       sub: "731 – 1.095 dias" },
  { main: "3 a 4 anos",       sub: "1.096 – 1.460 dias" },
  { main: "Acima de 4 anos",  sub: "mais de 1.460 dias" },
];

const TIPOS_CONFIG = [
  { value: "BOOLEAN",         label: "Sim / Não",        desc: "Resposta binária com pontuação por nível" },
  { value: "NUMERO",          label: "Número",            desc: "Campo numérico livre" },
  { value: "TEXTO",           label: "Texto livre",       desc: "Resposta dissertativa" },
  { value: "SELECT",          label: "Seleção única",     desc: "Uma opção entre as cadastradas" },
  { value: "MULTISELECT",     label: "Múltipla escolha",  desc: "Várias opções selecionáveis" },
  { value: "DATA",            label: "Data",              desc: "Campo de data (dd/mm/aaaa)" },
  { value: "EXPERIENCIA_DIAS",label: "Experiência",       desc: "Dias de experiência com pontuação por faixas" },
];

function safeParseRegraJson(v?: string | null) {
  if (!v) return null;
  try { return JSON.parse(v); } catch { return null; }
}

function normalizeFaixasFromEdit(regra: any): FaixaForm[] | null {
  if (!regra || regra.tipo !== "FAIXAS_DIAS" || !Array.isArray(regra.faixas)) return null;

  const incoming: FaixaForm[] = regra.faixas
    .map((f: any) => ({
      ate: Number(f?.ate ?? 0),
      medio: f?.medio === null || f?.medio === undefined ? null : Number(f.medio),
      superior: f?.superior === null || f?.superior === undefined ? null : Number(f.superior),
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

  const { data: tiposDocumento = [], isLoading: isLoadingTipos } = useQuery({
    queryKey: ["tipos-documento"],
    queryFn: () => getTiposDocumento(true),
    staleTime: 5 * 60 * 1000,
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CreateNovaPerguntaFormData>({
    resolver: zodResolver(createNovaPerguntaSchema) as unknown as Resolver<CreateNovaPerguntaFormData>,
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
  const exigeComprovante = watch("exige_comprovante");


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

      queueMicrotask(() => {
        setValue("exige_comprovante", exige, { shouldValidate: true });
        setValue("label_comprovante", exige ? doc : null, { shouldValidate: true });
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

  useEffect(() => {
    if (!open) return;
    if (tipo !== "BOOLEAN") {
      setValue("pontuacao_fundamental", null, { shouldValidate: true });
      setValue("pontuacao_medio", null, { shouldValidate: true });
      setValue("pontuacao_superior", null, { shouldValidate: true });
    }
  }, [tipo, open, setValue]);

  useEffect(() => {
    if (!open) return;
    if (!exigeComprovante) {
      setValue("label_comprovante", null, { shouldValidate: true });
    }
  }, [exigeComprovante, open, setValue]);

  function handleClose() { onOpenChange(false); }

  const { mutateAsync: criarPerguntaFn } = useMutation({
    mutationFn: criarPergunta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["perguntas-processos", id_processo_seletivo] });
      queryClient.invalidateQueries({ queryKey: ["processo-id", id_processo_seletivo] });
    },
  });

  const { mutateAsync: editarPerguntaFn } = useMutation({
    mutationFn: editarPergunta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["perguntas-processos", id_processo_seletivo] });
      queryClient.invalidateQueries({ queryKey: ["processo-id", id_processo_seletivo] });
    },
  });

  const titleText = useMemo(() => (isEdit ? "Editar pergunta" : "Nova pergunta"), [isEdit]);
  const submitText = useMemo(() => (isEdit ? "Salvar alterações" : "Cadastrar pergunta"), [isEdit]);

  const showPontuacaoPorNivel = tipo === "BOOLEAN";
  const showExperiencia = tipo === "EXPERIENCIA_DIAS";

  const tipoAtual = TIPOS_CONFIG.find((t) => t.value === tipo);

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
        label_comprovante: data.exige_comprovante ? (data.label_comprovante ?? null) : null,
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
        await editarPerguntaFn({ id_pergunta: perguntaToEdit.id_pergunta, payload });
        toast.success("Pergunta atualizada com sucesso!");
        handleClose();
        return;
      }

      await criarPerguntaFn({ id_processo_seletivo, payload });
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
            <div>
              <Title>{titleText}</Title>
              {tipoAtual && (
                <Subtitle>{tipoAtual.label} — {tipoAtual.desc}</Subtitle>
              )}
            </div>
            <button type="button" onClick={handleClose} aria-label="Fechar">
              <X size={16} />
            </button>
          </HeaderContent>

          <FormStyles onSubmit={handleSubmit(onSubmit)}>

            {/* ── 1. Identificação ── */}
            <Section>
              <SectionTitle>Identificação</SectionTitle>
              <InputBase
                label="Título da pergunta"
                placeholder="Ex: Qual é o seu tempo de experiência na área?"
                {...register("titulo")}
                error={errors.titulo?.message}
              />
              <TextAreaBase
                label="Descrição (opcional)"
                placeholder="Ex: Informe o total de dias de experiência comprovável."
                {...register("descricao")}
              />
            </Section>

            {/* ── 2. Tipo de resposta ── */}
            <Section>
              <SectionTitle>Tipo de resposta</SectionTitle>
              <Controller
                control={control}
                name="tipo"
                render={({ field }) => (
                  <TypeGrid>
                    {TIPOS_CONFIG.map((t) => (
                      <TypeCard
                        key={t.value}
                        type="button"
                        $active={field.value === t.value}
                        onClick={() => field.onChange(t.value)}
                      >
                        <TypeCardName $active={field.value === t.value}>
                          {t.label}
                        </TypeCardName>
                        <TypeCardDesc>{t.desc}</TypeCardDesc>
                      </TypeCard>
                    ))}
                  </TypeGrid>
                )}
              />
            </Section>

            {/* ── 3. Configurações ── */}
            <Section>
              <SectionTitle>Configurações</SectionTitle>
              <Row>
                <InputBase
                  label="Ordem de exibição"
                  type="number"
                  placeholder="0"
                  {...register("ordem", { valueAsNumber: true })}
                  error={errors.ordem?.message}
                />
                <Controller
                  control={control}
                  name="obrigatoria"
                  render={({ field }) => (
                    <SelectBase
                      label="Obrigatória?"
                      value={field.value ? "true" : "false"}
                      onChange={(e) => field.onChange(e.target.value === "true")}
                    >
                      <option value="false">Não</option>
                      <option value="true">Sim</option>
                    </SelectBase>
                  )}
                />
                <Controller
                  control={control}
                  name="ativa"
                  render={({ field }) => (
                    <SelectBase
                      label="Ativa?"
                      value={field.value ? "true" : "false"}
                      onChange={(e) => field.onChange(e.target.value === "true")}
                    >
                      <option value="true">Sim</option>
                      <option value="false">Não</option>
                    </SelectBase>
                  )}
                />
              </Row>
            </Section>

            {/* ── 4. Comprovante ── */}
            <Section>
              <SectionTitle>Documento comprobatório</SectionTitle>
              <Row>
                <Controller
                  control={control}
                  name="exige_comprovante"
                  render={({ field }) => (
                    <SelectBase
                      label="Exige comprovante?"
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
                      const documentoOptions = tiposDocumento.map((d) => ({
                        value: d.nome,
                        label: d.nome,
                        description: d.descricao ?? undefined,
                      }));
                      const selected = documentoOptions.find((o) => o.value === (field.value ?? "")) ?? null;
                      return (
                        <InputSelectFilter
                          id="label_comprovante"
                          label="Qual documento?"
                          placeholder="Digite para buscar..."
                          options={documentoOptions}
                          value={selected?.value ?? null}
                          onChange={(val) => field.onChange(val ?? null)}
                          clearable
                          loading={isLoadingTipos}
                          error={errors.label_comprovante?.message as any}
                          helperText="Digite para filtrar e selecione um documento."
                          showCount
                        />
                      );
                    }}
                  />
                ) : (
                  <div />
                )}
              </Row>

              {exigeComprovante && (
                <InfoNote>
                  <Info size={14} />
                  <span>
                    O candidato só poderá finalizar a inscrição se enviar o documento selecionado.
                  </span>
                </InfoNote>
              )}
            </Section>

            {/* ── 5. Pontuação por nível (BOOLEAN) ── */}
            {showPontuacaoPorNivel && (
              <Section>
                <SectionTitle>Pontuação por nível de escolaridade</SectionTitle>
                <Row className="row-3">
                  <InputBase
                    label="Fundamental"
                    type="number"
                    placeholder="Ex: 0"
                    {...register("pontuacao_fundamental", { valueAsNumber: true })}
                    error={errors.pontuacao_fundamental?.message}
                  />
                  <InputBase
                    label="Médio"
                    type="number"
                    placeholder="Ex: 5"
                    {...register("pontuacao_medio", { valueAsNumber: true })}
                    error={errors.pontuacao_medio?.message}
                  />
                  <InputBase
                    label="Superior"
                    type="number"
                    placeholder="Ex: 10"
                    {...register("pontuacao_superior", { valueAsNumber: true })}
                    error={errors.pontuacao_superior?.message}
                  />
                </Row>
                <InfoNote>
                  <Info size={14} />
                  <span>
                    A pontuação é aplicada quando o candidato responde <strong>Sim</strong>. Para perguntas de seleção (SELECT/MULTISELECT), a pontuação deve ser configurada nas opções.
                  </span>
                </InfoNote>
              </Section>
            )}

            {/* ── 6. Faixas de experiência (EXPERIENCIA_DIAS) ── */}
            {showExperiencia && (
              <Section>
                <SectionTitle>Faixas de pontuação por experiência</SectionTitle>

                <InfoNote>
                  <Info size={14} />
                  <span>
                    Defina quantos pontos o candidato ganha por faixa de experiência.
                    Candidatos com <strong>menos de 365 dias</strong> não pontuam nesta pergunta.
                    Configure separadamente para nível <strong>Médio</strong> e <strong>Superior</strong>.
                  </span>
                </InfoNote>

                <FaixasTable>
                  <FaixasHeader>
                    <div>Faixa de experiência</div>
                    <div>Médio</div>
                    <div>Superior</div>
                  </FaixasHeader>

                  {[0, 1, 2, 3, 4].map((idx) => (
                    <FaixaRow key={idx}>
                      <FaixaLabel>
                        <FaixaLabelMain>{FAIXA_LABELS[idx].main}</FaixaLabelMain>
                        <FaixaLabelSub>{FAIXA_LABELS[idx].sub}</FaixaLabelSub>
                      </FaixaLabel>

                      <FaixaInput
                        type="number"
                        min={0}
                        placeholder="0"
                        {...register(`faixas.${idx}.medio` as const, {
                          setValueAs: (v) =>
                            v === "" || v === null || v === undefined ? null : Number(v),
                        })}
                      />

                      <FaixaInput
                        type="number"
                        min={0}
                        placeholder="0"
                        {...register(`faixas.${idx}.superior` as const, {
                          setValueAs: (v) =>
                            v === "" || v === null || v === undefined ? null : Number(v),
                        })}
                      />
                    </FaixaRow>
                  ))}
                </FaixasTable>

                {(errors.faixas as any)?.message && (
                  <p style={{ fontSize: 12, color: "var(--danger, #DC2626)", marginTop: 4 }}>
                    {(errors.faixas as any).message}
                  </p>
                )}
              </Section>
            )}

            <Footer>
              <button type="button" className="secondary" onClick={handleClose}>
                Cancelar
              </button>
              <button
                type="submit"
                className="primary"
                disabled={isSubmitting || !isValid}
                title={!isValid ? "Preencha os campos corretamente" : undefined}
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
