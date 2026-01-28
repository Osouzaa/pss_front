import { useMemo, useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import * as S from "./styles";

import { getProcessoId } from "../../api/get-processo-id";
import type {
  ProcessoSeletivoResponse,
  PerguntaProcessoResponse,
  PerguntaOpcaoResponse,
} from "../../api/get-processo-id";

import { SelectBase } from "../../components/SelectBase";
import { TextAreaBase } from "../../components/TextAreaBase";
import { InputBase } from "../../components/InputBase";

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

  const vagas = useMemo(() => processo?.vagas ?? [], [processo?.vagas]);

  const perguntas = useMemo(() => {
    const list = processo?.perguntas ?? [];
    return list
      .filter((p) => p.ativa)
      .slice()
      .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));
  }, [processo?.perguntas]);

  // respostas por pergunta (id_pergunta -> valor)
  const [respostas, setRespostas] = useState<Record<string, any>>({});

  const [idVaga, setIdVaga] = useState("");

  // depois você liga isso com o status da inscrição (RASCUNHO / ENVIADA / etc)
  const isReadOnly = false;

  function renderPergunta(p: PerguntaProcessoResponse) {
    const idPergunta = p.id_pergunta;

    const valor = respostas[idPergunta];

    const obrigatorioMark = p.obrigatoria ? " *" : "";

    const opcoesAtivasOrdenadas = (p.opcoes ?? [])
      .filter((o: PerguntaOpcaoResponse) => o.ativa)
      .slice()
      .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));

    return (
      <div key={idPergunta} style={{ gridColumn: "1 / -1" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
          <b>
            {p.titulo}
            {p.obrigatoria ? (
              <span style={{ fontSize: 12, color: "#DC2626" }}> *</span>
            ) : null}
          </b>
        </div>

        {p.descricao ? (
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>
            {p.descricao}
          </div>
        ) : null}

        <div style={{ marginTop: 10 }}>
          {/* BOOLEAN */}
          {p.tipo === "BOOLEAN" ? (
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <input
                  type="radio"
                  name={`p_${idPergunta}`}
                  disabled={isReadOnly}
                  checked={valor === true}
                  onChange={() =>
                    setRespostas((prev) => ({ ...prev, [idPergunta]: true }))
                  }
                />
                Sim
              </label>

              <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <input
                  type="radio"
                  name={`p_${idPergunta}`}
                  disabled={isReadOnly}
                  checked={valor === false}
                  onChange={() =>
                    setRespostas((prev) => ({ ...prev, [idPergunta]: false }))
                  }
                />
                Não
              </label>
            </div>
          ) : null}

          {/* NUMERO */}
          {p.tipo === "NUMERO" ? (
            <InputBase
              id={`p_${idPergunta}`}
              label={`Resposta${obrigatorioMark}`}
              type="number"
              disabled={isReadOnly}
              value={valor ?? ""}
              onChange={(e: any) =>
                setRespostas((prev) => ({
                  ...prev,
                  [idPergunta]:
                    e.target.value === "" ? "" : Number(e.target.value),
                }))
              }
            />
          ) : null}

          {/* TEXTO */}
          {p.tipo === "TEXTO" ? (
            <TextAreaBase
              label={`Resposta${obrigatorioMark}`}
              disabled={isReadOnly}
              value={valor ?? ""}
              onChange={(e: any) =>
                setRespostas((prev) => ({
                  ...prev,
                  [idPergunta]: e.target.value,
                }))
              }
              rows={3}
              maxLength={500}
            />
          ) : null}

          {/* SELECT */}
          {p.tipo === "SELECT" ? (
            <SelectBase
              label={`Selecione${obrigatorioMark}`}
              id={`p_${idPergunta}`}
              disabled={isReadOnly}
              value={valor ?? ""}
              onChange={(e: any) =>
                setRespostas((prev) => ({
                  ...prev,
                  [idPergunta]: e.target.value,
                }))
              }
            >
              <option value="">Selecione</option>
              {opcoesAtivasOrdenadas.map((o) => (
                <option key={o.id_opcao} value={o.valor}>
                  {o.label}
                </option>
              ))}
            </SelectBase>
          ) : null}

          {/* MULTISELECT */}
          {p.tipo === "MULTISELECT" ? (
            <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
              {opcoesAtivasOrdenadas.map((o) => {
                const arr: string[] = Array.isArray(valor) ? valor : [];
                const checked = arr.includes(o.valor);

                return (
                  <label
                    key={o.id_opcao}
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                  >
                    <input
                      type="checkbox"
                      disabled={isReadOnly}
                      checked={checked}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...arr, o.valor]
                          : arr.filter((v) => v !== o.valor);

                        setRespostas((prev) => ({
                          ...prev,
                          [idPergunta]: next,
                        }));
                      }}
                    />
                    {o.label}
                  </label>
                );
              })}
            </div>
          ) : null}

          {/* DATA */}
          {p.tipo === "DATA" ? (
            <InputBase
              id={`p_${idPergunta}`}
              label={`Data${obrigatorioMark}`}
              type="date"
              disabled={isReadOnly}
              value={valor ?? ""}
              onChange={(e: any) =>
                setRespostas((prev) => ({
                  ...prev,
                  [idPergunta]: e.target.value,
                }))
              }
            />
          ) : null}
        </div>
      </div>
    );
  }

  async function onEnviar() {
    if (!idVaga) {
      toast.error("Selecione uma vaga para enviar.");
      return;
    }

    // aqui você vai enviar pra API depois:
    // - id_processo_seletivo
    // - id_vaga
    // - respostas (por pergunta)
    // - anexos (upload)
    toast.success("OK! (aqui vai chamar a API de envio depois)");
  }

  if (!idProcesso) return <S.Page>Processo inválido.</S.Page>;

  if (processoQuery.isLoading) {
    return <S.Page>Carregando processo...</S.Page>;
  }

  if (processoQuery.isError || !processo) {
    return (
      <S.Page>
        Não foi possível carregar o processo.{" "}
        {(processoQuery.error as Error)?.message ?? ""}
      </S.Page>
    );
  }

  const hasVagas = vagas.length > 0;

  return (
    <S.Page>
      <S.Header>
        <S.TitleWrap>
          <S.Title>Minha inscrição</S.Title>
          <S.Subtitle>
            Selecione a vaga e responda as perguntas do processo.
          </S.Subtitle>
        </S.TitleWrap>
      </S.Header>

      <S.Card>
        <S.CardHeader>
          <S.CardHeaderTitle>Formulário</S.CardHeaderTitle>
          <S.CardHeaderText>
            Preencha os campos e depois envie sua inscrição.
          </S.CardHeaderText>
        </S.CardHeader>

        <S.Form onSubmit={(e) => e.preventDefault()}>
          <S.Fieldset disabled={isReadOnly}>
            <S.Grid>
              {/* =========================
                  VAGA (API)
              ========================= */}
              <div style={{ gridColumn: "1 / -1" }}>
                <SelectBase
                  label="Vaga do processo"
                  id="id_vaga"
                  disabled={isReadOnly}
                  value={idVaga}
                  onChange={(e: any) => setIdVaga(e.target.value)}
                >
                  <option value="" disabled>
                    Selecione uma vaga
                  </option>

                  {vagas.map((v) => (
                    <option key={v.id_vaga} value={v.id_vaga}>
                      {v.nome} ({v.nivel})
                    </option>
                  ))}
                </SelectBase>

                {!hasVagas && (
                  <S.Helper>
                    Nenhuma vaga cadastrada/ativa neste processo. Procure a
                    administração.
                  </S.Helper>
                )}
              </div>

              {/* =========================
                  PERGUNTAS (API)
              ========================= */}
              <S.Section>
                <S.SectionTitle>Perguntas do processo</S.SectionTitle>
              </S.Section>

              {perguntas.length === 0 ? (
                <S.Helper style={{ gridColumn: "1 / -1" }}>
                  Nenhuma pergunta cadastrada para este processo.
                </S.Helper>
              ) : (
                perguntas.map(renderPergunta)
              )}
            </S.Grid>
          </S.Fieldset>

          <S.Actions>
            <S.PrimaryButton
              type="button"
              onClick={onEnviar}
              disabled={!idVaga || !hasVagas}
              title={!idVaga ? "Selecione uma vaga" : "Enviar inscrição"}
            >
              Enviar
            </S.PrimaryButton>
          </S.Actions>
        </S.Form>
      </S.Card>
    </S.Page>
  );
}
