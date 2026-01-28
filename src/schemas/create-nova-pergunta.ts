import * as z from "zod";

export const PerguntaTipoEnum = z.enum([
  "BOOLEAN",
  "NUMERO",
  "TEXTO",
  "SELECT",
  "MULTISELECT",
  "DATA",
]);

export const createNovaPerguntaSchema = z.object({
  titulo: z.string().min(3).max(220),
  descricao: z.string().max(800).default(""),
  tipo: PerguntaTipoEnum,
  obrigatoria: z.boolean().default(false),
  ordem: z.coerce.number().int().min(0).default(0),
  ativa: z.boolean().default(true),
});

export type CreateNovaPerguntaFormData = z.infer<
  typeof createNovaPerguntaSchema
>;
