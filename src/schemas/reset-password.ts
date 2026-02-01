import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    token: z.string().min(10, "Token inválido."),
    password: z
      .string()
      .min(8, "Mínimo 8 caracteres.")
      .regex(/[A-Z]/, "Inclua pelo menos 1 letra maiúscula.")
      .regex(/[a-z]/, "Inclua pelo menos 1 letra minúscula.")
      .regex(/[0-9]/, "Inclua pelo menos 1 número."),
    confirmPassword: z.string().min(8, "Confirme sua senha."),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "As senhas não conferem.",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
