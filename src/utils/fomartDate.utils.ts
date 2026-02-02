import { format, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatDate(
  date?: string | Date | null,
  pattern: string = "dd/MM/yyyy",
): string {
  if (!date) return "—";

  let parsed: Date;

  if (typeof date === "string") {
    // 🔥 evita conversão UTC
    const [year, month, day] = date.split("T")[0].split("-").map(Number);
    parsed = new Date(year, month - 1, day);
  } else {
    parsed = date;
  }

  if (!isValid(parsed)) return "—";

  return format(parsed, pattern, { locale: ptBR });
}
