export function formatPhoneBR(value?: string | null) {
  const digits = (value ?? "").replace(/\D/g, "");

  if (!digits) return "—";

  // DDI (se vier) - remove 55 no começo
  const normalized =
    digits.startsWith("55") && digits.length > 11 ? digits.slice(2) : digits;

  if (normalized.length === 11) {
    const ddd = normalized.slice(0, 2);
    const p1 = normalized.slice(2, 7);
    const p2 = normalized.slice(7, 11);
    return `(${ddd}) ${p1}-${p2}`; // (DD) 9XXXX-XXXX
  }

  if (normalized.length === 10) {
    const ddd = normalized.slice(0, 2);
    const p1 = normalized.slice(2, 6);
    const p2 = normalized.slice(6, 10);
    return `(${ddd}) ${p1}-${p2}`; // (DD) XXXX-XXXX
  }

  // fallback: mostra o que der pra mostrar sem quebrar
  if (normalized.length > 2) {
    const ddd = normalized.slice(0, 2);
    return `(${ddd}) ${normalized.slice(2)}`;
  }

  return normalized;
}
