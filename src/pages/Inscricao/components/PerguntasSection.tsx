import * as S from "../styles";
import type { RespostasState, AnswerValue } from "../types";
import { PerguntaField } from "./PerguntaField";

export function PerguntasSection(props: {
  perguntas: any[];
  respostas: RespostasState;
  onChangeResposta: (idPergunta: string, next: AnswerValue) => void;
}) {
  const { perguntas, respostas, onChangeResposta } = props;

  return (
    <>
      <S.Section>
        <S.SectionTitle>Perguntas</S.SectionTitle>
      </S.Section>

      {perguntas.map((p) => (
        <PerguntaField
          key={p.id_pergunta}
          p={p}
          value={respostas[p.id_pergunta] ?? null}
          disabled={false}
          onChangeValue={(next) => onChangeResposta(p.id_pergunta, next)}
        />
      ))}
    </>
  );
}
