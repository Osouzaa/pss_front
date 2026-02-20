import * as Dialog from "@radix-ui/react-dialog";
import { X, Pencil, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm, type Resolver, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Content,
  HeaderContent,
  Overlay,
  Title,
  Body,
  LeftCol,
  RightCol,
  Divider,
  FormStyles,
  Row,
  Footer,
  OptionsHeader,
  OptionsTable,
  OptionRow,
  EmptyState,
  Badge,
  ActionButton,
} from "./styles";

import { InputBase } from "../../../../components/InputBase";
import { SelectBase } from "../../../../components/SelectBase";

/** ========= API ========= */
import { buscarOpcoesPerguntas } from "../../../../api/buscar-opcoes-perguntas";
import {
  criarOpcaoPergunta,
  type OpcaoFormData,
} from "../../../../api/criar-opcoes-perguntas";
import { atualizarOpcaoPergunta } from "../../../../api/atualizar-opcoes-perguntas copy";
import { excluirOpcaoPergunta } from "../../../../api/deletar-opcoes-pergunta";

/** ========= Types ========= */
export type OpcaoPergunta = {
  id_opcao: string;
  label: string;
  valor: string;
  ordem: number;
  ativa: boolean;

  // ✅ NOVOS
  valor_fundamental?: number | null;
  valor_medio?: number | null;
  valor_superior?: number | null;

  data_criacao?: string;
  data_atualizacao?: string;
};

// ✅ garante tipagem local mesmo que o type do api ainda não tenha sido atualizado
type OpcaoFormDataExt = OpcaoFormData & {
  valor_fundamental?: number | null;
  valor_medio?: number | null;
  valor_superior?: number | null;

  // ✅ vamos manter no form, mas ele será automatizado
  valor?: string;
};

/** ========= Helpers ========= */
function makeValueFromLabel(label: string) {
  const base = (label ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/[^a-z0-9]+/g, "_") // tudo que não for [a-z0-9] vira _
    .replace(/^_+|_+$/g, "") // remove _ no começo/fim
    .replace(/_+/g, "_"); // colapsa ____

  return base;
}

import * as z from "zod";

const opcaoSchema = z.object({
  label: z
    .string()
    .min(1, "Informe o label")
    .max(200, "O label deve ter no máximo 200 caracteres"),

  // Mesmo sendo automático, vamos limitar a 60 caracteres
  valor: z
    .string()
    .max(60, "O valor gerado deve ter no máximo 60 caracteres")
    .optional(),

  ordem: z
    .number({ invalid_type_error: "Informe um número válido" })
    .int("A ordem deve ser um número inteiro")
    .min(0, "A ordem deve ser >= 0"),

  ativa: z.boolean(),

  valor_fundamental: z.number().min(0, ">= 0").nullable().optional(),
  valor_medio: z.number().min(0, ">= 0").nullable().optional(),
  valor_superior: z.number().min(0, ">= 0").nullable().optional(),
});

interface IModalOpcoesPergunta {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  id_pergunta: string;

  id_processo_seletivo?: string;
}

export function ModalOpcoes({
  open,
  onOpenChange,
  id_pergunta,
  id_processo_seletivo,
}: IModalOpcoesPergunta) {
  const queryClient = useQueryClient();

  const [editing, setEditing] = useState<OpcaoPergunta | null>(null);

  const optionsQueryKey = useMemo(
    () => ["pergunta-opcoes", id_pergunta],
    [id_pergunta],
  );

  const opcoesQuery = useQuery({
    queryKey: optionsQueryKey,
    queryFn: () => buscarOpcoesPerguntas(id_pergunta),
    enabled: !!id_pergunta && open,
  });

  const opcoes: OpcaoPergunta[] = (opcoesQuery.data ?? []) as any;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm<OpcaoFormDataExt>({
    resolver: zodResolver(opcaoSchema) as unknown as Resolver<OpcaoFormDataExt>,
    mode: "onChange",
    defaultValues: {
      label: "",
      valor: "", // será preenchido automaticamente
      ordem: 0,
      ativa: true,

      valor_fundamental: null,
      valor_medio: null,
      valor_superior: null,
    },
  });

  const isEdit = !!editing?.id_opcao;

  const labelValue = watch("label");
  const autoValor = useMemo(
    () => makeValueFromLabel(labelValue ?? ""),
    [labelValue],
  );

  // ✅ mantém o "valor" do form sempre sincronizado com o label
  useEffect(() => {
    if (!open) return;
    setValue("valor", autoValor, { shouldValidate: true, shouldDirty: true });
  }, [autoValor, open, setValue]);

  useEffect(() => {
    if (!open) {
      setEditing(null);
      reset({
        label: "",
        valor: "",
        ordem: 0,
        ativa: true,

        valor_fundamental: null,
        valor_medio: null,
        valor_superior: null,
      });
      return;
    }

    if (editing) {
      reset({
        label: editing.label,
        valor: makeValueFromLabel(editing.label),
        ordem: editing.ordem,
        ativa: editing.ativa,

        valor_fundamental: editing.valor_fundamental ?? null,
        valor_medio: editing.valor_medio ?? null,
        valor_superior: editing.valor_superior ?? null,
      });
    }
  }, [open, editing, reset]);

  function handleClose() {
    onOpenChange(false);
  }

  function clearForm() {
    setEditing(null);
    reset({
      label: "",
      valor: "",
      ordem: 0,
      ativa: true,

      valor_fundamental: null,
      valor_medio: null,
      valor_superior: null,
    });
  }

  function invalidateAll() {
    queryClient.invalidateQueries({ queryKey: optionsQueryKey });

    if (id_processo_seletivo) {
      queryClient.invalidateQueries({
        queryKey: ["perguntas-processo", id_processo_seletivo],
      });
      queryClient.invalidateQueries({
        queryKey: ["processo-id", id_processo_seletivo],
      });
    }
  }

  const criarMut = useMutation({
    mutationFn: criarOpcaoPergunta,
    onSuccess: () => invalidateAll(),
  });

  const editarMut = useMutation({
    mutationFn: atualizarOpcaoPergunta,
    onSuccess: () => invalidateAll(),
  });

  const excluirMut = useMutation({
    mutationFn: excluirOpcaoPergunta,
    onSuccess: () => invalidateAll(),
  });

  const titleText = useMemo(
    () => (isEdit ? "Editar opção" : "Cadastrar nova opção"),
    [isEdit],
  );

  const submitText = useMemo(
    () => (isEdit ? "Salvar opção" : "Adicionar opção"),
    [isEdit],
  );

  const onSubmit: SubmitHandler<OpcaoFormDataExt> = async (data) => {
    try {
      const valorGerado = makeValueFromLabel(data.label);

      // ✅ (opcional) valida duplicidade no front por pergunta
      const jaExiste = opcoes.some(
        (op) =>
          op.valor?.toLowerCase() === valorGerado.toLowerCase() &&
          (!isEdit || op.id_opcao !== editing?.id_opcao),
      );

      if (jaExiste) {
        toast.error(
          "Já existe uma opção com esse label (valor gerado repetido).",
        );
        return;
      }

      const payload: any = {
        label: data.label.trim(),
        valor: valorGerado, // ✅ SEMPRE automatizado
        ordem: data.ordem,
        ativa: data.ativa,

        valor_fundamental: data.valor_fundamental ?? null,
        valor_medio: data.valor_medio ?? null,
        valor_superior: data.valor_superior ?? null,
      };

      if (isEdit && editing?.id_opcao) {
        await editarMut.mutateAsync({
          id_opcao: editing.id_opcao,
          payload,
        });
        toast.success("Opção atualizada com sucesso!");
        clearForm();
        return;
      }

      await criarMut.mutateAsync({
        id_pergunta,
        payload,
      });

      toast.success("Opção adicionada com sucesso!");
      clearForm();
    } catch (e: any) {
      toast.error(e?.message ?? "Não foi possível salvar a opção");
    }
  };

  async function handleDelete(op: OpcaoPergunta) {
    try {
      await excluirMut.mutateAsync({ id_opcao: op.id_opcao });
      toast.success("Opção removida com sucesso!");
      if (editing?.id_opcao === op.id_opcao) clearForm();
    } catch (e: any) {
      toast.error(e?.message ?? "Não foi possível remover a opção");
    }
  }

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
              <Title>Gerenciar opções</Title>
              <span className="subtitle">{titleText}</span>
            </div>

            <button type="button" onClick={handleClose} aria-label="Fechar">
              <X size={16} />
            </button>
          </HeaderContent>

          <Body>
            {/* ===== Coluna ESQUERDA: Form ===== */}
            <LeftCol>
              <FormStyles onSubmit={handleSubmit(onSubmit)}>
                <InputBase
                  label="Label"
                  placeholder="Ex: 1 Especialização"
                  {...register("label")}
                  error={errors.label?.message}
                />

                {/* ✅ Valor automático (desabilitado) */}
                <InputBase
                  label="Valor (gerado automaticamente)"
                  placeholder="Ex: 1_especializacao"
                  value={autoValor}
                  disabled
                />

                {/* ✅ NOVOS CAMPOS */}
                <Row className="row-grid">
                  <InputBase
                    label="Valor (Fundamental)"
                    type="number"
                    placeholder="Ex: 0"
                    {...register("valor_fundamental", {
                      setValueAs: (v) =>
                        v === "" || v === null || v === undefined
                          ? null
                          : Number(v),
                    })}
                    error={(errors as any).valor_fundamental?.message}
                  />

                  <InputBase
                    label="Valor (Médio)"
                    type="number"
                    placeholder="Ex: 10"
                    {...register("valor_medio", {
                      setValueAs: (v) =>
                        v === "" || v === null || v === undefined
                          ? null
                          : Number(v),
                    })}
                    error={(errors as any).valor_medio?.message}
                  />

                  <InputBase
                    label="Valor (Superior)"
                    type="number"
                    placeholder="Ex: 15"
                    {...register("valor_superior", {
                      setValueAs: (v) =>
                        v === "" || v === null || v === undefined
                          ? null
                          : Number(v),
                    })}
                    error={(errors as any).valor_superior?.message}
                  />
                </Row>

                <Row>
                  <InputBase
                    label="Ordem"
                    type="number"
                    placeholder="0"
                    {...register("ordem", { valueAsNumber: true })}
                    error={errors.ordem?.message}
                  />

                  <SelectBase
                    label="Ativa?"
                    {...register("ativa", { setValueAs: (v) => v === "true" })}
                    error={errors.ativa?.message as any}
                  >
                    <option value="true">Sim</option>
                    <option value="false">Não</option>
                  </SelectBase>
                </Row>

                <Footer>
                  <button
                    type="button"
                    className="secondary"
                    onClick={clearForm}
                    disabled={isSubmitting}
                  >
                    Limpar
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
            </LeftCol>

            <Divider />

            {/* ===== Coluna DIREITA: Lista ===== */}
            <RightCol>
              <OptionsHeader>
                <strong>Opções cadastradas</strong>

                <div className="meta">
                  {opcoesQuery.isLoading ? (
                    <span>Carregando...</span>
                  ) : (
                    <span>{opcoes.length} item(ns)</span>
                  )}
                </div>
              </OptionsHeader>

              {opcoesQuery.isLoading ? (
                <EmptyState>Carregando opções...</EmptyState>
              ) : opcoes.length === 0 ? (
                <EmptyState>Nenhuma opção cadastrada ainda.</EmptyState>
              ) : (
                <OptionsTable>
                  <thead>
                    <tr>
                      <th>Label</th>
                      <th>Valor</th>

                      {/* ✅ NOVOS */}
                      <th className="small">Fund.</th>
                      <th className="small">Médio</th>
                      <th className="small">Sup.</th>

                      <th className="small">Ordem</th>
                      <th className="small">Status</th>
                      <th className="actions">Ações</th>
                    </tr>
                  </thead>

                  <tbody>
                    {opcoes
                      .slice()
                      .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0))
                      .map((op) => {
                        const isEditingRow = editing?.id_opcao === op.id_opcao;

                        return (
                          <OptionRow
                            key={op.id_opcao}
                            data-active={isEditingRow}
                          >
                            <td className="label">
                              <div className="main">{op.label}</div>
                            </td>

                            <td className="value">{op.valor}</td>

                            {/* ✅ NOVOS */}
                            <td className="small">
                              {op.valor_fundamental ?? "-"}
                            </td>
                            <td className="small">{op.valor_medio ?? "-"}</td>
                            <td className="small">
                              {op.valor_superior ?? "-"}
                            </td>

                            <td className="small">{op.ordem}</td>

                            <td className="small">
                              <Badge data-on={op.ativa}>
                                {op.ativa ? "Ativa" : "Inativa"}
                              </Badge>
                            </td>

                            <td className="actions">
                              <ActionButton
                                type="button"
                                onClick={() => setEditing(op)}
                                title="Editar"
                              >
                                <Pencil size={16} />
                              </ActionButton>

                              <ActionButton
                                type="button"
                                className="danger"
                                onClick={() => handleDelete(op)}
                                title="Excluir"
                              >
                                <Trash2 size={16} />
                              </ActionButton>
                            </td>
                          </OptionRow>
                        );
                      })}
                  </tbody>
                </OptionsTable>
              )}
            </RightCol>
          </Body>
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
