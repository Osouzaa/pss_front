// styles.ts (COMPLETO)
import styled, { keyframes } from "styled-components";
import * as Dialog from "@radix-ui/react-dialog";

const overlayIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const contentIn = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -50%) translateY(10px) scale(0.985);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) translateY(0) scale(1);
  }
`;

export const Overlay = styled(Dialog.Overlay)`
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.65);
  backdrop-filter: blur(3px);
  z-index: 9000000;
  animation: ${overlayIn} 160ms ease-out;
`;

export const Content = styled(Dialog.Content)`
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  width: min(1220px, calc(100vw - 24px));
  max-height: min(86vh, 960px);
  overflow: hidden;

  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 18px;

  box-shadow: 0 26px 70px rgba(0, 0, 0, 0.35);
  z-index: 9000001;
  animation: ${contentIn} 220ms cubic-bezier(0.16, 1, 0.3, 1);

  will-change: transform, opacity;

  /* ✅ mobile: ocupa praticamente a tela toda e não “sobra” embaixo */
  @media (max-width: 520px) {
    width: calc(100vw - 16px);
    max-height: calc(100vh - 16px);
    border-radius: 16px;
  }
`;

export const HeaderContent = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;

  padding: 0.95rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  .subtitle {
    display: block;
    font-size: 0.82rem;
    line-height: 1.2;
    opacity: 0.78;
    margin-top: 4px;
    color: ${({ theme }) => theme.description ?? theme.text};
  }

  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    height: 38px;
    width: 40px;

    border: 1px solid ${({ theme }) => theme.border};
    color: ${({ theme }) => theme.text};
    background: transparent;

    cursor: pointer;
    border-radius: 12px;
    transition:
      background 0.12s ease,
      border-color 0.12s ease,
      transform 0.12s ease,
      color 0.12s ease;

    &:hover {
      background: ${({ theme }) => theme.BGlink};
      border-color: ${({ theme }) => theme.link};
    }

    &:active {
      transform: translateY(1px);
    }

    &:focus-visible {
      outline: 0;
      box-shadow: 0 0 0 3px ${({ theme }) => theme.active};
    }
  }
`;

export const Title = styled(Dialog.Title)`
  font-size: 1.15rem;
  color: ${({ theme }) => theme.text};
  font-weight: 700;
  letter-spacing: -0.3px;
`;

/** ====== Layout 2 colunas (responsivo) ====== */
export const Body = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;

  max-height: calc(86vh - 72px);
  overflow: auto;

  -webkit-overflow-scrolling: touch;

  /* ✅ melhora: não deixa “quebrar” conteúdo dentro do grid */
  min-width: 0;

  @media (min-width: 880px) {
    grid-template-columns: 1fr 1px 1.1fr;
  }

  @media (max-width: 520px) {
    max-height: calc(100vh - 86px);
  }
`;

export const LeftCol = styled.div`
  padding: 1rem;
  min-width: 0;

  @media (min-width: 880px) {
    padding: 1.05rem 1.05rem 1.1rem;
  }
`;

export const RightCol = styled.div`
  padding: 1rem;
  min-width: 0; /* ✅ FUNDAMENTAL: permite ellipsis funcionar dentro do grid */

  @media (min-width: 880px) {
    padding: 1.05rem 1.05rem 1.1rem;
  }
`;

export const Divider = styled.div`
  display: none;
  background: ${({ theme }) => theme.border};

  @media (min-width: 880px) {
    display: block;
  }
`;

/** ====== Form ====== */
export const FormStyles = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

/* ✅ Row padrão: 1 coluna no mobile, 2 no desktop */
export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  @media (min-width: 560px) {
    grid-template-columns: 1fr 1fr;
  }

  /* ✅ 3 colunas (para os valores Fundamental/Médio/Superior) */
  &.row-grid {
    @media (min-width: 760px) {
      grid-template-columns: 1fr 1fr 1fr;
    }
  }
`;

export const Footer = styled.div`
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;

  button {
    height: 42px;
    padding: 0 14px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 700;
    border: 1px solid transparent;

    cursor: pointer;
    transition:
      background 0.12s ease,
      border-color 0.12s ease,
      transform 0.12s ease,
      opacity 0.12s ease;

    &:disabled {
      opacity: 0.55;
      cursor: not-allowed;
      transform: none;
    }

    &:active:not(:disabled) {
      transform: translateY(1px);
    }

    &:focus-visible {
      outline: 0;
      box-shadow: 0 0 0 3px ${({ theme }) => theme.active};
    }
  }

  .secondary {
    background: ${({ theme }) => theme.lightPrimary};
    color: ${({ theme }) => theme.primary};
    border-color: ${({ theme }) => theme.active};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.active};
    }
  }

  .primary {
    background: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme["text-white"]};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.primaryHover};
    }
  }
`;

/** ====== Listagem ====== */
export const OptionsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  margin-bottom: 0.75rem;

  strong {
    color: ${({ theme }) => theme.text};
    font-size: 0.95rem;
  }

  .meta {
    font-size: 0.8rem;
    opacity: 0.78;
    color: ${({ theme }) => theme.description ?? theme.text};
  }
`;

export const EmptyState = styled.div`
  border: 1px dashed ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bodyBg};
  border-radius: 12px;
  padding: 14px;
  color: ${({ theme }) => theme.text};
  opacity: 0.9;
  font-size: 0.9rem;
  line-height: 1.35;
`;

/** ✅ Wrapper pra scroll horizontal só na tabela (não no modal todo) */
export const OptionsTableWrap = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 4px;

  -webkit-overflow-scrolling: touch;

  /* opcional: scrollbar discreta */
  &::-webkit-scrollbar {
    height: 10px;
  }
`;

/** ✅ Tabela responsiva (label/valor grandes sem estourar) */
export const OptionsTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;

  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  overflow: hidden;

  /* ✅ chave: impede colunas crescerem infinito */
  table-layout: fixed;

  /* ✅ no desktop ela tem espaço “ideal”; no mobile pode rolar */
  min-width: 760px;

  thead th {
    text-align: left;
    font-size: 0.75rem;
    letter-spacing: 0.35px;
    text-transform: uppercase;
    padding: 10px 12px;

    background: ${({ theme }) => theme.bodyBg};
    color: ${({ theme }) => theme.text};
    border-bottom: 1px solid ${({ theme }) => theme.border};

    position: sticky;
    top: 0;
    z-index: 2;

    white-space: nowrap;
  }

  tbody td {
    padding: 10px 12px;
    border-bottom: 1px solid ${({ theme }) => theme.border};
    color: ${({ theme }) => theme.text};
    font-size: 0.92rem;
    vertical-align: middle;

    /* ✅ evita “estouro” por texto grande */
    overflow: hidden;
    text-overflow: ellipsis;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  /* ✅ larguras por coluna (equilíbrio geral) */
  th:nth-child(1),
  td:nth-child(1) {
    width: 42%;
  }

  th:nth-child(2),
  td:nth-child(2) {
    width: 30%;
  }

  /* Fund / Médio / Sup */
  th:nth-child(3),
  td:nth-child(3),
  th:nth-child(4),
  td:nth-child(4),
  th:nth-child(5),
  td:nth-child(5) {
    width: 88px;
    text-align: center;
    white-space: nowrap;
  }

  /* Ordem */
  th:nth-child(6),
  td:nth-child(6) {
    width: 82px;
    text-align: center;
    white-space: nowrap;
  }

  /* Status */
  th:nth-child(7),
  td:nth-child(7) {
    width: 100px;
    text-align: center;
    white-space: nowrap;
  }

  /* Ações */
  th:nth-child(8),
  td:nth-child(8) {
    width: 120px;
    text-align: right;
    white-space: nowrap;
  }

  /* ✅ Label: até 2 linhas, corta com reticências */
  td.label .main {
    font-weight: 700;
    line-height: 1.2;

    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* ✅ Valor: 1 linha, monospace, ellipsis */
  td.value {
    font-family:
      ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
      "Courier New", monospace;
    font-size: 0.85rem;
    opacity: 0.92;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* ✅ Mobile: some colunas menos importantes e compacta */
  @media (max-width: 720px) {
    min-width: 0;

    thead th,
    tbody td {
      padding: 10px 10px;
    }

    /* esconde Fund/Médio/Sup no mobile */
    th:nth-child(3),
    td:nth-child(3),
    th:nth-child(4),
    td:nth-child(4),
    th:nth-child(5),
    td:nth-child(5) {
      display: none;
    }

    /* reequilibra */
    th:nth-child(1),
    td:nth-child(1) {
      width: 55%;
    }

    th:nth-child(2),
    td:nth-child(2) {
      width: 45%;
    }
  }
`;

/** ✅ hover + destaque de linha editando */
export const OptionRow = styled.tr<{ "data-active"?: boolean }>`
  background: transparent;

  td {
    transition: background 0.12s ease;
  }

  &:hover td {
    background: ${({ theme }) => theme.bodyBg};
  }

  &[data-active="true"] td {
    background: ${({ theme }) => theme.BGlink};
  }
`;

export const Badge = styled.span<{ "data-on"?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;

  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};

  &[data-on="true"] {
    border-color: ${({ theme }) => theme.secondary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.lightSuccess ?? theme.active};
  }
`;

export const ActionButton = styled.button`
  height: 34px;
  width: 38px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.border};
  background: transparent;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  transition:
    background 0.12s ease,
    border-color 0.12s ease,
    transform 0.12s ease,
    color 0.12s ease;

  margin-left: 8px;

  &:hover {
    background: ${({ theme }) => theme.BGlink};
    border-color: ${({ theme }) => theme.link};
  }

  &:active {
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: 0;
    box-shadow: 0 0 0 3px ${({ theme }) => theme.active};
  }

  &.danger:hover {
    background: ${({ theme }) => theme.danger};
    border-color: ${({ theme }) => theme.danger};
    color: ${({ theme }) => theme["text-white"]};
  }
`;
