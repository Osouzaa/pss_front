export const DOCUMENTO_TIPOS = [
  // Identificação
  "CPF",
  "RG",
  "CNH",
  "CERTIDAO_NASCIMENTO",
  "CERTIDAO_CASAMENTO",

  "DECLARACAO_MATRICULA",

  // Endereço
  "COMPROVANTE_ENDERECO",

  // Obrigações civis
  "CERTIFICADO_RESERVISTA",
  "TITULO_ELEITOR",

  // Formação
  "DIPLOMA",
  "HISTORICO_ESCOLAR",
  "ENSINO_SUPERIOR",
  "MESTRADO",
  "DOUTORADO",
  "CURSO",

  // Experiência profissional
  "EXPERIENCIA_PROFISSIONAL",
  "CTPS",
  "CONTRATO_TRABALHO",
  "DECLARACAO_EXPERIENCIA",

  // Ações afirmativas / cotas
  "DECLARACAO_RACA_COR",

  // PCD
  "PCD_LAUDO_MEDICO",
  "PCD_RELATORIO",

  // Outros
  "COMPROVANTE_RESERVA_VAGA",
  "OUTROS",
] as const;

export type DocumentoTipo = (typeof DOCUMENTO_TIPOS)[number];

export const LABELS_DOCUMENTO_TIPO: Record<DocumentoTipo, string> = {
  CPF: "CPF",
  RG: "RG",
  CNH: "CNH",
  CERTIDAO_NASCIMENTO: "Certidão de nascimento",
  CERTIDAO_CASAMENTO: "Certidão de casamento",

  DECLARACAO_MATRICULA: "Declaração de matrícula",

  COMPROVANTE_ENDERECO: "Comprovante de endereço",

  CERTIFICADO_RESERVISTA: "Certificado de reservista",
  TITULO_ELEITOR: "Título de eleitor",

  DIPLOMA: "Diploma",
  HISTORICO_ESCOLAR: "Histórico escolar",
  ENSINO_SUPERIOR: "Ensino Superior",
  MESTRADO: "Mestrado (até 2)",
  DOUTORADO: "Doutorado",
  CURSO: "Cursos / Certificados",

  EXPERIENCIA_PROFISSIONAL: "Experiência Profissional",
  CTPS: "CTPS",
  CONTRATO_TRABALHO: "Contrato de trabalho",
  DECLARACAO_EXPERIENCIA: "Declaração de experiência",

  DECLARACAO_RACA_COR: "Autodeclaração de raça/cor",

  PCD_LAUDO_MEDICO: "PCD — Laudo médico",
  PCD_RELATORIO: "PCD — Relatório complementar",

  COMPROVANTE_RESERVA_VAGA: "Comprovante de reserva de vaga",
  OUTROS: "Outros",
};

export function labelTipo(tipo: DocumentoTipo) {
  return LABELS_DOCUMENTO_TIPO[tipo] ?? tipo;
}
