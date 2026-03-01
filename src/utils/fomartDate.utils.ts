import { format, isValid, parse } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatDate(
  date?: string | Date | null,
  pattern: string = "dd/MM/yyyy",
): string {
  if (!date) return "—";

  let parsed: Date;

  if (typeof date === "string") {
    const s = date.trim();

    // ✅ Se tem "T", é datetime (provavelmente ISO). Parseia de verdade.
    if (s.includes("T")) {
      parsed = new Date(s);
    } else {
      // ✅ Se é só data "YYYY-MM-DD", parseia como data local sem timezone
      // e joga no meio-dia pra evitar D-1
      const d = parse(s, "yyyy-MM-dd", new Date());
      parsed = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12);
    }
  } else {
    parsed = date;
  }

  if (!isValid(parsed)) return "—";

  return format(parsed, pattern, { locale: ptBR });
}