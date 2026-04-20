import { useQuery } from "@tanstack/react-query";
import * as S from "./styles";
import type { RespostasState, AnswerValue } from "../../types";
import { PerguntaField } from "../PerguntaField";
import { getDocumentosMe } from "../../../../api/get-documentos-me";
import type { NivelVaga } from "../../../../api/get-processo-id";

export function PerguntasSection(props: {
  perguntas: any[];
  respostas: RespostasState;
  nivel?: NivelVaga | null;
  anexoFiles?: Record<string, File>;
  onChangeResposta: (idPergunta: string, next: AnswerValue) => void;
  onFileSelect?: (idPergunta: string, file: File | null) => void;
}) {
  const { perguntas, respostas, nivel = null, anexoFiles = {}, onChangeResposta, onFileSelect } = props;

  // Reutiliza o cache do AnexosUser — sem request extra se já carregado
  const { data: docs = [] } = useQuery({
    queryKey: ["me-documentos"],
    queryFn: getDocumentosMe,
    staleTime: 60_000,
  });

  const docTipos = docs.map((d) => d.tipo as string);

  const answered = perguntas.filter((p) => {
    if (p.tipo === "ANEXO") return !!anexoFiles[p.id_pergunta];
    const v = respostas[p.id_pergunta];
    if (v === null || v === undefined) return false;
    if (typeof v === "string") return v.trim() !== "";
    return true;
  }).length;

  const total = perguntas.length;
  const pct = total > 0 ? Math.round((answered / total) * 100) : 0;

  return (
    <>
      <S.SectionHeader>
        <S.SectionTitle>Perguntas</S.SectionTitle>
        {total > 0 && (
          <S.ProgressWrap>
            <S.ProgressLabel>
              {answered} de {total} respondidas
            </S.ProgressLabel>
            <S.ProgressBar>
              <S.ProgressFill $pct={pct} />
            </S.ProgressBar>
          </S.ProgressWrap>
        )}
      </S.SectionHeader>

      <S.QuestionsGrid>
        {perguntas.map((p, i) => (
          <PerguntaField
            key={p.id_pergunta}
            p={p}
            index={i + 1}
            value={respostas[p.id_pergunta] ?? null}
            disabled={false}
            docTipos={docTipos}
            nivel={nivel}
            selectedFile={anexoFiles[p.id_pergunta] ?? null}
            onChangeValue={(next) => onChangeResposta(p.id_pergunta, next)}
            onFileSelect={onFileSelect ? (f) => onFileSelect(p.id_pergunta, f) : undefined}
          />
        ))}
      </S.QuestionsGrid>
    </>
  );
}
