import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
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

import { salvarRespostasLote } from "../../api/salvar-lote";
import { enviarInscricaoTwo } from "../../api/enviar-inscricao";
import { iniciarInscricao } from "../../api/iniciar-inscricao";
import { getInscricaoById } from "../../api/get-inscricao-by-id"; // ✅ CRIAR

type RespostasState = Record<
  string,
  boolean | number | string | null | undefined
>;

export function InscricaoPage() {
  const navigate = useNavigate();
  const { id, id_inscricao } = useParams();

  const idProcesso = id ?? "";
  const [idInscricao, setIdInscricao] = useState(id_inscricao ?? "");
  const [idVaga, setIdVaga] = useState("");
  const [readonly, setReadonly] = useState(false);

  const [respostas, setRespostas] = useState<RespostasState>({});
  const hydratedRef = useRef(false);

  // ✅ 1) Processo (vagas + perguntas)
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

  // ✅ 2) Quando existe inscrição, carregar inscrição + respostas + vaga
  const inscricaoQuery = useQuery({
    queryKey: ["inscricao", idProcesso, idInscricao],
    queryFn: () => getInscricaoById(idProcesso, idInscricao),
    enabled: !!idProcesso && !!idInscricao,
  });

  // ✅ reset por inscrição
  useEffect(() => {
    hydratedRef.current = false;
    setRespostas({});
    setReadonly(false);
  }, [idInscricao]);

  // ✅ hidrata a partir do endpoint da inscrição (melhor que buscar respostas separado)
  useEffect(() => {
    if (!inscricaoQuery.data) return;
    if (hydratedRef.current) return;

    const { inscricao, respostas } = inscricaoQuery.data as any;

    // seta vaga e readonly
    setIdVaga(inscricao?.id_vaga ?? "");
    setReadonly(!!inscricao?.readonly || inscricao?.status === "ENVIADA");

    const map: RespostasState = {};
    for (const r of respostas ?? []) {
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
  }, [inscricaoQuery.data]);

  // ✅ 3) Iniciar inscrição (cria/retorna a inscrição daquela vaga)
  const iniciarMut = useMutation({
    mutationFn: (body: { id_processo_seletivo: string; id_vaga: string }) =>
      iniciarInscricao(body),
    onError: (e: any) => {
      toast.error(e?.response?.data?.message ?? "Erro ao iniciar inscrição.");
    },
  });

  async function handleIniciar() {
    if (!idVaga) return toast.error("Selecione uma vaga para iniciar.");

    try {
      const resp = await iniciarMut.mutateAsync({
        id_processo_seletivo: idProcesso,
        id_vaga: idVaga,
      });

      const newId = (resp as any)?.id_inscricao;
      if (!newId) return toast.error("Backend não retornou id_inscricao.");

      setIdInscricao(newId);

      navigate(`/processos/${idProcesso}/inscricao/${newId}`, {
        replace: true,
      });

      toast.success("Inscrição iniciada!");
    } catch {
      // erro já tratado
    }
  }

  // ✅ 4) Salvar/Enviar
  const salvarMut = useMutation({
    mutationFn: (body: any) => salvarRespostasLote(idInscricao, body),
    onError: (e: any) =>
      toast.error(e?.response?.data?.message ?? "Erro ao salvar respostas."),
  });

  function buildPayload() {
    return {
      respostas: perguntas.map((p) => {
        const v = respostas[p.id_pergunta];

        if (p.tipo === "BOOLEAN")
          return {
            id_pergunta: p.id_pergunta,
            valor_boolean: typeof v === "boolean" ? v : null,
          };

        if (p.tipo === "NUMERO" || p.tipo === "EXPERIENCIA_DIAS")
          return {
            id_pergunta: p.id_pergunta,
            valor_numero: typeof v === "number" ? v : null,
          };

        if (p.tipo === "TEXTO")
          return {
            id_pergunta: p.id_pergunta,
            valor_texto: typeof v === "string" ? v : "",
          };

        if (p.tipo === "DATA")
          return {
            id_pergunta: p.id_pergunta,
            valor_data: typeof v === "string" ? v : null,
          };

        if (p.tipo === "SELECT")
          return {
            id_pergunta: p.id_pergunta,
            opcao_id: typeof v === "string" && v ? v : null,
          };

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
    if (!idVaga) return toast.error("Selecione uma vaga.");
    if (!idInscricao) return toast.error("Inicie a inscrição primeiro.");
    if (readonly)
      return toast.error(
        "Esta inscrição já foi enviada e não pode ser alterada.",
      );

    try {
      await salvarMut.mutateAsync(buildPayload());
      await enviarMut.mutateAsync();
    } catch {}
  }

  // ✅ Loading states
  if (!idProcesso) return <S.Page>Processo inválido.</S.Page>;
  if (processoQuery.isLoading) return <S.Page>Carregando processo...</S.Page>;
  if (processoQuery.isError || !processo)
    return <S.Page>Não foi possível carregar o processo.</S.Page>;

  if (idInscricao && inscricaoQuery.isLoading)
    return <S.Page>Carregando inscrição...</S.Page>;

  const iniciou = !!idInscricao;

  return (
    <S.Page>
      <S.Header>
        <S.TitleWrap>
          <S.Title>{processo.titulo}</S.Title>
          <S.Subtitle>Escolha a vaga e preencha as perguntas.</S.Subtitle>
        </S.TitleWrap>
      </S.Header>

      <S.Card>
        <S.CardHeader>
          <S.CardHeaderTitle>Inscrição</S.CardHeaderTitle>
          <S.CardHeaderText>
            {iniciou
              ? readonly
                ? "Inscrição enviada (somente leitura)."
                : "Você já pode responder e finalizar."
              : "Selecione a vaga e clique em iniciar."}
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
                disabled={iniciou} // ✅ depois que cria a inscrição, não deixa trocar
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

              {!iniciou ? (
                <div
                  style={{
                    marginTop: 12,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    type="button"
                    onClick={handleIniciar}
                    disabled={!idVaga || iniciarMut.isPending}
                  >
                    {iniciarMut.isPending
                      ? "Iniciando..."
                      : "Iniciar inscrição"}
                  </button>
                </div>
              ) : null}
            </div>

            {iniciou ? (
              <>
                <S.Section>
                  <S.SectionTitle>Perguntas</S.SectionTitle>
                </S.Section>

                {perguntas.map((p) => renderPergunta(p))}
              </>
            ) : null}
          </S.Grid>

          {iniciou && !readonly ? (
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
                disabled={salvarMut.isPending || enviarMut.isPending}
              >
                {enviarMut.isPending ? "Finalizando..." : "Finalizar inscrição"}
              </button>
            </div>
          ) : null}
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

    const disabled = readonly;

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
              <label
                style={{
                  display: "flex",
                  gap: 6,
                  alignItems: "center",
                  opacity: disabled ? 0.6 : 1,
                }}
              >
                <input
                  disabled={disabled}
                  type="radio"
                  name={`p_${idPergunta}`}
                  checked={valor === true}
                  onChange={() =>
                    setRespostas((prev) => ({ ...prev, [idPergunta]: true }))
                  }
                />
                Sim
              </label>

              <label
                style={{
                  display: "flex",
                  gap: 6,
                  alignItems: "center",
                  opacity: disabled ? 0.6 : 1,
                }}
              >
                <input
                  disabled={disabled}
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
              disabled={disabled}
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
              disabled={disabled}
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
              disabled={disabled}
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
              disabled={disabled}
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
              disabled={disabled}
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
