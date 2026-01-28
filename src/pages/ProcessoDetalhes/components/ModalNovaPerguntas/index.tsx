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
import { useForm, type Resolver, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createNovaPerguntaSchema,
  type CreateNovaPerguntaFormData,
} from "../../../../schemas/create-nova-pergunta";

import { criarPergunta } from "../../../../api/criar-pergunta";
import { editarPergunta } from "../../../../api/editar-pergunta";

type PerguntaTipo =
  | "BOOLEAN"
  | "NUMERO"
  | "TEXTO"
  | "SELECT"
  | "MULTISELECT"
  | "DATA";

type PerguntaToEdit = {
  id_pergunta: string;
  titulo: string;
  descricao?: string | null;
  tipo: PerguntaTipo;
  obrigatoria: boolean;
  ordem: number;
  ativa: boolean;

  // ✅ pontuação (apenas pra casos simples, ex: BOOLEAN)
  pontuacao_fundamental?: number | null;
  pontuacao_medio?: number | null;
  pontuacao_superior?: number | null;
  pontuacao_maxima?: number | null;

  // ✅ comprovante/anexo (novos nomes)
  exige_comprovante?: boolean | null;
  label_comprovante?: string | null;
};

interface IModalNovaPergunta {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id_processo_seletivo: string;
  perguntaToEdit?: PerguntaToEdit | null;
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

      // ✅ novos campos
      exige_comprovante: false,
      label_comprovante: "",
    },
  });

  const tipo = watch("tipo");
  const exigeComprovante = watch("exige_comprovante");

  useEffect(() => {
    if (!open) return;

    if (perguntaToEdit) {
      reset({
        titulo: perguntaToEdit.titulo ?? "",
        descricao: perguntaToEdit.descricao ?? "",
        tipo: perguntaToEdit.tipo ?? "BOOLEAN",
        obrigatoria: !!perguntaToEdit.obrigatoria,
        ordem: Number(perguntaToEdit.ordem ?? 0),
        ativa: !!perguntaToEdit.ativa,

        pontuacao_fundamental: perguntaToEdit.pontuacao_fundamental ?? null,
        pontuacao_medio: perguntaToEdit.pontuacao_medio ?? null,
        pontuacao_superior: perguntaToEdit.pontuacao_superior ?? null,

        // ✅ novos campos
        exige_comprovante: !!perguntaToEdit.exige_comprovante,
        label_comprovante: perguntaToEdit.label_comprovante ?? "",
      });
      return;
    }

    // modo criar
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

      // ✅ novos campos
      exige_comprovante: false,
      label_comprovante: "",
    });
  }, [open, perguntaToEdit, reset]);

  // ✅ limpa campos de pontuação se não for BOOLEAN (evita enviar lixo)
  useEffect(() => {
    if (!open) return;

    if (tipo !== "BOOLEAN") {
      setValue("pontuacao_fundamental", null, { shouldValidate: true });
      setValue("pontuacao_medio", null, { shouldValidate: true });
      setValue("pontuacao_superior", null, { shouldValidate: true });
    }
  }, [tipo, open, setValue]);

  // ✅ se desmarcar comprovante, limpa label
  useEffect(() => {
    if (!open) return;

    if (!exigeComprovante) {
      setValue("label_comprovante", "", { shouldValidate: true });
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

  const onSubmit: SubmitHandler<CreateNovaPerguntaFormData> = async (data) => {
    try {
      const payload = {
        titulo: data.titulo,
        descricao: data.descricao ? data.descricao : null,
        tipo: data.tipo,
        obrigatoria: data.obrigatoria,
        ordem: data.ordem,
        ativa: data.ativa,

        // pontuação (somente p/ boolean no backend, mas pode enviar)
        pontuacao_fundamental: data.pontuacao_fundamental ?? null,
        pontuacao_medio: data.pontuacao_medio ?? null,
        pontuacao_superior: data.pontuacao_superior ?? null,

        // ✅ comprovante/anexo (novos nomes)
        exige_comprovante: data.exige_comprovante,
        label_comprovante: data.exige_comprovante
          ? data.label_comprovante?.trim() || null
          : null,
      };

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

  const showPontuacaoPorNivel = tipo === "BOOLEAN";

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
              placeholder="Ex: Possui ensino superior?"
              {...register("titulo")}
              error={errors.titulo?.message}
            />

            <TextAreaBase
              label="Descrição (opcional)"
              placeholder="Ex: Marque SIM se você concluiu o ensino superior."
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
                <option value="MULTISELECT">
                  Múltipla Escolha (MULTISELECT)
                </option>
                <option value="DATA">Data (DATA)</option>
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
                    {...register("pontuacao_superior", {
                      valueAsNumber: true,
                    })}
                    error={errors.pontuacao_superior?.message}
                  />
                </Row>

                <p style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>
                  Para perguntas SELECT/MULTISELECT, a pontuação deve ficar nas
                  opções.
                </p>
              </>
            ) : null}

            {/* ✅ Comprovante / Anexo */}
            <Row>
              <SelectBase
                label="Exige comprovante?"
                {...register("exige_comprovante", {
                  setValueAs: (v) => v === true || v === "true",
                })}
              >
                <option value="false">Não</option>
                <option value="true">Sim</option>
              </SelectBase>

              {exigeComprovante ? (
                <>
                  <InputBase
                    label="Texto do comprovante"
                    placeholder="Ex: Anexar certificado / carteira de trabalho"
                    {...register("label_comprovante")}
                    error={errors.label_comprovante?.message}
                  />

                  <p style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>
                    Dica: use PDF e imagens (JPG/PNG). O backend deve validar
                    isso no envio da inscrição.
                  </p>
                </>
              ) : null}
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
