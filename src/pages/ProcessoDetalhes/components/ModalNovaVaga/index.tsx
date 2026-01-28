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
  createNovaVagaSchema,
  type CreateNovaVagaFormData,
} from "../../../../schemas/create-nova-vaga";
import { editarVaga } from "../../../../api/editar-vaga";
import { criarNovaVaga } from "../../../../api/criar-nova.vaga";

type VagaToEdit = {
  id_vaga: string;
  nome: string;
  nivel: "MEDIO" | "SUPERIOR";
  quantidade_de_vagas: number | string;
};

interface IModalNovaVaga {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id_processo_seletivo: string;

  /** se vier, modal vira edição */
  vagaToEdit?: VagaToEdit | null;
}

export function ModalNovaVaga({
  open,
  onOpenChange,
  id_processo_seletivo,
  vagaToEdit,
}: IModalNovaVaga) {
  const queryClient = useQueryClient();

  const isEdit = !!vagaToEdit?.id_vaga;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CreateNovaVagaFormData>({
    resolver: zodResolver(createNovaVagaSchema),
    mode: "onChange",
    defaultValues: {
      nome: "",
      nivel: "MEDIO",
      quantidade_de_vagas: 1,
    },
  });

  // Preenche o form quando abrir para editar
  useEffect(() => {
    if (!open) return;

    if (vagaToEdit) {
      reset({
        nome: vagaToEdit.nome ?? "",
        nivel: (vagaToEdit.nivel ?? "MEDIO") as "MEDIO" | "SUPERIOR",
        quantidade_de_vagas: Number(vagaToEdit.quantidade_de_vagas ?? 1),
      });
      return;
    }

    // modo criar
    reset({
      nome: "",
      nivel: "MEDIO",
      quantidade_de_vagas: 1,
    });
  }, [open, vagaToEdit, reset]);

  function handleClose() {
    onOpenChange(false);
  }

  const { mutateAsync: criarNovaVagaFn } = useMutation({
    mutationFn: criarNovaVaga,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["processo-id", id_processo_seletivo],
      });
    },
  });

  const { mutateAsync: editarVagaFn } = useMutation({
    mutationFn: editarVaga,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["processo-id", id_processo_seletivo],
      });
    },
  });

  const titleText = useMemo(
    () => (isEdit ? "Editar vaga" : "Cadastrar nova vaga"),
    [isEdit],
  );

  const submitText = useMemo(
    () => (isEdit ? "Salvar alterações" : "Cadastrar vaga"),
    [isEdit],
  );

  const onSubmit = async (data: CreateNovaVagaFormData) => {
    try {
      if (isEdit && vagaToEdit?.id_vaga) {
        await editarVagaFn({
          id_vaga: vagaToEdit.id_vaga,
          payload: {
            nome: data.nome,
            nivel: data.nivel,
            quantidade_de_vagas: data.quantidade_de_vagas,
          },
        });

        toast.success("Vaga atualizada com sucesso!");
        handleClose();
        return;
      }

      await criarNovaVagaFn({
        id_processo_seletivo,
        nome: data.nome,
        nivel: data.nivel,
        quantidade_de_vagas: data.quantidade_de_vagas,
      });

      toast.success("Vaga cadastrada com sucesso!");
      handleClose();
    } catch (e: any) {
      toast.error(e?.message ?? "Não foi possível salvar a vaga");
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
              label="Nome da vaga"
              placeholder="Ex: Secretário Escolar"
              {...register("nome")}
              error={errors.nome?.message}
            />

            <Row>
              <SelectBase
                label="Nível"
                {...register("nivel")}
                error={errors.nivel?.message}
              >
                <option value="">Selecione</option>
                <option value="MEDIO">Nível Médio</option>
                <option value="SUPERIOR">Nível Superior</option>
              </SelectBase>

              <InputBase
                label="Quantidade de vagas"
                type="number"
                placeholder="1"
                {...register("quantidade_de_vagas", { valueAsNumber: true })}
                error={errors.quantidade_de_vagas?.message}
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
