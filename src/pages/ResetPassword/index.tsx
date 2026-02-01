import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  FiCheckCircle,
  FiArrowLeft
} from "react-icons/fi";

import * as S from "./styles";
import { InputBase } from "../../components/InputBase";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "../../schemas/reset-password";
import { resetPasswordRequest } from "../../api/resetPassword";

export function ResetPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const tokenFromUrl = params.get("token") ?? "";

  const title = useMemo(() => "Redefinir senha", []);
  const subtitle = useMemo(() => "Crie uma nova senha para sua conta.", []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: {
      token: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    // injeta token no form (validação passa pelo schema)
    setValue("token", tokenFromUrl);
  }, [tokenFromUrl, setValue]);

  const { mutateAsync } = useMutation({
    mutationFn: resetPasswordRequest,
    onSuccess: () => {
      toast.success("Senha redefinida com sucesso!");
      navigate("/login", { replace: true });
    },
    onError: (e: any) => {
      toast.error(e?.response?.data?.message ?? "Falha ao redefinir senha.");
      console.error(e);
    },
  });

  async function onSubmit(data: ResetPasswordFormData) {
    if (!tokenFromUrl) {
      toast.error("Token não encontrado. Abra o link enviado por e-mail.");
      return;
    }

    await mutateAsync({
      token: data.token,
      senha: data.password,
    });
  }

  const disabledSubmit = isSubmitting || !isValid || !tokenFromUrl;

  return (
    <S.Page>
      <S.Card>
        <S.Header>
          <div>
            <S.Title>{title}</S.Title>
            <S.Subtitle>{subtitle}</S.Subtitle>
          </div>

          <S.BackBtn
            type="button"
            onClick={() => navigate("/login")}
            disabled={isSubmitting}
          >
            <FiArrowLeft size={16} />
            Voltar
          </S.BackBtn>
        </S.Header>

        <S.Form onSubmit={handleSubmit(onSubmit)}>
          {/* token escondido, mas validado */}
          <input type="hidden" {...register("token")} />

          <InputBase
            label="Nova senha"
            type="password"
            placeholder="Digite sua nova senha"
            {...register("password")}
            error={errors.password?.message}
            disabled={isSubmitting}
          />

          <InputBase
            label="Confirmar senha"
               type="password"
            placeholder="Confirme sua nova senha"
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
            disabled={isSubmitting}
          />

          {!tokenFromUrl ? (
            <S.Alert>
              Token não encontrado na URL. Abra o link enviado por e-mail para
              redefinir sua senha.
            </S.Alert>
          ) : (
            <S.Hint>
              Dica: use pelo menos 8 caracteres, com maiúscula, minúscula e
              número.
            </S.Hint>
          )}

          <S.Primary type="submit" disabled={disabledSubmit}>
            <FiCheckCircle size={16} />
            {isSubmitting ? "Salvando..." : "Salvar nova senha"}
          </S.Primary>
        </S.Form>
      </S.Card>
    </S.Page>
  );
}
