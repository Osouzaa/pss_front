import { api } from "../lib/axios";

interface FormData {
  email: string;
  senha: string;
  role: string;
}

export async function novoUsuario({
  email,
  senha,
  role
}: FormData) {
  await api.post('/auth/register', {
    email,
    senha,
    role
  })
}