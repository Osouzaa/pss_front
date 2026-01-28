// src/pages/Inscricao/InscricaoPage.tsx
import { useMemo } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

import * as S from "./styles";

import { getProcessoId } from "../../api/get-processo-id";
import type {
  ProcessoSeletivoResponse,
  PerguntaProcessoResponse,
  PerguntaOpcaoResponse,
} from "../../api/get-processo-id";
import { InputBase } from "../../components/InputBase";
import { SelectBase } from "../../components/SelectBase";
import { TextAreaBase } from "../../components/TextAreaBase";

export function InscricaoPage() {
  const { id } = useParams();
  const idProcesso = id ?? "";

  const processoQuery = useQuery<ProcessoSeletivoResponse>({
    queryKey: ["processo-id", idProcesso],
    queryFn: () => {
      if (!idProcesso) throw new Error("Processo inválido");
      return getProcessoId(idProcesso);
    },
    enabled: !!idProcesso,
  });

  const processo = processoQuery.data;

  const perguntas = useMemo(() => {
    const list = processo?.perguntas ?? [];
    return list
      .filter((p) => p.ativa)
      .slice()
      .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));
  }, [processo?.perguntas]);

  if (!idProcesso) return <S.Page>Processo inválido.</S.Page>;
  if (processoQuery.isLoading) return <S.Page>Carregando processo...</S.Page>;

  if (processoQuery.isError || !processo) {
    return (
      <S.Page>
        Não foi possível carregar o processo.{" "}
        {(processoQuery.error as Error)?.message ?? ""}
      </S.Page>
    );
  }

  return (
    <S.Page>
      <S.Header>
        <S.TitleWrap>
          <S.Title>{processo.titulo}</S.Title>
          <S.Subtitle>Perguntas do processo seletivo</S.Subtitle>
        </S.TitleWrap>
      </S.Header>

      <S.Card>
        <S.CardHeader>
          <S.CardHeaderTitle>Perguntas</S.CardHeaderTitle>
          <S.CardHeaderText>
            Abaixo estão todas as perguntas cadastradas neste processo.
          </S.CardHeaderText>
        </S.CardHeader>

        <S.Form onSubmit={(e) => e.preventDefault()}>
          <S.Grid>
            {perguntas.length === 0 ? (
              <S.Helper style={{ gridColumn: "1 / -1" }}>
                Nenhuma pergunta cadastrada para este processo.
              </S.Helper>
            ) : (
              perguntas.map((p) => renderPergunta(p))
            )}
          </S.Grid>
        </S.Form>
      </S.Card>
    </S.Page>
  );

  function renderPergunta(p: PerguntaProcessoResponse) {
    const obrigatorioMark = p.obrigatoria ? " *" : "";

    const opcoesAtivasOrdenadas = (p.opcoes ?? [])
      .filter((o: PerguntaOpcaoResponse) => o.ativa)
      .slice()
      .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));

    const isDisabled = false; // <- como você quer aparecer, deixo habilitado.
    // Se quiser desabilitar quando inativa: const isDisabled = !p.ativa;

    return (
      <div key={p.id_pergunta} style={{ gridColumn: "1 / -1" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
          <b>
            {p.titulo}
            {p.obrigatoria ? (
              <span style={{ fontSize: 12, color: "#DC2626" }}> *</span>
            ) : null}
          </b>

          {!p.ativa ? (
            <span style={{ fontSize: 12, opacity: 0.7 }}>Inativa</span>
          ) : null}
        </div>

        {p.descricao ? (
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>
            {p.descricao}
          </div>
        ) : null}

        <div style={{ marginTop: 10 }}>
          {p.tipo === "BOOLEAN" ? (
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <input
                  type="radio"
                  name={`p_${p.id_pergunta}`}
                  disabled={isDisabled}
                />
                Sim
              </label>

              <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <input
                  type="radio"
                  name={`p_${p.id_pergunta}`}
                  disabled={isDisabled}
                />
                Não
              </label>
            </div>
          ) : null}

          {p.tipo === "NUMERO" ? (
            <InputBase
              id={`p_${p.id_pergunta}`}
              label={`Resposta${obrigatorioMark}`}
              type="number"
              disabled={isDisabled}
              value={""}
              onChange={() => {}}
            />
          ) : null}

          {p.tipo === "TEXTO" ? (
            <TextAreaBase
              label={`Resposta${obrigatorioMark}`}
              disabled={isDisabled}
              value={""}
              onChange={() => {}}
              rows={3}
              maxLength={500}
            />
          ) : null}

          {p.tipo === "SELECT" ? (
            <SelectBase
              label={`Selecione${obrigatorioMark}`}
              id={`p_${p.id_pergunta}`}
              disabled={isDisabled}
              value={""}
              onChange={() => {}}
            >
              <option value="">Selecione</option>
              {opcoesAtivasOrdenadas.map((o) => (
                <option key={o.id_opcao} value={o.id_opcao}>
                  {o.label}
                </option>
              ))}
            </SelectBase>
          ) : null}

          {p.tipo === "DATA" ? (
            <InputBase
              id={`p_${p.id_pergunta}`}
              label={`Data${obrigatorioMark}`}
              type="date"
              disabled={isDisabled}
              value={""}
              onChange={() => {}}
            />
          ) : null}

          {p.tipo === "MULTISELECT" ? (
            <SelectBase
              label={`Selecione${obrigatorioMark}`}
              id={`p_${p.id_pergunta}`}
              disabled={isDisabled}
              value={""}
              onChange={() => {}}
              multiple
            >
              {opcoesAtivasOrdenadas.map((o) => (
                <option key={o.id_opcao} value={o.id_opcao}>
                  {o.label}
                </option>
              ))}
            </SelectBase>
          ) : null}
        </div>
      </div>
    );
  }
}
