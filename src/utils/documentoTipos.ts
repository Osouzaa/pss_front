export const DOCUMENTO_TIPO_OPTIONS = [
  // Identificação
  { value: "CPF", label: "CPF" },
  { value: "RG", label: "RG" },
  { value: "CNH", label: "CNH" },
  { value: "CERTIDAO_NASCIMENTO", label: "CERTIDÃO DE NASCIMENTO" },
  { value: "CERTIDAO_CASAMENTO", label: "CERTIDÃO DE CASAMENTO" },
  { value: "DECLARACAO_MATRICULA", label: "DECLARAÇÃO DE MATRÍCULA" },

  // Endereço
  { value: "COMPROVANTE_ENDERECO", label: "COMPROVANTE DE ENDEREÇO" },

  // Obrigações civis
  { value: "CERTIFICADO_RESERVISTA", label: "CERTIFICADO DE RESERVISTA" },
  { value: "TITULO_ELEITOR", label: "TÍTULO DE ELEITOR" },

  // Formação
  { value: "DIPLOMA", label: "DIPLOMA" },
  { value: "HISTORICO_ESCOLAR", label: "HISTÓRICO ESCOLAR" },
  { value: "ENSINO_SUPERIOR", label: "ENSINO SUPERIOR" },
  { value: "MESTRADO", label: "MESTRADO" },
  { value: "DOUTORADO", label: "DOUTORADO" },
  { value: "CURSO", label: "CURSOS / CERTIFICADOS" },

  // Especialização (máx. 2)
  {
    value: "COMPROVANTE_ESPECIALIZACAO_1",
    label: "COMPROVANTE DE ESPECIALIZAÇÃO (1)",
  },
  {
    value: "COMPROVANTE_ESPECIALIZACAO_2",
    label: "COMPROVANTE DE ESPECIALIZAÇÃO (2)",
  },

  // Experiência profissional
  { value: "EXPERIENCIA_PROFISSIONAL", label: "EXPERIÊNCIA PROFISSIONAL" },
  { value: "CTPS", label: "CTPS" },
  { value: "CONTRATO_TRABALHO", label: "CONTRATO DE TRABALHO" },
  { value: "DECLARACAO_EXPERIENCIA", label: "DECLARAÇÃO DE EXPERIÊNCIA" },

  // Ações afirmativas / cotas
  { value: "DECLARACAO_RACA_COR", label: "AUTODECLARAÇÃO DE RAÇA/COR" },

  // PCD
  { value: "PCD_LAUDO_MEDICO", label: "PCD — LAUDO MÉDICO" },
  { value: "PCD_RELATORIO", label: "PCD — RELATÓRIO COMPLEMENTAR" },

  // Outros
  {
    value: "COMPROVANTE_RESERVA_VAGA",
    label: "COMPROVANTE DE RESERVA DE VAGA",
  },
  { value: "OUTROS", label: "OUTROS" },
] as const;

/**
 * Tipo derivado diretamente das opções acima — garante que enum/union
 * esteja sempre sincronizado com a lista.
 */
export type DocumentoTipo = (typeof DOCUMENTO_TIPO_OPTIONS)[number]["value"];