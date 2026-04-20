import { api } from "../lib/axios";

interface NovoUsuarioParams {
  nome_completo: string;
  email: string;
  senha: string;
}

interface NovoUsuarioResponse {
  ok: boolean;
  mail_sent: boolean;
  message: string;
}

export async function novoUsuario(params: NovoUsuarioParams): Promise<NovoUsuarioResponse> {
  const { data } = await api.post<NovoUsuarioResponse>("/auth/register", params);
  return data;
}
