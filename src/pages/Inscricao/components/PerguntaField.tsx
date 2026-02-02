import React from "react";
import { InputBase } from "../../../components/InputBase";
import { SelectBase } from "../../../components/SelectBase";
import type {
  PerguntaOpcaoResponse,
  PerguntaProcessoResponse,
} from "../../../api/get-processo-id";

import * as S from "../styles";

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

// ✅ regra: o comprovante está na PERGUNTA (qualquer tipo)
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

  const { required: needsAttachment, label: attachmentLabelFromApi } =
    perguntaRequerComprovante(p);

  const attachmentLabel =
    attachmentLabelFromApi ?? "Esta pergunta exige anexo de confirmação.";

  return (
    <S.FieldCard>
      <S.HeaderPerguntas>
        <S.TitleRow>
          <S.TitleInput>{p.titulo}</S.TitleInput>

          {p.obrigatoria ? <S.Required>*</S.Required> : null}

          {/* ✅ aparece em QUALQUER pergunta */}
          {needsAttachment ? (
            <S.AttachmentBadge>
              Anexo obrigatório : {attachmentLabel}
            </S.AttachmentBadge>
          ) : null}
        </S.TitleRow>
      </S.HeaderPerguntas>

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
