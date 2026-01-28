import { api } from "../lib/axios";

interface FormData {
  email: string;
  senha: string;
}

interface ILoginResponse {
  token: string;
  user: {
    sub: string;
    tipo: string;
    email: string;
    id_candidato: string | null;
    fl_primeiro_acesso: boolean;
  }
  mustCompleteCandidateProfile: boolean
}

export async function login({email, senha}:FormData) {
  const response = await api.post<ILoginResponse>('/auth/login', {
    email, senha
  })
  return response.data
}