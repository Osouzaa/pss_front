import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import * as S from "./styles";
import { getProcessoId } from "../../api/get-processo-id";
import type {
  ProcessoSeletivoResponse,
  PerguntaProcessoResponse,
  PerguntaOpcaoResponse,
  VagaProcessoSeletivoResponse,
} from "../../api/get-processo-id";

import { InputBase } from "../../components/InputBase";
import { SelectBase } from "../../components/SelectBase";
import { TextAreaBase } from "../../components/TextAreaBase";

import { getRespostasByInscricao } from "../../api/inscricao-respostas";
import { salvarRespostasLote } from "../../api/salvar-lote";
import { enviarInscricaoTwo } from "../../api/enviar-inscricao";

type RespostasState = Record<
  string,
  boolean | number | string | null | undefined
>;

export function InscricaoPage() {
  const { id, id_inscricao } = useParams();
  const idProcesso = id ?? "";
  const idInscricao = id_inscricao ?? "";

  const [idVaga, setIdVaga] = useState("");
  const [respostas, setRespostas] = useState<RespostasState>({});

  const hydratedRef = useRef(false);

  const processoQuery = useQuery<ProcessoSeletivoResponse>({
    queryKey: ["processo-id", idProcesso],
    queryFn: () => {
      if (!idProcesso) throw new Error("Processo inválido");
      return getProcessoId(idProcesso);
    },
    enabled: !!idProcesso,
  });

  const processo = processoQuery.data;

  const vagas = useMemo(() => {
    const list = processo?.vagas ?? [];
    return list.slice().sort((a, b) => a.nome.localeCompare(b.nome));
  }, [processo?.vagas]);

  const perguntas = useMemo(() => {
    const list = processo?.perguntas ?? [];
    return list
      .filter((p) => p.ativa)
      .slice()
      .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));
  }, [processo?.perguntas]);

  const respostasQuery = useQuery({
    queryKey: ["respostas-inscricao", idInscricao],
    queryFn: () => getRespostasByInscricao(idInscricao),
    enabled: !!idInscricao,
  });

  // ✅ hidratar estado UMA vez
  useEffect(() => {
    if (!respostasQuery.data) return;
    if (hydratedRef.current) return;

    const map: RespostasState = {};
    for (const r of respostasQuery.data) {
      if (r.opcao_id) map[r.id_pergunta] = r.opcao_id;
      else if (r.valor_boolean !== null && r.valor_boolean !== undefined)
        map[r.id_pergunta] = r.valor_boolean;
      else if (r.valor_numero !== null && r.valor_numero !== undefined)
        map[r.id_pergunta] = r.valor_numero;
      else if (r.valor_texto !== null && r.valor_texto !== undefined)
        map[r.id_pergunta] = r.valor_texto;
      else if (r.valor_data) map[r.id_pergunta] = r.valor_data;
      else map[r.id_pergunta] = undefined;
    }

    setRespostas(map);
    hydratedRef.current = true;
  }, [respostasQuery.data]);

  // ✅ se a inscrição já tem vaga salva no backend, preencha o select automaticamente
  // (só funciona se o endpoint do processo/inscrição retornar isso;
  // se não retorna, ignore esta parte)
  useEffect(() => {
    // se você tiver um endpoint "getInscricao" com id_vaga, aqui seria ideal.
    // por enquanto: se quiser, você pode deixar o usuário escolher sempre.
  }, []);

  const salvarMut = useMutation({
    mutationFn: (body: any) => salvarRespostasLote(idInscricao, body),
    onError: (e: any) => {
      toast.error(e?.response?.data?.message ?? "Erro ao salvar respostas.");
    },
  });

  function buildPayload() {
    return {
      respostas: perguntas.map((p) => {
        const v = respostas[p.id_pergunta];

        if (p.tipo === "BOOLEAN") {
          return {
            id_pergunta: p.id_pergunta,
            valor_boolean: typeof v === "boolean" ? v : null,
          };
        }

        // ✅ NUMERO e EXPERIENCIA_DIAS usam valor_numero
        if (p.tipo === "NUMERO" || p.tipo === "EXPERIENCIA_DIAS") {
          return {
            id_pergunta: p.id_pergunta,
            valor_numero: typeof v === "number" ? v : null,
          };
        }

        if (p.tipo === "TEXTO") {
          return {
            id_pergunta: p.id_pergunta,
            valor_texto: typeof v === "string" ? v : "",
          };
        }

        if (p.tipo === "DATA") {
          return {
            id_pergunta: p.id_pergunta,
            valor_data: typeof v === "string" ? v : null,
          };
        }

        if (p.tipo === "SELECT") {
          return {
            id_pergunta: p.id_pergunta,
            opcao_id: typeof v === "string" && v ? v : null,
          };
        }

        return { id_pergunta: p.id_pergunta };
      }),
    };
  }

  const enviarMut = useMutation({
    mutationFn: () => enviarInscricaoTwo(idInscricao, { id_vaga: idVaga }),
    onSuccess: () => toast.success("Inscrição enviada com sucesso!"),
    onError: (e: any) =>
      toast.error(e?.response?.data?.message ?? "Erro ao enviar inscrição."),
  });

  async function handleFinalizar() {
    if (!idVaga) {
      toast.error("Selecione uma vaga antes de finalizar.");
      return;
    }

    if (!idInscricao) {
      toast.error("Inscrição inválida.");
      return;
    }

    try {
      await salvarMut.mutateAsync(buildPayload());
      await enviarMut.mutateAsync();
    } catch {
      // erros tratados no onError
    }
  }

  if (!idProcesso) return <S.Page>Processo inválido.</S.Page>;
  if (processoQuery.isLoading) return <S.Page>Carregando processo...</S.Page>;
  if (respostasQuery.isLoading) return <S.Page>Carregando respostas...</S.Page>;

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
          <S.Subtitle>Responda as perguntas do processo.</S.Subtitle>
        </S.TitleWrap>
      </S.Header>

      <S.Card>
        <S.CardHeader>
          <S.CardHeaderTitle>Formulário</S.CardHeaderTitle>
          <S.CardHeaderText>
            Suas respostas são salvas automaticamente.
          </S.CardHeaderText>
        </S.CardHeader>

        <S.Form onSubmit={(e) => e.preventDefault()}>
          <S.Grid>
            <div style={{ gridColumn: "1 / -1" }}>
              <SelectBase
                label="Vaga do processo"
                id="id_vaga"
                value={idVaga}
                onChange={(e: any) => setIdVaga(e.target.value)}
              >
                <option value="" disabled>
                  Selecione uma vaga
                </option>

                {vagas.map((v: VagaProcessoSeletivoResponse) => (
                  <option key={v.id_vaga} value={v.id_vaga}>
                    {v.nome} ({v.nivel}) • {v.quantidade_de_vagas} vaga(s)
                  </option>
                ))}
              </SelectBase>
            </div>

            <S.Section>
              <S.SectionTitle>Perguntas</S.SectionTitle>
            </S.Section>

            {perguntas.map((p) => renderPergunta(p))}
          </S.Grid>

          <div
            style={{
              marginTop: 16,
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
            }}
          >
            <button
              type="button"
              onClick={handleFinalizar}
              disabled={!idVaga || salvarMut.isPending || enviarMut.isPending}
              title={!idVaga ? "Selecione uma vaga" : "Finalizar inscrição"}
            >
              {enviarMut.isPending ? "Finalizando..." : "Finalizar inscrição"}
            </button>
          </div>
        </S.Form>
      </S.Card>
    </S.Page>
  );

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
        <b>
          {p.titulo}
          {p.obrigatoria ? (
            <span style={{ fontSize: 12, color: "#DC2626" }}> *</span>
          ) : null}
        </b>

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
                  name={`p_${idPergunta}`}
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
                  checked={valor === false}
                  onChange={() =>
                    setRespostas((prev) => ({ ...prev, [idPergunta]: false }))
                  }
                />
                Não
              </label>
            </div>
          ) : null}

          {p.tipo === "NUMERO" ? (
            <InputBase
              id={`p_${idPergunta}`}
              label={`Resposta${obrigatorioMark}`}
              type="number"
              value={typeof valor === "number" ? valor : ""}
              onChange={(e: any) =>
                setRespostas((prev) => ({
                  ...prev,
                  [idPergunta]:
                    e.target.value === "" ? null : Number(e.target.value),
                }))
              }
            />
          ) : null}

          {p.tipo === "TEXTO" ? (
            <TextAreaBase
              label={`Resposta${obrigatorioMark}`}
              value={typeof valor === "string" ? valor : ""}
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

          {p.tipo === "EXPERIENCIA_DIAS" ? (
            <InputBase
              id={`p_${idPergunta}`}
              label={`Dias de experiência${obrigatorioMark}`}
              type="number"
              placeholder="Ex: 400"
              value={typeof valor === "number" ? valor : ""}
              onChange={(e: any) =>
                setRespostas((prev) => ({
                  ...prev,
                  [idPergunta]:
                    e.target.value === "" ? null : Number(e.target.value),
                }))
              }
            />
          ) : null}

          {p.tipo === "SELECT" ? (
            <SelectBase
              label={`Selecione${obrigatorioMark}`}
              id={`p_${idPergunta}`}
              value={typeof valor === "string" ? valor : ""}
              onChange={(e: any) =>
                setRespostas((prev) => ({
                  ...prev,
                  [idPergunta]: e.target.value,
                }))
              }
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
              id={`p_${idPergunta}`}
              label={`Data${obrigatorioMark}`}
              type="date"
              value={typeof valor === "string" ? valor : ""}
              onChange={(e: any) =>
                setRespostas((prev) => ({
                  ...prev,
                  [idPergunta]: e.target.value || null,
                }))
              }
            />
          ) : null}
        </div>
      </div>
    );
  }
}
