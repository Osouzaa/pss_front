import z from "zod";

export const createNovoUserSchema = z.object({
  email: z.string().min(3).max(160),
  senha: z.string(),
  role: z.enum(['ADMIN', 'CANDIDATO'], {
    errorMap: () => ({message: "Selecione um role correto"})
  })
})

export type CreateNovoUserFormData = z.infer<typeof createNovoUserSchema>