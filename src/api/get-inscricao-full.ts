import { api } from "../lib/axios";

export interface Arquivo {
  id_arquivo: string;
  nome_original: string;
  storage_key: string;
  mime_type: string;
  tamanho_bytes: string;
}

export interface CandidatoDocumento {
  id_candidato_documento: string;
  tipo: string;
  arquivo: Arquivo;
}

export interface Candidato {
  id_candidato: string;
  nome_completo: string;
  cpf: string;
  email: string;
  telefone: string;
  rg: string | null;
  data_nascimento: string | null;
  cep: string | null;
  logradouro: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  uf: string | null;
}

export interface Vaga {
  id_vaga: string;
  id_processo_seletivo: string;
  nome: string;
  nivel: 'FUNDAMENTAL' | 'MEDIO' | 'SUPERIOR';
  quantidade_de_vagas: number;
  data_criacao: string;
  data_atualizacao: string;
}

export interface Inscricao {
  id_inscricao: string;
  status: 'RASCUNHO' | 'ENVIADA' | 'CANCELADA';
  protocolo: string | null;
  pontuacao_total: number;
  pontuacao_detalhe_json: string | null;
  data_envio: string | null;
  observacao: string | null;
  vaga: Vaga;
}

export interface PerguntaOpcao {
  id_opcao: string;
  id_pergunta: string;
  label: string;
  valor: string;
  valor_fundamental: number | null;
  valor_medio: number | null;
  valor_superior: number | null;
  ordem: number;
  ativa: boolean;
}

export interface RespostaCandidato {
  id_resposta: string;
  valor_boolean: boolean | null;
  valor_numero: number | null;
  valor_texto: string | null;
  valor_data: string | null;
  opcao_id: string | null;
  opcao_selecionada: PerguntaOpcao | null;
  pontos_calculados: number;
  pontos_detalhe_json: string | null;
}

export interface Pergunta {
  id_pergunta: string;
  titulo: string;
  descricao: string | null;
  tipo: 'BOOLEAN' | 'SELECT' | 'TEXT' | 'NUMBER' | 'DATE';
  obrigatoria: boolean;
  ordem: number;
  exige_comprovante: boolean;
  label_comprovante: string | null;
  opcoes: PerguntaOpcao[];
  resposta_candidato: RespostaCandidato | null;
  comprovante_anexado: CandidatoDocumento | null;
}

export interface Processo {
  id_processo_seletivo: string;
  titulo: string;
  secretaria: string;
  ano: number;
  status: 'RASCUNHO' | 'ABERTO' | 'EM_ANALISE' | 'ENCERRADO';
  data_inicio_inscricoes: string;
  data_fim_inscricoes: string;
  perguntas: Pergunta[];
}

export interface InscricaoFull {
  candidato: Candidato;
  inscricao: Inscricao;
  processo: Processo;
}

export async function getInscricaoFull(id: string): Promise<InscricaoFull> {
  const response = await api.get<InscricaoFull>(`/processos-seletivos-inscricoes/${id}/full`);
  return response.data;
}