import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { FiArrowLeft, FiSend } from "react-icons/fi";

import * as S from "./styles";
import { InputBase } from "../../components/InputBase";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "../../schemas/forgot-password";
import { forgotPasswordRequest } from "../../api/forgotPassword";

export function ForgotPassword() {
  const navigate = useNavigate();

  const title = useMemo(() => "Recuperar senha", []);
  const subtitle = useMemo(
    () =>
      "Informe seu e-mail. Se ele existir no sistema, enviaremos um link de redefinição.",
    [],
  );

  useEffect(() => {
    console.log("ForgotPassword montou");
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
    defaultValues: { email: "" },
  });

  const { mutateAsync } = useMutation({
    mutationFn: forgotPasswordRequest,
    onSuccess: () => {
      toast.success(
        "Se o e-mail estiver cadastrado, enviamos o link de recuperação.",
      );
      // opcional: navegar pra uma tela de “confira seu e-mail”
    },
    onError: (e: any) => {
      // Segurança: evite revelar se o e-mail existe. Então, pode sempre mostrar sucesso.
      toast.success(
        "Se o e-mail estiver cadastrado, enviamos o link de recuperação.",
      );
      console.error(e);
    },
  });

  async function onSubmit(data: ForgotPasswordFormData) {
    await mutateAsync({ email: data.email.trim().toLowerCase() });
  }

  return (
    <S.Page>
      <S.Card>
        <S.Header>
          <S.Title>{title}</S.Title>
          <S.Subtitle>{subtitle}</S.Subtitle>
        </S.Header>

        <S.Form onSubmit={handleSubmit(onSubmit)}>
          <InputBase
            label="E-mail"
            placeholder="seuemail@exemplo.com"
            {...register("email")}
            error={errors.email?.message}
            disabled={isSubmitting}
          />

          <S.Actions>
            <S.Secondary
              type="button"
              onClick={() => navigate("/login")}
              disabled={isSubmitting}
            >
              <FiArrowLeft size={16} />
              Voltar
            </S.Secondary>

            <S.Primary type="submit" disabled={isSubmitting || !isValid}>
              <FiSend size={16} />
              {isSubmitting ? "Enviando..." : "Enviar link"}
            </S.Primary>
          </S.Actions>
        </S.Form>
      </S.Card>
    </S.Page>
  );
}
