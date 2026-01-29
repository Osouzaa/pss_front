import * as z from "zod";

export const PerguntaTipoEnum = z.enum([
  "BOOLEAN",
  "NUMERO",
  "TEXTO",
  "SELECT",
  "MULTISELECT",
  "DATA",
  "EXPERIENCIA_DIAS",
]);

const FaixaExperienciaSchema = z.object({
  ate: z.coerce.number().int().positive("Informe um número válido de dias"),
  medio: z.coerce.number().int().min(0, "Não pode ser negativo"),
  superior: z.coerce.number().int().min(0, "Não pode ser negativo"),
});

const FAIXAS_FIXAS = [365, 730, 1095, 1460, 999999];

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

    exige_comprovante: z.boolean().default(false),
    label_comprovante: z.string().max(255).optional().default(""),

    faixas: z.array(FaixaExperienciaSchema).optional(),
  })
  .superRefine((data, ctx) => {
    // REGRA 1: BOOLEAN precisa ter pelo menos uma pontuação
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

    // REGRA 2: EXPERIENCIA_DIAS precisa ter faixas válidas e fixas
    if (data.tipo === "EXPERIENCIA_DIAS") {
      if (!data.faixas || data.faixas.length !== 5) {
        ctx.addIssue({
          path: ["faixas"],
          message: "Informe exatamente 5 faixas de experiência.",
          code: z.ZodIssueCode.custom,
        });
      } else {
        const ates = data.faixas.map((f) => Number(f.ate));

        // deve ser exatamente [365, 730, 1095, 1460, 999999] (ordem)
        const ok =
          ates.length === FAIXAS_FIXAS.length &&
          ates.every((v, i) => v === FAIXAS_FIXAS[i]);

        if (!ok) {
          ctx.addIssue({
            path: ["faixas"],
            message:
              "As faixas devem ser: 365, 730, 1095, 1460 e 999999 (acima de 1460).",
            code: z.ZodIssueCode.custom,
          });
        }
      }

      // pontuação fixa não é usada nesse tipo (não precisa dar erro, mas se quiser bloquear:)
      // if (data.pontuacao_medio != null || data.pontuacao_superior != null || data.pontuacao_fundamental != null) { ... }
    }

    // REGRA 3/4: comprovante
    if (!data.exige_comprovante) return;

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
