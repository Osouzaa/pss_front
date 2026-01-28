// src/pages/Inscricao/InscricaoPage.tsx
import { useEffect, useMemo } from "react";
import { useParams } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import * as S from "./styles";
import { useInscricaoMe } from "./useInscricaoMe";
import {
  inscricaoSchema,
  type InscricaoFormData,
} from "../../schemas/create-schema";
import { useVagasByProcesso } from "../../api/useVagasByProcesso";

export function InscricaoPage() {
  const { id } = useParams();
  const idProcesso = id ?? "";

  const defaultValues = useMemo<InscricaoFormData>(
    () => ({
      id_vaga: "",
      possui_ensino_fundamental: false,
      possui_ensino_medio: false,
      possui_ensino_superior: false,
      quantidade_ensino_superior: 0,
      possui_curso_area_educacao: false,
      quantidade_curso_area_educacao: 0,
      possui_especializacao: false,
      quantidade_especializacao: 0,
      possui_mestrado: false,
      possui_doutorado: false,
      tempo_experiencia_meses: 0,
      observacao: "",
    }),
    [],
  );

  const form = useForm<InscricaoFormData>({
    resolver: zodResolver(inscricaoSchema) as any,
    defaultValues,
    mode: "onChange",
  });

  // ✅ vaga selecionada (precisa existir antes do hook)
  const selectedVagaId = form.watch("id_vaga");

  // ✅ agora o hook depende de processo + vaga (evita 400)
  const { query, createMut, updateMut, enviarMut } = useInscricaoMe(
    idProcesso,
    selectedVagaId,
  );

  // ✅ busca vagas do processo
  const vagasQuery = useVagasByProcesso(idProcesso);
  const vagas = vagasQuery.data ?? [];

  // loading só quando:
  // - vagas ainda carregando
  // - inscrição carregando (mas só carrega se tiver vaga)
  const isLoading = vagasQuery.isLoading || query.isLoading;

  // ✅ somente rascunho pode editar
  const isReadOnly = !!query.data?.status && query.data.status !== "RASCUNHO";

  const loadedId = query.data?.id_inscricao;

  useEffect(() => {
    if (!query.data) return;

    form.reset({
      id_vaga: query.data.id_vaga ?? "",
      possui_ensino_fundamental: !!query.data.possui_ensino_fundamental,
      possui_ensino_medio: !!query.data.possui_ensino_medio,
      possui_ensino_superior: !!query.data.possui_ensino_superior,
      quantidade_ensino_superior: query.data.quantidade_ensino_superior ?? 0,
      possui_curso_area_educacao: !!query.data.possui_curso_area_educacao,
      quantidade_curso_area_educacao:
        query.data.quantidade_curso_area_educacao ?? 0,
      possui_especializacao: !!query.data.possui_especializacao,
      quantidade_especializacao: query.data.quantidade_especializacao ?? 0,
      possui_mestrado: !!query.data.possui_mestrado,
      possui_doutorado: !!query.data.possui_doutorado,
      tempo_experiencia_meses: query.data.tempo_experiencia_meses ?? 0,
      observacao: query.data.observacao ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedId]);

  const onSave: SubmitHandler<InscricaoFormData> = async (data) => {
    const payload: InscricaoFormData = {
      ...data,
      observacao: data.observacao?.trim() ? data.observacao.trim() : "",
    };

    if (!payload.id_vaga) {
      form.setError("id_vaga", { message: "Selecione uma vaga." });
      return;
    }

    // se ainda não existe inscrição (GET deu 404), cria
    if (!query.data) {
      await createMut.mutateAsync(payload);
      return;
    }

    // se existe, atualiza
    await updateMut.mutateAsync(payload);
  };

  async function onEnviar() {
    if (!selectedVagaId) {
      form.setError("id_vaga", { message: "Selecione uma vaga para enviar." });
      return;
    }
    await enviarMut.mutateAsync(); // ✅ sem payload (idVaga já está no hook)
  }

  if (!idProcesso) return <S.Page>Processo inválido.</S.Page>;

  const hasVagas = vagas.length > 0;
  const showSelectVagaHint = !selectedVagaId;

  return (
    <S.Page>
      <S.Header>
        <S.TitleWrap>
          <S.Title>Minha inscrição</S.Title>
          <S.Subtitle>
            Selecione a vaga, preencha seus dados e salve como rascunho. Quando
            estiver tudo certo, envie a inscrição.
          </S.Subtitle>

          {isReadOnly && (
            <S.Helper style={{ marginTop: 6 }}>
              Esta inscrição não pode mais ser editada porque está em{" "}
              <b>{query.data?.status}</b>.
            </S.Helper>
          )}
        </S.TitleWrap>

        <S.HeaderRight>
          {query.data?.status && (
            <S.StatusPill $status={query.data.status}>
              {query.data.status}
            </S.StatusPill>
          )}

          {query.data && (
            <S.Badge>
              <S.BadgeRow>
                <S.BadgeLabel>Pontuação</S.BadgeLabel>
                <S.BadgeValue>{query.data.pontuacao_total}</S.BadgeValue>
              </S.BadgeRow>
              <S.BadgeRow>
                <S.BadgeLabel>Nº inscrição</S.BadgeLabel>
                <S.BadgeValue>{query.data.numero_inscricao}</S.BadgeValue>
              </S.BadgeRow>
            </S.Badge>
          )}
        </S.HeaderRight>
      </S.Header>

      {isLoading ? (
        <S.LoadingState>Carregando...</S.LoadingState>
      ) : (
        <S.Card>
          <S.CardHeader>
            <S.CardHeaderTitle>Formulário de cadastro</S.CardHeaderTitle>
            <S.CardHeaderText>
              Os campos abaixo serão usados para calcular sua pontuação
              automaticamente.
            </S.CardHeaderText>
          </S.CardHeader>

          <S.Form onSubmit={form.handleSubmit(onSave)}>
            <S.Fieldset
              disabled={isReadOnly || createMut.isPending || updateMut.isPending}
            >
              <S.Grid>
                {/* =========================
                    VAGA
                ========================= */}
                <S.Field style={{ gridColumn: "1 / -1" }}>
                  Vaga do processo
                  <S.Input as="select" {...form.register("id_vaga")}>
                    <option value="" disabled>
                      Selecione uma vaga
                    </option>

                    {vagas.map((v: any) => (
                      <option key={v.id_vaga} value={v.id_vaga}>
                        {v.nome} ({v.nivel})
                      </option>
                    ))}
                  </S.Input>

                  {form.formState.errors.id_vaga?.message && (
                    <S.ErrorText>{form.formState.errors.id_vaga.message}</S.ErrorText>
                  )}

                  {!hasVagas && (
                    <S.Helper>
                      Nenhuma vaga cadastrada/ativa neste processo. Procure a
                      administração.
                    </S.Helper>
                  )}

                  {hasVagas && showSelectVagaHint && (
                    <S.Helper>Selecione uma vaga para carregar sua inscrição.</S.Helper>
                  )}
                </S.Field>

                {/* =========================
                    CARGO (snapshot / leitura)
                ========================= */}
                <S.Section>
                  <S.SectionTitle>Formação</S.SectionTitle>
                </S.Section>

                <S.CheckRow>
                  <S.Checkbox {...form.register("possui_ensino_fundamental")} />
                  Possui ensino fundamental
                </S.CheckRow>

                <S.CheckRow>
                  <S.Checkbox {...form.register("possui_ensino_medio")} />
                  Possui ensino médio
                </S.CheckRow>

                <S.CheckRow>
                  <S.Checkbox {...form.register("possui_ensino_superior")} />
                  Possui ensino superior
                </S.CheckRow>

                <S.Field>
                  Quantidade de cursos de ensino superior
                  <S.Input
                    type="number"
                    min={0}
                    {...form.register("quantidade_ensino_superior", {
                      valueAsNumber: true,
                    })}
                  />
                </S.Field>

                <S.CheckRow>
                  <S.Checkbox {...form.register("possui_curso_area_educacao")} />
                  Possui curso na área educação
                </S.CheckRow>

                <S.Field>
                  Quantidade de cursos na área educação
                  <S.Input
                    type="number"
                    min={0}
                    {...form.register("quantidade_curso_area_educacao", {
                      valueAsNumber: true,
                    })}
                  />
                </S.Field>

                <S.CheckRow>
                  <S.Checkbox {...form.register("possui_especializacao")} />
                  Possui especialização
                </S.CheckRow>

                <S.Field>
                  Quantidade de especializações
                  <S.Input
                    type="number"
                    min={0}
                    {...form.register("quantidade_especializacao", {
                      valueAsNumber: true,
                    })}
                  />
                </S.Field>

                <S.Section>
                  <S.SectionTitle>Titulação e Experiência</S.SectionTitle>
                </S.Section>

                <S.CheckRow>
                  <S.Checkbox {...form.register("possui_mestrado")} />
                  Possui mestrado
                </S.CheckRow>

                <S.CheckRow>
                  <S.Checkbox {...form.register("possui_doutorado")} />
                  Possui doutorado
                </S.CheckRow>

                <S.Field style={{ gridColumn: "1 / -1" }}>
                  Tempo de experiência (meses)
                  <S.Input
                    type="number"
                    min={0}
                    {...form.register("tempo_experiencia_meses", {
                      valueAsNumber: true,
                    })}
                  />
                  <S.Helper>Informe o total em meses (ex.: 24).</S.Helper>
                </S.Field>

                <S.Field style={{ gridColumn: "1 / -1" }}>
                  Observação
                  <S.TextArea
                    rows={4}
                    placeholder="Opcional (até 500 caracteres)."
                    {...form.register("observacao")}
                  />
                </S.Field>
              </S.Grid>
            </S.Fieldset>

            <S.Actions>
              <S.SecondaryButton
                type="button"
                onClick={() => form.reset(defaultValues)}
                disabled={isReadOnly}
              >
                Limpar
              </S.SecondaryButton>

              <S.PrimaryButton
                type="submit"
                disabled={isReadOnly || !selectedVagaId}
                title={!selectedVagaId ? "Selecione uma vaga para salvar" : "Salvar rascunho"}
              >
                {query.data ? "Salvar rascunho" : "Criar inscrição"}
              </S.PrimaryButton>

              <S.PrimaryButton
                type="button"
                onClick={onEnviar}
                disabled={!selectedVagaId || !query.data || isReadOnly || enviarMut.isPending}
                title={
                  !selectedVagaId
                    ? "Selecione uma vaga"
                    : !query.data
                      ? "Salve primeiro para criar a inscrição"
                      : isReadOnly
                        ? "Inscrição não pode ser enviada neste status"
                        : "Enviar inscrição"
                }
              >
                Enviar
              </S.PrimaryButton>
            </S.Actions>

            {(createMut.isError || updateMut.isError) && (
              <S.ErrorBox>
                Erro ao salvar:{" "}
                {((createMut.error || updateMut.error) as any)?.response?.data?.message ??
                  "erro"}
              </S.ErrorBox>
            )}

            {enviarMut.isError && (
              <S.ErrorBox>
                Erro ao enviar:{" "}
                {(enviarMut.error as any)?.response?.data?.message ?? "erro"}
              </S.ErrorBox>
            )}
          </S.Form>
        </S.Card>
      )}
    </S.Page>
  );
}
