import * as S from "./styles";

export function InscricaoSkeleton() {
  return (
    <S.Page>
      <S.Card>
        <S.CardHeader>
          <S.HeaderRight>
            <S.SkelLine $w="4.5rem" $h="0.75rem" />
            <S.SkelLine $w="18rem" $h="1.4rem" />
            <S.SkelLine $w="22rem" $h="0.9rem" />
          </S.HeaderRight>
        </S.CardHeader>

        <S.Form onSubmit={(e) => e.preventDefault()}>
          <S.Layout>
            <S.Main>
              <S.Grid>
                <div style={{ gridColumn: "1 / -1" }}>
                  {/* VagaSelect skeleton */}
                  <S.FieldBlock>
                    <S.SkelLine $w="7rem" $h="0.75rem" />
                    <S.SkelBox $h="2.75rem" />
                    <S.SkelLine $w="12rem" $h="0.8rem" />
                  </S.FieldBlock>

                  {/* ActionsBar skeleton */}
                  <S.ActionsBarSkel>
                    <S.SkelBtn $w="7rem" />
                    <S.SkelBtn $w="10rem" />
                  </S.ActionsBarSkel>
                </div>

                {/* Perguntas skeleton (2 colunas) */}
                <S.SkelSection style={{ gridColumn: "1 / -1" }}>
                  <S.SectionHeaderSkel>
                    <S.SkelLine $w="10rem" $h="1rem" />
                    <S.SkelLine $w="14rem" $h="0.85rem" />
                  </S.SectionHeaderSkel>

                  <S.PerguntasGridSkel>
                    {Array.from({ length: 8 }).map((_, i) => (
                      <S.PerguntaCardSkel key={i}>
                        <S.SkelLine $w="60%" $h="0.85rem" />
                        <S.SkelLine $w="35%" $h="0.75rem" />
                        <S.SkelBox $h="2.6rem" />
                      </S.PerguntaCardSkel>
                    ))}
                  </S.PerguntasGridSkel>
                </S.SkelSection>
              </S.Grid>

              {/* Final ActionsBar skeleton */}
              <S.ActionsBarSkel>
                <S.SkelBtn $w="10rem" />
              </S.ActionsBarSkel>
            </S.Main>

            <S.Side>
              <S.SideCard>
                <S.SideHeader>
                  <S.SideTitle>Anexos</S.SideTitle>
                </S.SideHeader>

                <S.SideBody>
                  <S.SkelLine $w="6rem" $h="0.85rem" />
                  <S.SkelBox $h="3rem" />
                  <S.SkelBox $h="3rem" />
                  <S.SkelBox $h="3rem" />
                  <S.SkelBox $h="3rem" />
                </S.SideBody>
              </S.SideCard>
            </S.Side>
          </S.Layout>
        </S.Form>
      </S.Card>
    </S.Page>
  );
}
