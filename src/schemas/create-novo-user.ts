import z from "zod";

export const createNovoUserSchema = z.object({
  nome_completo: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres.")
    .max(120, "Nome deve ter no máximo 120 caracteres."),

  email: z
    .string()
    .email("E-mail inválido.")
    .max(120, "E-mail deve ter no máximo 120 caracteres."),

  senha: z
    .string()
    .min(8, "Senha deve ter no mínimo 8 caracteres.")
    .max(72, "Senha deve ter no máximo 72 caracteres.")
    .regex(/[a-zA-Z]/, "Senha deve conter pelo menos uma letra.")
    .regex(/\d/, "Senha deve conter pelo menos um número."),
});

export type CreateNovoUserFormData = z.infer<typeof createNovoUserSchema>;
