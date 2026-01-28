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

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createNovoProcessoSchema,
  type CreateNovoProcessoFormData,
} from "../../../../schemas/create-novo-processo";

import { criarNovoProcesso } from "../../../../api/criar-novo-processo";
import { editarProcesso } from "../../../../api/editar-processo";
import type { ProcessoSeletivoResponse } from "../../../../api/get-processo-id";

interface IModalNovoProcesso {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  processoToEdit?: ProcessoSeletivoResponse | null;
}

function isoToInputDate(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  // YYYY-MM-DD (input type="date")
  return d.toISOString().slice(0, 10);
}

export function ModalNovoProcesso({
  open,
  onOpenChange,
  processoToEdit,
}: IModalNovoProcesso) {
  const queryClient = useQueryClient();

  const isEdit = !!processoToEdit?.id_processo_seletivo;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CreateNovoProcessoFormData>({
    resolver: zodResolver(createNovoProcessoSchema),
    mode: "onChange",
    defaultValues: {
      titulo: "",
      secretaria: "",
      ano: new Date().getFullYear(),
      status: "ABERTO",
      data_inicio_inscricoes: "",
      data_fim_inscricoes: "",
    },
  });

  useEffect(() => {
    if (!open) return;

    if (processoToEdit) {
      reset({
        titulo: processoToEdit.titulo ?? "",
        secretaria: processoToEdit.secretaria ?? "",
        ano: processoToEdit.ano ?? new Date().getFullYear(),
        status: (processoToEdit.status ?? "ABERTO") as any,
        data_inicio_inscricoes: isoToInputDate(
          processoToEdit.data_inicio_inscricoes,
        ),
        data_fim_inscricoes: isoToInputDate(processoToEdit.data_fim_inscricoes),
      });
      return;
    }

    reset({
      titulo: "",
      secretaria: "",
      ano: new Date().getFullYear(),
      status: "ABERTO",
      data_inicio_inscricoes: "",
      data_fim_inscricoes: "",
    });
  }, [open, processoToEdit, reset]);

  function handleClose() {
    onOpenChange(false);
  }

  const titleText = useMemo(
    () => (isEdit ? "Editar processo" : "Criar novo processo"),
    [isEdit],
  );

  const submitText = useMemo(
    () => (isEdit ? "Salvar alterações" : "Criar processo"),
    [isEdit],
  );

  const { mutateAsync: criarNovoProcessoFn } = useMutation({
    mutationFn: criarNovoProcesso,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-processos"] });
    },
  });

  const { mutateAsync: editarProcessoFn } = useMutation({
    mutationFn: editarProcesso,
    onSuccess: () => {
      if (processoToEdit?.id_processo_seletivo) {
        queryClient.invalidateQueries({
          queryKey: ["processo-id", processoToEdit.id_processo_seletivo],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["all-processos"] });
    },
  });

  const onSubmit = async (data: CreateNovoProcessoFormData) => {
    try {
      if (isEdit && processoToEdit?.id_processo_seletivo) {
        await editarProcessoFn({
          id_processo_seletivo: processoToEdit.id_processo_seletivo,
          payload: {
            titulo: data.titulo,
            secretaria: data.secretaria,
            ano: data.ano,
            status: data.status,
            data_inicio_inscricoes: data.data_inicio_inscricoes,
            data_fim_inscricoes: data.data_fim_inscricoes,
          },
        });

        toast.success("Processo atualizado com sucesso!");
        handleClose();
        return;
      }

      await criarNovoProcessoFn({
        titulo: data.titulo,
        secretaria: data.secretaria,
        ano: data.ano,
        status: data.status,
        data_inicio_inscricoes: data.data_inicio_inscricoes,
        data_fim_inscricoes: data.data_fim_inscricoes,
      });

      toast.success("Processo criado com sucesso!");
      handleClose();
    } catch (e: any) {
      toast.error(e?.message ?? "Não foi possível salvar o processo");
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
              label="Título do processo seletivo"
              placeholder="Ex: PSS Educação 2026"
              {...register("titulo")}
              error={errors.titulo?.message}
            />

            <InputBase
              label="Secretaria"
              placeholder="Ex: Secretaria de Educação"
              {...register("secretaria")}
              error={errors.secretaria?.message}
            />

            <Row>
              <InputBase
                label="Ano"
                type="number"
                placeholder="2026"
                {...register("ano", { valueAsNumber: true })}
                error={errors.ano?.message}
              />

              <SelectBase
                label="Status"
                {...register("status")}
                error={errors.status?.message}
              >
                <option value="">Selecione</option>
                <option value="RASCUNHO">Rascunho</option>
                <option value="ABERTO">Aberto</option>
                <option value="ENCERRADO">Encerrado</option>
              </SelectBase>
            </Row>

            <Row>
              <InputBase
                label="Início das inscrições"
                type="date"
                {...register("data_inicio_inscricoes")}
                error={errors.data_inicio_inscricoes?.message}
              />

              <InputBase
                label="Fim das inscrições"
                type="date"
                {...register("data_fim_inscricoes")}
                error={errors.data_fim_inscricoes?.message}
              />
            </Row>

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
                disabled={isSubmitting}
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
