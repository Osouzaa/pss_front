import * as z from "zod";

export const ProcessoStatusEnum = z.enum([
  "RASCUNHO",
  "ABERTO",
  "EM_ANALISE",
  "ENCERRADO",
]);

export const createNovoProcessoSchema = z
  .object({
    titulo: z
      .string()
      .min(3, "O título deve ter no mínimo 3 caracteres")
      .max(140, "O título deve ter no máximo 140 caracteres"),
    secretaria: z
      .string()
      .min(3, "O secretaria deve ter no mínimo 3 caracteres")
      .max(140, "O secretaria deve ter no máximo 140 caracteres"),

    ano: z
      .number({
        required_error: "O ano é obrigatório",
        invalid_type_error: "Informe um ano válido",
      })
      .int("O ano deve ser um número inteiro")
      .min(2000, "Ano inválido")
      .max(2100, "Ano inválido"),

    status: ProcessoStatusEnum,

    data_inicio_inscricoes: z
      .string()
      .optional()
      .refine(
        (value) => !value || !isNaN(Date.parse(value)),
        "Data de início inválida"
      ),

    data_fim_inscricoes: z
      .string()
      .optional()
      .refine(
        (value) => !value || !isNaN(Date.parse(value)),
        "Data de fim inválida"
      ),
  })
  .refine(
    (data) => {
      if (!data.data_inicio_inscricoes || !data.data_fim_inscricoes) return true;
      return (
        new Date(data.data_inicio_inscricoes) <=
        new Date(data.data_fim_inscricoes)
      );
    },
    {
      message: "A data de início deve ser anterior à data de fim",
      path: ["data_fim_inscricoes"],
    }
  );

export type CreateNovoProcessoFormData = z.infer<
  typeof createNovoProcessoSchema
>;
