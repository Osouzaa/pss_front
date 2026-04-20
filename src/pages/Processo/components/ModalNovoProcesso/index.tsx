// ModalNovoProcesso/index.tsx
import * as Dialog from "@radix-ui/react-dialog";
import {
  Content,
  FormStyles,
  HeaderContent,
  Overlay,
  Row,
  Footer,
  Title,
  ToggleRow,
  ToggleLabel,
  ToggleName,
  ToggleHint,
  Switch,
} from "./styles";
import { X } from "lucide-react";
import { InputBase } from "../../../../components/InputBase";
import { SelectBase } from "../../../../components/SelectBase";

import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
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
import { creatProcessoError } from "../../../../errs/create-processo.erro copy";
import { editProcessoError } from "../../../../errs/edit-processo.error";
import { SECRETARIAS } from "../../../../utils/secreatias.map.utils";
import { useAuth } from "../../../../contexts/auth-context";

interface IModalNovoProcesso {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  processoToEdit?: ProcessoSeletivoResponse | null;
}

function isoToInputDate(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";

  // ✅ usa horário LOCAL, não UTC
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function ModalNovoProcesso({
  open,
  onOpenChange,
  processoToEdit,
}: IModalNovoProcesso) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const isEdit = !!processoToEdit?.id_processo_seletivo;

  // ✅ REGRA NOVA:
  // - se user.secretaria === "All" -> pode ver/selecionar todas
  // - se não -> só a secretaria registrada e travado
  const canPickSecretaria = user?.secretaria_usuario === "all";

  // ✅ Evita "All" aparecer como opção de secretaria
  const secretariasList = useMemo(
    () => SECRETARIAS.filter((s) => s !== "all"),
    [],
  );

  const secretariasOptions = useMemo(() => {
    if (canPickSecretaria) return secretariasList;
    if (user?.secretaria_usuario && user.secretaria_usuario !== "all")
      return [user.secretaria_usuario];
    return [];
  }, [canPickSecretaria, secretariasList, user?.secretaria_usuario]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CreateNovoProcessoFormData>({
    resolver: zodResolver(createNovoProcessoSchema),
    mode: "onChange",
    defaultValues: {
      titulo: "",
      secretaria: canPickSecretaria ? "" : (user?.secretaria_usuario ?? ""),
      ano: new Date().getFullYear(),
      status: "ABERTO",
      data_inicio_inscricoes: "",
      data_fim_inscricoes: "",
      usa_classificacao: true,
    },
  });

  const usaClassificacao = useWatch({ control, name: "usa_classificacao" }) ?? true;

  useEffect(() => {
    if (!open) return;

    if (processoToEdit) {
      reset({
        titulo: processoToEdit.titulo ?? "",
        secretaria: canPickSecretaria
          ? (processoToEdit.secretaria ?? "")
          : (user?.secretaria_usuario ?? processoToEdit.secretaria ?? ""),
        ano: processoToEdit.ano ?? new Date().getFullYear(),
        status: (processoToEdit.status ?? "ABERTO") as any,
        data_inicio_inscricoes: isoToInputDate(
          processoToEdit.data_inicio_inscricoes,
        ),
        data_fim_inscricoes: isoToInputDate(processoToEdit.data_fim_inscricoes),
        usa_classificacao: processoToEdit.usa_classificacao ?? true,
      });
      return;
    }

    reset({
      titulo: "",
      secretaria: canPickSecretaria ? "" : (user?.secretaria_usuario ?? ""),
      ano: new Date().getFullYear(),
      status: "ABERTO",
      data_inicio_inscricoes: "",
      data_fim_inscricoes: "",
      usa_classificacao: true,
    });
  }, [
    open,
    processoToEdit,
    reset,
    canPickSecretaria,
    user?.secretaria_usuario,
  ]);

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
      // ✅ força secretaria do user se não for "All"
      const secretariaFinal = canPickSecretaria
        ? data.secretaria
        : (user?.secretaria_usuario ?? data.secretaria);

      // converte datetime-local (sem fuso) para ISO UTC, preservando o horário local
      const toISO = (v?: string) =>
        v ? new Date(v).toISOString() : undefined;

      if (isEdit && processoToEdit?.id_processo_seletivo) {
        await editarProcessoFn({
          id_processo_seletivo: processoToEdit.id_processo_seletivo,
          payload: {
            titulo: data.titulo,
            secretaria: secretariaFinal,
            ano: data.ano,
            status: data.status,
            data_inicio_inscricoes: toISO(data.data_inicio_inscricoes),
            data_fim_inscricoes: toISO(data.data_fim_inscricoes),
            usa_classificacao: data.usa_classificacao,
          },
        });

        toast.success("Processo atualizado com sucesso!");
        handleClose();
        return;
      }

      await criarNovoProcessoFn({
        titulo: data.titulo,
        secretaria: secretariaFinal,
        ano: data.ano,
        status: data.status,
        data_inicio_inscricoes: toISO(data.data_inicio_inscricoes),
        data_fim_inscricoes: toISO(data.data_fim_inscricoes),
        usa_classificacao: data.usa_classificacao,
      });

      toast.success("Processo criado com sucesso!");
      handleClose();
    } catch (error) {
      if (isEdit) {
        const msg =
          typeof editProcessoError === "function"
            ? editProcessoError(error)
            : creatProcessoError(error);

        toast.error(msg);
        return;
      }

      toast.error(creatProcessoError(error));
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

            <SelectBase
              {...register("secretaria")}
              label="Secretaria"
              disabled={!canPickSecretaria}
              error={errors.secretaria?.message}
            >
              {canPickSecretaria && <option value="">Selecione</option>}

              {secretariasOptions.map((nome) => (
                <option key={nome} value={nome}>
                  {nome}
                </option>
              ))}
            </SelectBase>

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
                <option value="PRORROGADO">Prorrogado</option> {/* 👈 novo */}
                <option value="ENCERRADO">Encerrado</option>
              </SelectBase>
            </Row>

            <Row>
              <InputBase
                label="Início das inscrições"
                type="datetime-local"
                {...register("data_inicio_inscricoes")}
                error={errors.data_inicio_inscricoes?.message}
              />

              <InputBase
                label="Fim das inscrições"
                type="datetime-local"
                {...register("data_fim_inscricoes")}
                error={errors.data_fim_inscricoes?.message}
              />
            </Row>

            <ToggleRow>
              <ToggleLabel>
                <ToggleName>Usar classificação</ToggleName>
                <ToggleHint>
                  Quando ativo, candidatos são ranqueados com base em pontuação
                </ToggleHint>
              </ToggleLabel>
              <Switch
                type="button"
                $on={usaClassificacao}
                onClick={() => setValue("usa_classificacao", !usaClassificacao)}
                aria-pressed={usaClassificacao}
                aria-label="Alternar uso de classificação"
              />
            </ToggleRow>

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
