import z from "zod";

export const createNovaVagaSchema = z.object({
  nome: z
    .string()
    .min(3, "Informe o nome da vaga")
    .max(160, "Nome da vaga muito longo"),

  nivel: z.enum(["MEDIO", "SUPERIOR"], {
    errorMap: () => ({ message: "Selecione o nível da vaga" }),
  }),

  quantidade_de_vagas: z
    .number({
      required_error: "Informe a quantidade de vagas",
      invalid_type_error: "Quantidade inválida",
    })
    .int("A quantidade deve ser um número inteiro")
    .min(1, "Deve haver ao menos 1 vaga"),
});

export type CreateNovaVagaFormData = z.infer<typeof createNovaVagaSchema>;
