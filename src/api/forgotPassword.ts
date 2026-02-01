import { api } from "../lib/axios";

export async function forgotPasswordRequest(payload: { email: string }) {
  // ajuste a rota conforme seu backend
  await api.post("/auth/esqueci-senha", payload);
}
