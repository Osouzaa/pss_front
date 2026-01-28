import { api } from "../lib/axios";

interface IniciarInscricaoProps {
  id_inscricao: string;
}
interface IniciarInscricaoBody {
  id_processo_seletivo: string;
}
export async function iniciarInscricao({
  id_processo_seletivo
}: IniciarInscricaoBody) {
  const response = await api.post<IniciarInscricaoProps>('processos_seletivos_inscricoes', {
    id_processo_seletivo
  })
  return response.data
}