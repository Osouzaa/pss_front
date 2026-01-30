import { api } from "../lib/axios";

export async function confirmEmailRequest(payload: { token: string }) {
  return api.post("/auth/confirmar-email", payload);
}
