import * as S from "../styles";

interface ModalScoreSectionProps {
  pontuacao_total?: number | null;
  experiencia_dias?: number | null;
  especializacao_pontos?: number | null;
  dataNascimento?: string | null;
  mostrarEspecializacao: boolean;
}

function calcIdade(dataNascimento?: string | null): string {
  if (!dataNascimento) return "—";
  const anos = Math.floor(
    (Date.now() - new Date(dataNascimento).getTime()) /
      (1000 * 60 * 60 * 24 * 365.25),
  );
  return `${anos} anos`;
}

export function ModalScoreSection({
  pontuacao_total,
  experiencia_dias,
  especializacao_pontos,
  dataNascimento,
  mostrarEspecializacao,
}: ModalScoreSectionProps) {
  return (
    <S.ModalScoreRow>
      <S.ModalScoreBox>
        <S.StatValue>{pontuacao_total ?? 0}</S.StatValue>
        <S.StatLabel>Pontuação total</S.StatLabel>
      </S.ModalScoreBox>

      <S.ModalScoreBox>
        <S.StatValue>{experiencia_dias ?? 0}</S.StatValue>
        <S.StatLabel>Dias de experiência</S.StatLabel>
      </S.ModalScoreBox>

      {mostrarEspecializacao && (
        <S.ModalScoreBox>
          <S.StatValue>{especializacao_pontos ?? 0}</S.StatValue>
          <S.StatLabel>Pts titulação</S.StatLabel>
        </S.ModalScoreBox>
      )}

      <S.ModalScoreBox>
        <S.StatValue>{calcIdade(dataNascimento)}</S.StatValue>
        <S.StatLabel>Idade</S.StatLabel>
      </S.ModalScoreBox>
    </S.ModalScoreRow>
  );
}