import { useState } from "react";
import * as S from "../styles";

type AvaliacaoResultado = "APROVADO" | "REPROVADO";

interface ModalAvaliacaoSectionProps {
  avaliacaoResultado?: AvaliacaoResultado | null;
  motivoReprovacao: string;
  dataAvaliacao?: string | null;
  classificacaoAntesReprovacao?: number | null;
  decisaoPendente: AvaliacaoResultado | null;
  statusProcesso?: string | null;
  isPending: boolean;
  isError: boolean;
  onAprovar: () => void;
  onReprovar: () => void;
  onConfirmar: () => void;
  onCancelar: () => void;
  onChangeMotivoReprovacao: (value: string) => void;
  onEditar: () => void;
}

function formatDateTimeBR(v?: string | null) {
  if (!v) return "—";
  const dt = new Date(v);
  if (Number.isNaN(dt.getTime())) return "—";
  return dt.toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ModalAvaliacaoSection({
  avaliacaoResultado,
  motivoReprovacao,
  dataAvaliacao,
  classificacaoAntesReprovacao,
  decisaoPendente,
  statusProcesso,
  isPending,
  isError,
  onAprovar,
  onReprovar,
  onConfirmar,
  onCancelar,
  onChangeMotivoReprovacao,
  onEditar,
}: ModalAvaliacaoSectionProps) {
  const [editando, setEditando] = useState(false);

  const jaAvaliado =
    avaliacaoResultado === "APROVADO" || avaliacaoResultado === "REPROVADO";

  const processoEncerrado =
    (statusProcesso ?? "").toUpperCase() === "ENCERRADO";

  // ── já avaliado e não está editando ──
  if (jaAvaliado && !editando && !decisaoPendente) {
    return (
      <S.AvaliacaoBox $decisao={avaliacaoResultado!}>
        <strong>
          {avaliacaoResultado === "APROVADO" ? "✓ Aprovado" : "✕ Reprovado"}
        </strong>{" "}
        — esta inscrição já foi avaliada.

        {motivoReprovacao && (
          <S.MotivoReprovacao>
            <strong>Motivo:</strong> {motivoReprovacao}
          </S.MotivoReprovacao>
        )}

        {avaliacaoResultado === "REPROVADO" && classificacaoAntesReprovacao && (
          <S.MotivoReprovacao>
            <strong>Posição antes da reprovação:</strong> #{classificacaoAntesReprovacao}
          </S.MotivoReprovacao>
        )}

        {dataAvaliacao && (
          <S.MotivoReprovacao>
            <strong>Avaliado em:</strong> {formatDateTimeBR(dataAvaliacao)}
          </S.MotivoReprovacao>
        )}

        {processoEncerrado && (
          <S.AvaliacaoBtns style={{ marginTop: "0.75rem" }}>
            <S.Button
              type="button"
              $variant="ghost"
              onClick={() => {
                setEditando(true);
                onEditar();
              }}
            >
              ✎ Alterar avaliação
            </S.Button>
          </S.AvaliacaoBtns>
        )}
      </S.AvaliacaoBox>
    );
  }

  // ── confirmação pendente ──
  if (decisaoPendente) {
    const isReprovando = decisaoPendente === "REPROVADO";
    const podeConfirmar = !isReprovando || motivoReprovacao.trim().length > 0;

    return (
      <S.AvaliacaoBox $decisao={decisaoPendente}>
        <S.AvaliacaoConfirmText>
          Confirmar{" "}
          <strong>{isReprovando ? "reprovação" : "aprovação"}</strong> desta
          inscrição?
        </S.AvaliacaoConfirmText>

        {isReprovando && (
          <S.MotivoTextarea
            placeholder="Informe o motivo da reprovação (obrigatório)..."
            value={motivoReprovacao}
            onChange={(e) => onChangeMotivoReprovacao(e.target.value)}
            rows={3}
            disabled={isPending}
          />
        )}

        {isError && <S.ErrorBox>Erro ao salvar. Tente novamente.</S.ErrorBox>}

        <S.AvaliacaoBtns>
          <S.Button
            type="button"
            $variant="ghost"
            onClick={() => {
              setEditando(false);
              onCancelar();
            }}
            disabled={isPending}
          >
            Cancelar
          </S.Button>
          <S.Button
            type="button"
            $variant={isReprovando ? "danger" : "primary"}
            disabled={isPending || !podeConfirmar}
            onClick={() => {
              setEditando(false);
              onConfirmar();
            }}
          >
            {isPending ? "Salvando..." : "Confirmar"}
          </S.Button>
        </S.AvaliacaoBtns>
      </S.AvaliacaoBox>
    );
  }

  // ── botões de ação (primeira avaliação ou após clicar em "Alterar") ──
  if (!processoEncerrado) {
    return (
      <S.Muted style={{ fontSize: "0.8125rem" }}>
        A avaliação estará disponível após o encerramento do processo seletivo.
      </S.Muted>
    );
  }

  return (
    <S.AvaliacaoBtns>
      <S.Button type="button" $variant="danger" onClick={onReprovar}>
        ✕ Reprovar
      </S.Button>
      <S.Button type="button" $variant="primary" onClick={onAprovar}>
        ✓ Aprovar
      </S.Button>
    </S.AvaliacaoBtns>
  );
}