import * as z from "zod";

export const PerguntaTipoEnum = z.enum([
  "BOOLEAN",
  "NUMERO",
  "TEXTO",
  "SELECT",
  "MULTISELECT",
  "DATA",
]);

export const createNovaPerguntaSchema = z
  .object({
    titulo: z.string().min(3).max(220),
    descricao: z.string().max(800).optional().default(""),
    tipo: PerguntaTipoEnum,
    obrigatoria: z.boolean().default(false),
    ordem: z.coerce.number().int().min(0).default(0),
    ativa: z.boolean().default(true),

    pontuacao_fundamental: z.coerce.number().int().min(0).optional().nullable(),
    pontuacao_medio: z.coerce.number().int().min(0).optional().nullable(),
    pontuacao_superior: z.coerce.number().int().min(0).optional().nullable(),

    // ✅ nomes iguais ao backend
    exige_comprovante: z.boolean().default(false),
    label_comprovante: z.string().max(255).optional().default(""),
  })
  .superRefine((data, ctx) => {
    // REGRA 1: BOOLEAN precisa ter pelo menos uma pontuação por nível
    if (data.tipo === "BOOLEAN") {
      const temPontuacao =
        data.pontuacao_fundamental != null ||
        data.pontuacao_medio != null ||
        data.pontuacao_superior != null;

      if (!temPontuacao) {
        ctx.addIssue({
          path: ["pontuacao_medio"],
          message:
            "Informe ao menos uma pontuação por nível (fundamental, médio ou superior)",
          code: z.ZodIssueCode.custom,
        });
      }
    }

    // (opcional, recomendado) Se NÃO exige comprovante, não precisa label
    if (!data.exige_comprovante) {
      // você pode manter como "" sem erro, ou forçar limpar:
      // data.label_comprovante = "";
      return;
    }

    // (opcional, recomendado) Se exige comprovante, label é obrigatório
    if (data.exige_comprovante && !data.label_comprovante?.trim()) {
      ctx.addIssue({
        path: ["label_comprovante"],
        message: "Informe o texto do comprovante (ex: 'Anexar diploma').",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export type CreateNovaPerguntaFormData = z.infer<
  typeof createNovaPerguntaSchema
>;
