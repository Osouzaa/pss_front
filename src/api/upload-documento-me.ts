import { api } from "../lib/axios";

export type DocumentoTipo =
  // Identificação
  | "CPF"
  | "RG"
  | "CNH"
  | "CERTIDAO_NASCIMENTO"
  | "CERTIDAO_CASAMENTO"
  // Endereço
  | "COMPROVANTE_ENDERECO"
  // Obrigações civis
  | "CERTIFICADO_RESERVISTA"
  | "TITULO_ELEITOR"
  // Formação
  | "DIPLOMA"
  | "HISTORICO_ESCOLAR"
  | "ENSINO_SUPERIOR"
  | "MESTRADO"
  | "DOUTORADO"
  | "CURSO"
  // Experiência
  | "EXPERIENCIA_PROFISSIONAL"
  | "CTPS"
  | "CONTRATO_TRABALHO"
  | "DECLARACAO_EXPERIENCIA"
  // Cotas / ações afirmativas
  | "DECLARACAO_RACA_COR"
  // PCD
  | "PCD_LAUDO_MEDICO"
  | "PCD_RELATORIO"
  // Outros
  | "COMPROVANTE_RESERVA_VAGA"
  | "OUTROS";

type UploadDocumentoMeInput = {
  file: File;
  tipo: DocumentoTipo;
  descricao?: string;
};

export async function uploadDocumentoMe(input: UploadDocumentoMeInput) {
  const form = new FormData();
  form.append("file", input.file);
  form.append("tipo", input.tipo);
  if (input.descricao) form.append("descricao", input.descricao);

  const res = await api.post(
    "/processo-seletivo-candidatos/me/documentos",
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );

  return res.data;
}
