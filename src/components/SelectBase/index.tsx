import { Field, Label, Select, ErrorText } from "./styles";
import type { SelectHTMLAttributes } from "react";

interface SelectBaseProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: React.ReactNode;
}

export function SelectBase({
  label,
  error,
  children,
  id,
  ...rest
}: SelectBaseProps) {
  return (
    <Field>
      {label && <Label htmlFor={id}>{label}</Label>}

      <Select id={id} {...rest} aria-invalid={!!error}>
        {children}
      </Select>

      {error && <ErrorText>{error}</ErrorText>}
    </Field>
  );
}
