import React from "react";
import { InputBase } from "../../../../components/InputBase";
import { SelectBase } from "../../../../components/SelectBase";
import type {
  PerguntaOpcaoResponse,
  PerguntaProcessoResponse,
} from "../../../../api/get-processo-id";

import * as S from "./styles"; // <-- novo

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

type Props = {
  p: PerguntaProcessoResponse;
  value: AnswerValue;
  disabled?: boolean;
  onChangeValue: (next: AnswerValue) => void;
};

export function PerguntaField({
  p,
  value,
  disabled = false,
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

  return (
    <S.FieldCard>
      <S.Header>
        <S.TitleRow>
          <S.Title>{p.titulo}</S.Title>
          {p.obrigatoria ? <S.Required>*</S.Required> : null}
        </S.TitleRow>

        {p.descricao ? <S.Description>{p.descricao}</S.Description> : null}
      </S.Header>

      <S.Body>
        {p.tipo === "BOOLEAN" ? (
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
        ) : null}

        {p.tipo === "NUMERO" ? (
          <InputBase
            id={`p_${idPergunta}`}
            label="Resposta"
            type="number"
            value={valueAsNumber ?? ""}
            disabled={disabled}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const n = safeNumber(e.target.value);
              onChangeValue(n);
            }}
          />
        ) : null}

        {p.tipo === "EXPERIENCIA_DIAS" ? (
          <InputBase
            id={`p_${idPergunta}`}
            label="Dias de experiência"
            type="number"
            placeholder="Ex: 400"
            value={valueAsNumber ?? ""}
            disabled={disabled}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const n = safeNumber(e.target.value);
              onChangeValue(n);
            }}
          />
        ) : null}

        {p.tipo === "TEXTO" ? (
          <InputBase
            label="Resposta"
            value={valueAsString}
            disabled={disabled}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChangeValue(e.target.value)
            }
            maxLength={500}
          />
        ) : null}

        {p.tipo === "SELECT" ? (
          <SelectBase
            label="Selecione"
            id={`p_${idPergunta}`}
            value={typeof value === "string" ? value : ""}
            disabled={disabled}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              onChangeValue(e.target.value)
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
            label=""
            type="date"
            value={
              typeof value === "string" ? (toDateInputValue(value) ?? "") : ""
            }
            disabled={disabled}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChangeValue(safeString(e.target.value) || null)
            }
          />
        ) : null}
      </S.Body>
    </S.FieldCard>
  );
}
