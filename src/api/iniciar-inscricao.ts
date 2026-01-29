import { api } from "../lib/axios";

interface IniciarInscricaoProps {
  id_inscricao: string;
  status: string;
  protocolo: string;
  readonly: true;
}
interface IniciarInscricaoBody {
  id_processo_seletivo: string;
  id_vaga: string;
}
export async function iniciarInscricao({
  id_processo_seletivo,
  id_vaga,
}: IniciarInscricaoBody) {
  const response = await api.post<IniciarInscricaoProps>(
    "processos-seletivos-inscricoes",
    {
      id_processo_seletivo,
      id_vaga,
    },
  );
  return response.data;
}
