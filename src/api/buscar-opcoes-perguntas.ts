import { api } from "../lib/axios";

export type OpcaoPergunta = {
  id_opcao: string;
  id_pergunta: string;

  label: string;
  valor: string;

  // ✅ NOVOS CAMPOS DE PONTUAÇÃO POR NÍVEL
  valor_fundamental: number | null;
  valor_medio: number | null;
  valor_superior: number | null;

  ordem: number;
  ativa: boolean;

  data_criacao: string;
  data_atualizacao: string;
};

export async function buscarOpcoesPerguntas(id_pergunta: string) {
  const res = await api.get<OpcaoPergunta[]>(
    `/perguntas/${id_pergunta}/opcoes`,
  );

  return res.data;
}
