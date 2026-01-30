import * as z from "zod";

/**
 * Tipos de pergunta
 */
export const PerguntaTipoEnum = z.enum([
  "BOOLEAN",
  "NUMERO",
  "TEXTO",
  "SELECT",
  "MULTISELECT",
  "DATA",
  "EXPERIENCIA_DIAS",
]);

/**
 * Helper:
 * - input vazio ("") → null
 * - número válido → number
 * - mantém validação de >= 0
 */
const numberOrNullFromInput = z.preprocess((v) => {
  if (v === "" || v === undefined || v === null) return null;

  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : v;
  }

  return v;
}, z.number().int().min(0, "Não pode ser negativo").nullable());

/**
 * Schema da faixa de experiência
 */
const FaixaExperienciaSchema = z.object({
  ate: z.coerce.number().int().positive("Informe um número válido de dias"),

  // ✅ agora podem ser null (campo vazio no formulário)
  medio: numberOrNullFromInput,
  superior: numberOrNullFromInput,
});

/**
 * Faixas fixas obrigatórias
 */
const FAIXAS_FIXAS = [365, 730, 1095, 1460, 999999];

/**
 * Schema principal
 */
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

    // ✅ faixas com medio/superior nullable
    faixas: z.array(FaixaExperienciaSchema).optional(),
  })
  .superRefine((data, ctx) => {
    /**
     * REGRA 1: BOOLEAN precisa ter pelo menos uma pontuação
     */
    if (data.tipo === "BOOLEAN") {
      const temPontuacao =
        data.pontuacao_fundamental != null ||
        data.pontuacao_medio != null ||
        data.pontuacao_superior != null;

      if (!temPontuacao) {
        ctx.addIssue({
          path: ["pontuacao_medio"],
          message:
            "Informe ao menos uma pontuação por nível (fundamental, médio ou superior).",
          code: z.ZodIssueCode.custom,
        });
      }
    }

    /**
     * REGRA 2: EXPERIENCIA_DIAS precisa ter exatamente 5 faixas fixas
     */
    if (data.tipo === "EXPERIENCIA_DIAS") {
      if (!data.faixas || data.faixas.length !== 5) {
        ctx.addIssue({
          path: ["faixas"],
          message: "Informe exatamente 5 faixas de experiência.",
          code: z.ZodIssueCode.custom,
        });
        return;
      }

      const ates = data.faixas.map((f) => Number(f.ate));

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

      /**
       * REGRA EXTRA (opcional mas recomendada):
       * pelo menos uma pontuação em alguma faixa
       */
      const temAlgumPonto = data.faixas.some(
        (f) => f.medio != null || f.superior != null,
      );

      if (!temAlgumPonto) {
        ctx.addIssue({
          path: ["faixas"],
          message:
            "Informe ao menos uma pontuação (Médio ou Superior) em alguma faixa.",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

export type CreateNovaPerguntaFormData = z.infer<
  typeof createNovaPerguntaSchema
>;
