import { api } from "../lib/axios";

export async function resendConfirmEmailRequest(payload: { email: string }) {
  const res = await api.post("auth/reenviar-confirmacao", payload);
  return res;
}
