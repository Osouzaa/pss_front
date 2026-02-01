import { api } from "../lib/axios";

export async function resetPasswordRequest(payload: {
  token: string;
  password: string;
}) {
  await api.post("/auth/redefinir-senha", payload);
}
