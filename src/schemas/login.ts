import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ required_error: "O e-mail é obrigatório." })
    .min(3, "O e-mail é um campo obrigatório")
    .max(160, "O e-mail pode ter no máximo 160 caracteres.")
    .email("Informe um e-mail válido."),

  senha: z
    .string({ required_error: "A senha é obrigatória." })
    .min(6, "A senha deve ter pelo menos 6 caracteres."),
});

export type LoginFormData = z.infer<typeof loginSchema>;
