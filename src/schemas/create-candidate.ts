import z from "zod";

export const createCandidateSchema = z.object({
  nome_completo: z
    .string()
    .min(3, "O nome deve ter no mínimo 3 caracteres")
    .max(160, "O nome deve ter no máximo 160 caracteres"),

  cpf: z
    .string()
    .transform((v) => (v ?? "").replace(/\D/g, ""))
    .refine((v) => /^\d{11}$/.test(v), "CPF deve conter 11 dígitos"),

  email: z
    .string()
    .min(1, "O e-mail é obrigatório")
    .email("E-mail inválido")
    .transform((v) => v.trim().toLowerCase()),

  rg: z.string().optional(),

  telefone: z
    .string()
    .min(8, "Telefone inválido")
    .max(20, "Telefone inválido")
    .transform((v) => (v ?? "").replace(/\D/g, "")),

  data_nascimento: z
    .string()
    .optional()
    .refine((v) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v), {
      message: "Data de nascimento deve estar no formato YYYY-MM-DD",
    }),

  cep: z
    .string()
    .optional()
    .transform((v) => (v ? v.replace(/\D/g, "") : v))
    .refine((v) => !v || /^\d{8}$/.test(v), "CEP deve conter 8 dígitos"),

  logradouro: z
    .string()
    .optional()
    .refine((v) => !v || v.trim().length >= 3, "Logradouro inválido")
    .refine((v) => !v || v.trim().length <= 160, "Logradouro muito longo")
    .transform((v) => (v ? v.trim() : v)),

  numero: z
    .string()
    .optional()
    .refine((v) => !v || v.trim().length >= 1, "Número inválido")
    .refine((v) => !v || v.trim().length <= 20, "Número muito longo")
    .transform((v) => (v ? v.trim() : v)),

  complemento: z
    .string()
    .optional()
    .refine((v) => !v || v.trim().length <= 80, "Complemento muito longo")
    .transform((v) => (v ? v.trim() : v)),

  bairro: z
    .string()
    .optional()
    .refine((v) => !v || v.trim().length >= 2, "Bairro inválido")
    .refine((v) => !v || v.trim().length <= 120, "Bairro muito longo")
    .transform((v) => (v ? v.trim() : v)),

  cidade: z
    .string()
    .optional()
    .refine((v) => !v || v.trim().length >= 2, "Cidade inválida")
    .refine((v) => !v || v.trim().length <= 120, "Cidade muito longa")
    .transform((v) => (v ? v.trim() : v)),

  uf: z
    .string()
    .optional()
    .transform((v) => (v ? v.trim().toUpperCase() : v))
    .refine((v) => !v || /^[A-Z]{2}$/.test(v), "UF deve conter 2 letras (ex: MG)"),

  referencia: z
    .string()
    .optional()
    .refine((v) => !v || v.trim().length <= 160, "Referência muito longa")
    .transform((v) => (v ? v.trim() : v)),
});

export type CreateCandidateFormData = z.infer<typeof createCandidateSchema>;
