import { forwardRef } from "react";
import { Field, Input, Label, InputWrap, Icon } from "./styles";
import { FiCalendar } from "react-icons/fi";
import type { InputHTMLAttributes } from "react";
import { FormMessage } from "../FormMessage";

interface InputBaseProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const InputBase = forwardRef<HTMLInputElement, InputBaseProps>(
  ({ label, error, type, id, ...rest }, ref) => {
    const showCalendar =
      type === "date" || type === "datetime-local" || type === "time";

    return (
      <Field>
        <Label htmlFor={id}>{label}</Label>

        <InputWrap>
          <Input
            ref={ref}
            id={id}
            type={type}
            {...rest}
            aria-invalid={!!error}
            $hasIcon={showCalendar}
          />

          {showCalendar && (
            <Icon aria-hidden="true">
              <FiCalendar />
            </Icon>
          )}
        </InputWrap>

        {error && <FormMessage message={error} type="error" />}
      </Field>
    );
  },
);

InputBase.displayName = "InputBase";
