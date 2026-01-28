import React, { useEffect, useState } from "react";
import { Container, Label, TextArea, Counter, ErrorText } from "./styles";

type TextAreaBaseProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  maxLength?: number;
  error?: string;
};

export const TextAreaBase = React.forwardRef<
  HTMLTextAreaElement,
  TextAreaBaseProps
>(
  (
    {
      label,
      maxLength = 250,
      defaultValue = "",
      value,
      onChange,
      error,
      ...rest
    },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const [text, setText] = useState(String(value ?? defaultValue ?? ""));

    useEffect(() => {
      if (isControlled) setText(String(value ?? ""));
    }, [isControlled, value]);

    function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
      setText(e.target.value);
      onChange?.(e);
    }

    return (
      <Container>
        {label && <Label>{label}</Label>}

        <TextArea
          ref={ref}
          maxLength={maxLength}
          onChange={handleChange}
          defaultValue={isControlled ? undefined : defaultValue}
          value={isControlled ? String(value ?? "") : undefined}
          aria-invalid={!!error}
          {...rest}
        />

        <Counter danger={text.length >= maxLength}>
          {text.length}/{maxLength}
        </Counter>

        {error && <ErrorText role="alert">{error}</ErrorText>}
      </Container>
    );
  },
);

TextAreaBase.displayName = "TextAreaBase";
