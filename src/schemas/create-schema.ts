import * as z from "zod";

export const inscricaoSchema = z.object({
  id_vaga: z.string().uuid("Selecione uma vaga válida"), // ✅ NOVO

  possui_ensino_fundamental: z.boolean().optional(),
  possui_ensino_medio: z.boolean().optional(),
  possui_ensino_superior: z.boolean().optional(),

  quantidade_ensino_superior: z.number().int().min(0).max(5).optional(),
  possui_curso_area_educacao: z.boolean().optional(),
  quantidade_curso_area_educacao: z.number().int().min(0).max(20).optional(),
  possui_especializacao: z.boolean().optional(),
  quantidade_especializacao: z.number().int().min(0).max(10).optional(),

  possui_mestrado: z.boolean().optional(),
  possui_doutorado: z.boolean().optional(),

  tempo_experiencia_dias: z.number().int().min(0).optional(),

  observacao: z.string().max(500).optional(),
});

export type InscricaoFormData = z.infer<typeof inscricaoSchema>;
