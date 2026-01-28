import z from "zod";

export const loginSchema = z.object({
  email: z.string().min(3).max(160),
  senha: z.string(),
})

export type LoginFormData = z.infer<typeof loginSchema>