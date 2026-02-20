import { useEffect, useMemo, useRef, useState } from "react";
import { FiChevronDown, FiX, FiSearch } from "react-icons/fi";
import * as S from "./styles";

export type OptionBase = {
  value: string | number;
  label: string;
  description?: string;
  disabled?: boolean;
};

type Props<T extends OptionBase> = {
  id?: string;
  label?: string;
  placeholder?: string;

  options: T[];
  value?: T["value"] | null;
  onChange: (value: T["value"] | null, option?: T) => void;

  disabled?: boolean;
  loading?: boolean;

  /** mostra botão limpar quando tiver valor */
  clearable?: boolean;

  /** filtra por label/description. Por padrão, contains case-insensitive */
  filterFn?: (option: T, term: string) => boolean;

  /** erro/ajuda (igual InputBase) */
  error?: string;
  helperText?: string;

  /** exibe quantos resultados */
  showCount?: boolean;

  /** ✅ (opcional) notifica o termo digitado para busca remota (backend) */
  onSearch?: (term: string) => void;
};

export function InputSelectFilter<T extends OptionBase>({
  id,
  label,
  placeholder = "Digite para buscar...",
  options,
  value,
  onChange,
  disabled,
  loading,
  clearable = true,
  filterFn,
  error,
  helperText,
  showCount = true,

  onSearch, // ✅ NOVO
}: Props<T>) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const selectedOption = useMemo(
    () => options.find((o) => o.value === value) ?? null,
    [options, value]
  );

  const internalFilterFn = useMemo(() => {
    return (
      filterFn ??
      ((opt: T, t: string) => {
        const q = t.trim().toLowerCase();
        if (!q) return true;
        const base = `${opt.label} ${opt.description ?? ""}`.toLowerCase();
        return base.includes(q);
      })
    );
  }, [filterFn]);

  const filtered = useMemo(() => {
    const t = term.trim();
    const arr = options.filter((o) => internalFilterFn(o, t));
    return arr;
  }, [options, term, internalFilterFn]);

  // mantém activeIndex válido quando filtra
  useEffect(() => {
    setActiveIndex(0);
  }, [term, open]);

  // fecha ao clicar fora
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!rootRef.current) return;
      const target = e.target as Node;
      if (!rootRef.current.contains(target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  function openAndFocus() {
    if (disabled) return;
    setOpen(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function closeAndRestore() {
    setOpen(false);
    // quando fecha, mostra o label selecionado no input (sem “sujar” com termo)
    setTerm("");
    onSearch?.(""); // ✅ NOVO (opcional): limpa a busca remota ao fechar
  }

  function selectOption(opt: T) {
    if (opt.disabled) return;
    onChange(opt.value, opt);
    closeAndRestore();
  }

  function clearSelection() {
    onChange(null, undefined);
    setTerm("");
    onSearch?.(""); // ✅ NOVO (opcional): reseta a busca remota ao limpar
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (disabled) return;

    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      e.preventDefault();
      openAndFocus();
      return;
    }

    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        Math.min(prev + 1, Math.max(filtered.length - 1, 0))
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const opt = filtered[activeIndex];
      if (opt) selectOption(opt);
    }

    if (e.key === "Escape") {
      e.preventDefault();
      closeAndRestore();
    }
  }

  // texto que aparece no input quando NÃO está buscando
  const displayValue = useMemo(() => {
    if (open) return term; // durante busca, mostra o que digita
    if (term) return term; // segurança
    return selectedOption?.label ?? "";
  }, [open, term, selectedOption]);

  return (
    <S.Wrapper ref={rootRef} data-disabled={disabled ? "true" : "false"}>
      {label ? <S.Label htmlFor={id}>{label}</S.Label> : null}

      <S.Control
        data-open={open ? "true" : "false"}
        data-error={error ? "true" : "false"}
        onMouseDown={(e) => {
          // evita blur quando clicar na área
          e.preventDefault();
          openAndFocus();
        }}
      >
        <S.LeftIcon aria-hidden>
          {open ? <FiSearch /> : <FiSearch />}
        </S.LeftIcon>

        <S.Input
          id={id}
          ref={inputRef}
          disabled={disabled}
          placeholder={placeholder}
          value={displayValue}
          onFocus={() => openAndFocus()}
          onChange={(e) => {
            const v = e.target.value;
            setTerm(v);
            setOpen(true);
            onSearch?.(v); // ✅ NOVO: notifica termo digitado (backend)
          }}
          onKeyDown={onKeyDown}
          autoComplete="off"
        />

        <S.Actions>
          {clearable && !disabled && (value !== null && value !== undefined) ? (
            <S.IconBtn
              type="button"
              aria-label="Limpar seleção"
              onMouseDown={(e) => e.preventDefault()}
              onClick={clearSelection}
            >
              <FiX />
            </S.IconBtn>
          ) : null}

          <S.IconBtn
            type="button"
            aria-label={open ? "Fechar" : "Abrir"}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => (open ? closeAndRestore() : openAndFocus())}
          >
            <S.Chevron data-open={open ? "true" : "false"}>
              <FiChevronDown />
            </S.Chevron>
          </S.IconBtn>
        </S.Actions>
      </S.Control>

      {open ? (
        <S.Dropdown role="listbox">
          <S.DropHeader>
            {loading ? (
              <S.Muted>Carregando...</S.Muted>
            ) : showCount ? (
              <S.Muted>
                {filtered.length} resultado{filtered.length === 1 ? "" : "s"}
              </S.Muted>
            ) : (
              <span />
            )}
          </S.DropHeader>

          <S.List>
            {!loading && filtered.length === 0 ? (
              <S.Empty>Nenhum resultado.</S.Empty>
            ) : null}

            {filtered.map((opt, idx) => {
              const active = idx === activeIndex;
              const selected = opt.value === value;

              return (
                <S.Item
                  key={`${String(opt.value)}-${idx}`}
                  role="option"
                  aria-selected={selected}
                  data-active={active ? "true" : "false"}
                  data-selected={selected ? "true" : "false"}
                  data-disabled={opt.disabled ? "true" : "false"}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectOption(opt)}
                >
                  <S.ItemMain>
                    <S.ItemLabel>{opt.label}</S.ItemLabel>
                    {opt.description ? <S.ItemDesc>{opt.description}</S.ItemDesc> : null}
                  </S.ItemMain>

                  {selected ? <S.Badge>Selecionado</S.Badge> : null}
                </S.Item>
              );
            })}
          </S.List>
        </S.Dropdown>
      ) : null}

      {error ? <S.ErrorText>{error}</S.ErrorText> : null}
      {!error && helperText ? <S.HelperText>{helperText}</S.HelperText> : null}
    </S.Wrapper>
  );
}
