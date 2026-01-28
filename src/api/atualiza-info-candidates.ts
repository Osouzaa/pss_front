import { api } from "../lib/axios";
import type { CreateCandidateFormData } from "../schemas/create-candidate";

export async function atualizarInfoCandidate(
  data: CreateCandidateFormData,
) {
  const response = await api.patch(
    "/processo-seletivo-candidatos/me",
    data,
  );

  return response.data;
}
