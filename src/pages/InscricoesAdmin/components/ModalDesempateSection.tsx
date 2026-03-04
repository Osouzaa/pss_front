import * as S from "../styles";

interface ModalDesempateSectionProps {
  mostrarEspecializacao: boolean;
}

export function ModalDesempateSection({ mostrarEspecializacao }: ModalDesempateSectionProps) {
  return (
    <S.ModalSection>
      <S.ModalSectionTitle>Critérios de desempate (ordem)</S.ModalSectionTitle>
      <S.TieList>
        <S.TieItem>
          <S.TieNum>1</S.TieNum> Maior pontuação total
        </S.TieItem>
        <S.TieItem>
          <S.TieNum>2</S.TieNum> Prioridade idade ≥ 60 anos
        </S.TieItem>
        {mostrarEspecializacao && (
          <S.TieItem>
            <S.TieNum>3</S.TieNum> Maior pontuação em titulação
            (especialização + mestrado + doutorado)
          </S.TieItem>
        )}
        <S.TieItem>
          <S.TieNum>{mostrarEspecializacao ? 4 : 3}</S.TieNum> Maior tempo de
          experiência
        </S.TieItem>
        <S.TieItem>
          <S.TieNum>{mostrarEspecializacao ? 5 : 4}</S.TieNum> Mais velho (data
          de nascimento)
        </S.TieItem>
      </S.TieList>
    </S.ModalSection>
  );
}