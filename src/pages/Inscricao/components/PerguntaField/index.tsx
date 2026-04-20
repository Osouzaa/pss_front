import React from "react";
import { FiCheck, FiAlertCircle } from "react-icons/fi";
import { Star } from "lucide-react";
import { InputBase } from "../../../../components/InputBase";
import { SelectBase } from "../../../../components/SelectBase";
import type {
  PerguntaOpcaoResponse,
  PerguntaProcessoResponse,
  NivelVaga,
} from "../../../../api/get-processo-id";

import * as S from "./styles";

type AnswerValue = boolean | number | string | null;

function safeString(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function safeNumber(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v)))
    return Number(v);
  return null;
}

export function toDateInputValue(v?: string | null): string | null {
  if (!v) return null;
  if (v.includes("T")) return v.slice(0, 10);
  return v;
}

function perguntaRequerComprovante(p: PerguntaProcessoResponse): {
  required: boolean;
  label: string | null;
} {
  const anyP = p as any;

  const required = Boolean(
    anyP?.exige_comprovante ??
      anyP?.exigeComprovante ??
      anyP?.comprovante_obrigatorio ??
      anyP?.comprovanteObrigatorio ??
      anyP?.anexo_obrigatorio ??
      anyP?.anexoObrigatorio ??
      anyP?.requer_anexo ??
      anyP?.requerAnexo,
  );

  const labelRaw =
    anyP?.label_comprovante ??
    anyP?.labelComprovante ??
    anyP?.texto_comprovante ??
    anyP?.textoComprovante ??
    anyP?.descricao_comprovante ??
    anyP?.descricaoComprovante ??
    null;

  const label =
    typeof labelRaw === "string" && labelRaw.trim() ? labelRaw.trim() : null;

  return { required, label };
}

function isAnswered(value: AnswerValue): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim() !== "";
  if (typeof value === "number") return true;
  if (typeof value === "boolean") return true;
  return false;
}

function calcPontos(p: PerguntaProcessoResponse, nivel: NivelVaga | null): { pts: number; variavel: boolean } | null {
  if (!nivel) return null;

  const pick = (m: number | null | undefined, s: number | null | undefined) => {
    if (nivel === "MEDIO") return Number(m ?? 0);
    return Number(s ?? 0);
  };

  if (p.tipo === "BOOLEAN") {
    const pts = pick(p.pontuacao_medio, p.pontuacao_superior);
    return pts > 0 ? { pts, variavel: false } : null;
  }

  if (p.tipo === "SELECT") {
    const ativas = (p.opcoes ?? []).filter((o) => o.ativa);
    const max = Math.max(0, ...ativas.map((o) =>
      pick(o.valor_medio, o.valor_superior)
    ));
    return max > 0 ? { pts: max, variavel: true } : null;
  }

  if (p.tipo === "EXPERIENCIA_DIAS") {
    try {
      const regra = JSON.parse(p.regra_json ?? "null");
      if (regra?.tipo === "FAIXAS_DIAS" && Array.isArray(regra.faixas)) {
        const max = Math.max(0, ...regra.faixas.map((f: any) =>
          nivel === "MEDIO" ? Number(f.medio ?? 0) : Number(f.superior ?? 0)
        ));
        return max > 0 ? { pts: max, variavel: true } : null;
      }
    } catch {
      return null;
    }
  }

  return null;
}

type Props = {
  p: PerguntaProcessoResponse;
  index: number;
  value: AnswerValue;
  disabled?: boolean;
  docTipos?: string[];
  nivel?: NivelVaga | null;
  onChangeValue: (next: AnswerValue) => void;
};

export function PerguntaField({
  p,
  index,
  value,
  disabled = false,
  docTipos = [],
  nivel = null,
  onChangeValue,
}: Props) {
  const idPergunta = p.id_pergunta;

  const opcoesAtivasOrdenadas = (p.opcoes ?? [])
    .filter((o: PerguntaOpcaoResponse) => o.ativa)
    .slice()
    .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));

  const valueAsString = typeof value === "string" ? value : "";
  const valueAsNumber = typeof value === "number" ? value : null;
  const valueAsBoolean = typeof value === "boolean" ? value : null;

  const { required: needsAttachment, label: attachmentLabelFromApi } =
    perguntaRequerComprovante(p);

  const attachmentLabel = attachmentLabelFromApi ?? "comprovante de confirmação";

  const docAnexado =
    needsAttachment && attachmentLabelFromApi
      ? docTipos.includes(attachmentLabelFromApi)
      : false;

  const descricao =
    typeof p.descricao === "string" && p.descricao.trim()
      ? p.descricao.trim()
      : null;

  const answered = isAnswered(value);
  const pontosInfo = calcPontos(p, nivel ?? null);

  return (
    <S.Card $answered={answered}>
      <S.Header>
        <S.NumberBadge>{String(index).padStart(2, "0")}</S.NumberBadge>

        <S.TitleArea>
          <S.TitleRow>
            <S.Title>{p.titulo}</S.Title>
            {p.obrigatoria ? <S.Required>*</S.Required> : null}
            {pontosInfo && (
              <S.PointsBadge>
                <Star size={10} />
                {pontosInfo.variavel ? `até ${pontosInfo.pts} pts` : `${pontosInfo.pts} pts`}
              </S.PointsBadge>
            )}
          </S.TitleRow>

          {needsAttachment ? (
            <S.AttachmentStatus $ok={docAnexado}>
              {docAnexado ? (
                <>
                  <FiCheck size={12} />
                  Comprovante já enviado
                </>
              ) : (
                <>
                  <FiAlertCircle size={12} />
                  Anexar: {attachmentLabel}
                </>
              )}
            </S.AttachmentStatus>
          ) : null}

          {descricao ? <S.Description>{descricao}</S.Description> : null}
        </S.TitleArea>
      </S.Header>

      <S.Body>
        {p.tipo === "BOOLEAN" && (
          <S.BooleanGroup>
            <S.BooleanOption
              $disabled={disabled}
              $active={valueAsBoolean === true}
            >
              <input
                disabled={disabled}
                type="radio"
                name={`p_${idPergunta}`}
                checked={valueAsBoolean === true}
                onChange={() => onChangeValue(true)}
              />
              <span>Sim</span>
            </S.BooleanOption>

            <S.BooleanOption
              $disabled={disabled}
              $active={valueAsBoolean === false}
            >
              <input
                disabled={disabled}
                type="radio"
                name={`p_${idPergunta}`}
                checked={valueAsBoolean === false}
                onChange={() => onChangeValue(false)}
              />
              <span>Não</span>
            </S.BooleanOption>
          </S.BooleanGroup>
        )}

        {p.tipo === "NUMERO" && (
          <InputBase
            id={`p_${idPergunta}`}
            type="number"
            value={valueAsNumber ?? ""}
            disabled={disabled}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              onChangeValue(safeNumber(e.target.value));
            }}
          />
        )}

        {p.tipo === "EXPERIENCIA_DIAS" && (
          <>
            <InputBase
              id={`p_${idPergunta}`}
              type="number"
              placeholder="Ex: 400"
              value={valueAsNumber ?? ""}
              disabled={disabled}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                onChangeValue(safeNumber(e.target.value));
              }}
            />
            <S.DaysHelper>Informe o total de dias trabalhados</S.DaysHelper>
          </>
        )}

        {p.tipo === "TEXTO" && (
          <InputBase
            value={valueAsString}
            disabled={disabled}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChangeValue(e.target.value)
            }
            maxLength={500}
          />
        )}

        {p.tipo === "SELECT" && (
          <SelectBase
            id={`p_${idPergunta}`}
            value={valueAsString}
            disabled={disabled}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              onChangeValue(e.target.value || null)
            }
          >
            <option value="">Selecione</option>
            {opcoesAtivasOrdenadas.map((o) => (
              <option key={o.id_opcao} value={o.id_opcao}>
                {o.label}
              </option>
            ))}
          </SelectBase>
        )}

        {p.tipo === "DATA" && (
          <InputBase
            id={`p_${idPergunta}`}
            type="date"
            value={
              typeof value === "string" ? (toDateInputValue(value) ?? "") : ""
            }
            disabled={disabled}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChangeValue(safeString(e.target.value) || null)
            }
          />
        )}
      </S.Body>
    </S.Card>
  );
}
