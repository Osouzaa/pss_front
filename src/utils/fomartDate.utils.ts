import { format, parseISO, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatDate(
  date?: string | Date | null,
  pattern: string = "dd/MM/yyyy"
): string {
  if (!date) return "—";

  const parsed =
    typeof date === "string" ? parseISO(date) : date;

  if (!isValid(parsed)) return "—";

  return format(parsed, pattern, { locale: ptBR });
}
