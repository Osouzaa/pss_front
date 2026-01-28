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

export type OpcaoPergunta = {
  id_opcao: string;
  label: string;
  valor: string;
  ordem: number;
  ativa: boolean;
  data_criacao?: string;
  data_atualizacao?: string;
};

/** ========= Zod (simples e direto) ========= */
import * as z from "zod";
import { buscarOpcoesPerguntas } from "../../../../api/buscar-opcoes-perguntas";
import {
  criarOpcaoPergunta,
  type OpcaoFormData,
} from "../../../../api/criar-opcoes-perguntas";
import { atualizarOpcaoPergunta } from "../../../../api/atualizar-opcoes-perguntas copy";
import { excluirOpcaoPergunta } from "../../../../api/deletar-opcoes-pergunta";
const opcaoSchema = z.object({
  label: z.string().min(1, "Informe o label"),
  valor: z.string().min(1, "Informe o valor"),
  ordem: z
    .number({ invalid_type_error: "Informe um número válido" })
    .int("A ordem deve ser um número inteiro")
    .min(0, "A ordem deve ser >= 0"),
  ativa: z.boolean(),
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

  const opcoes = opcoesQuery.data ?? [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<OpcaoFormData>({
    resolver: zodResolver(opcaoSchema) as unknown as Resolver<OpcaoFormData>,
    mode: "onChange",
    defaultValues: {
      label: "",
      valor: "",
      ordem: 0,
      ativa: true,
    },
  });

  const isEdit = !!editing?.id_opcao;

  useEffect(() => {
    if (!open) {
      setEditing(null);
      reset({
        label: "",
        valor: "",
        ordem: 0,
        ativa: true,
      });
      return;
    }

    if (editing) {
      reset({
        label: editing.label,
        valor: editing.valor,
        ordem: editing.ordem,
        ativa: editing.ativa,
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
    });
  }

  function invalidateAll() {
    queryClient.invalidateQueries({ queryKey: optionsQueryKey });

    // se você quiser, invalida também a lista de perguntas/processo
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

  const onSubmit: SubmitHandler<OpcaoFormData> = async (data) => {
    try {
      const payload = {
        label: data.label.trim(),
        valor: data.valor.trim(),
        ordem: data.ordem,
        ativa: data.ativa,
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
                  placeholder="Ex: Ensino superior completo"
                  {...register("label")}
                  error={errors.label?.message}
                />

                <InputBase
                  label="Valor"
                  placeholder="Ex: SUPERIOR_COMPLETO"
                  {...register("valor")}
                  error={errors.valor?.message}
                />

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
