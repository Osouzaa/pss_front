import { useMemo } from "react";
import * as S from "./styles";

type Props = {
  page: number; // 1-based
  total: number; // total de itens
  pageSize: number; // itens por página
  onPageChange: (page: number) => void;

  /** opcionais */
  siblingCount?: number; // quantas páginas ao redor do atual
  showPageSize?: boolean;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  loading?: boolean;
  className?: string;
};

const DOTS = "DOTS" as const;

function range(start: number, end: number) {
  const len = end - start + 1;
  return Array.from({ length: len }, (_, i) => i + start);
}

function usePagination(params: {
  page: number;
  totalPages: number;
  siblingCount: number;
}) {
  const { page, totalPages, siblingCount } = params;

  return useMemo(() => {
    if (totalPages <= 1) return [1];

    const totalPageNumbers = siblingCount + 5; // first + last + current + 2*dots + siblings
    if (totalPageNumbers >= totalPages) return range(1, totalPages);

    const leftSiblingIndex = Math.max(page - siblingCount, 1);
    const rightSiblingIndex = Math.min(page + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);
      return [...leftRange, DOTS, lastPageIndex];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [firstPageIndex, DOTS, ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }

    return range(1, totalPages);
  }, [page, totalPages, siblingCount]);
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function Pagination({
  page,
  total,
  pageSize,
  onPageChange,
  siblingCount = 1,
  showPageSize = false,
  pageSizeOptions = [10, 20, 50, 100],
  onPageSizeChange,
  loading = false,
  className,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = clamp(page, 1, totalPages);

  const items = usePagination({
    page: safePage,
    totalPages,
    siblingCount,
  });

  const from = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(total, safePage * pageSize);

  const canPrev = safePage > 1 && !loading;
  const canNext = safePage < totalPages && !loading;

  function go(p: number) {
    const next = clamp(p, 1, totalPages);
    if (next !== safePage) onPageChange(next);
  }

  return (
    <S.Wrapper className={className} aria-label="Paginação">
      <S.Left>
        <S.Info aria-live="polite">
          {total > 0 ? (
            <>
              Mostrando <strong>{from}</strong>–<strong>{to}</strong> de{" "}
              <strong>{total}</strong>
            </>
          ) : (
            <>Nenhum registro</>
          )}
        </S.Info>

        {showPageSize && (
          <S.PageSize>
            <S.PageSizeLabel>Itens por página</S.PageSizeLabel>
            <S.Select
              value={String(pageSize)}
              disabled={loading}
              onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </S.Select>
          </S.PageSize>
        )}
      </S.Left>

      <S.Right>
        <S.Nav aria-label="Navegação de páginas">
          <S.IconButton
            type="button"
            onClick={() => go(safePage - 1)}
            disabled={!canPrev}
            aria-label="Página anterior"
          >
            ‹
          </S.IconButton>

          <S.Pages role="list">
            {items.map((it, idx) => {
              if (it === DOTS) {
                return (
                  <S.Dots key={`dots-${idx}`} aria-hidden="true">
                    …
                  </S.Dots>
                );
              }

              const p = it as number;
              const active = p === safePage;

              return (
                <S.PageButton
                  key={p}
                  type="button"
                  onClick={() => go(p)}
                  $active={active}
                  disabled={loading}
                  aria-current={active ? "page" : undefined}
                  aria-label={`Ir para página ${p}`}
                >
                  {p}
                </S.PageButton>
              );
            })}
          </S.Pages>

          <S.IconButton
            type="button"
            onClick={() => go(safePage + 1)}
            disabled={!canNext}
            aria-label="Próxima página"
          >
            ›
          </S.IconButton>
        </S.Nav>

        <S.Meta>
          <S.Badge aria-label="Página atual">
            Página <strong>{safePage}</strong> de <strong>{totalPages}</strong>
          </S.Badge>

          <S.Jump>
            <S.JumpLabel>Ir</S.JumpLabel>
            <S.JumpInput
              inputMode="numeric"
              pattern="[0-9]*"
              value={String(safePage)}
              disabled={loading}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, "");
                if (!raw) return;
                const n = Number(raw);
                if (!Number.isFinite(n)) return;
                go(n);
              }}
              onBlur={(e) => {
                if (!e.target.value) go(1);
              }}
              aria-label="Ir para página"
            />
          </S.Jump>
        </S.Meta>
      </S.Right>
    </S.Wrapper>
  );
}
