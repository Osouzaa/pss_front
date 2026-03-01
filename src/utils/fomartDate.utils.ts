import { format, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatDate(
  date?: string | Date | null,
  pattern: string = "dd/MM/yyyy",
): string {
  if (!date) return "—";

  let parsed: Date;

  if (typeof date === "string") {
    const onlyDate = date.split("T")[0]; // remove horário se existir
    const [year, month, day] = onlyDate.split("-").map(Number);

    // 🔥 cria no meio-dia para evitar D-1 por timezone
    parsed = new Date(year, month - 1, day, 12);
  } else {
    parsed = date;
  }

  if (!isValid(parsed)) return "—";

  return format(parsed, pattern, { locale: ptBR });
}