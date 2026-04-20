import { api } from "../lib/axios";

interface FormData {
  titulo: string;
  secretaria: string;
  ano: number;
  status: string;
  data_inicio_inscricoes?: string;
  data_fim_inscricoes?: string;
  usa_classificacao?: boolean;
}

export async function criarNovoProcesso({
  titulo,
  secretaria,
  ano,
  status,
  data_fim_inscricoes,
  data_inicio_inscricoes,
  usa_classificacao,
}: FormData) {
  await api.post('/processo-seletivo', {
    titulo,
    secretaria,
    ano,
    data_fim_inscricoes,
    data_inicio_inscricoes,
    status,
    usa_classificacao,
  })
}