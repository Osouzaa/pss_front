import { api } from "../lib/axios";

interface CriarAdminParams {
  nome_completo: string;
  email: string;
  senha: string;
  secretaria_usuario?: string;
}

interface CriarAdminResponse {
  ok: boolean;
  message: string;
  id_usuario: string;
  email: string;
}

export async function criarAdmin(params: CriarAdminParams): Promise<CriarAdminResponse> {
  const { data } = await api.post<CriarAdminResponse>("/auth/criar-admin", params);
  return data;
}
