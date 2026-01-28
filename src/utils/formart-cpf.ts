export function formatCPF(value: string): string {
  const numbers = value.replace(/\D/g, "").slice(0, 11); // só números, max 11 dígitos

  let formatted = numbers;

  if (numbers.length > 9) {
    formatted = numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  } else if (numbers.length > 6) {
    formatted = numbers.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
  } else if (numbers.length > 3) {
    formatted = numbers.replace(/(\d{3})(\d{1,3})/, "$1.$2");
  }

  return formatted;
}

// Recebe uma string formatada e remove tudo que não for número
export function unformatCPF(value: string): string {
  return value.replace(/\D/g, "");
}
