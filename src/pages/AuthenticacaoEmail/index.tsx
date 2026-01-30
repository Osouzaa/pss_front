import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { FiCheckCircle, FiMail, FiRefreshCw, FiXCircle } from "react-icons/fi";

import * as S from "./styles";
import { InputBase } from "../../components/InputBase";
import { FormMessage } from "../../components/FormMessage";
import { confirmEmailRequest } from "../../api/confirmEmail";
import { resendConfirmEmailRequest } from "../../api/resendConfirmEmailRequest";
import { handleConfirmEmailError } from "../../errs/handle.confirm.email.erro";

const confirmSchema = z.object({
  token: z
    .string()
    .min(10, "Cole o token de confirmação (mínimo 10 caracteres)."),
  email: z
    .string()
    .email("Informe um e-mail válido.")
    .optional()
    .or(z.literal("")),
});

type ConfirmFormData = z.infer<typeof confirmSchema>;

const resendSchema = z.object({
  email: z.string().email("Informe um e-mail válido."),
});

type ResendFormData = z.infer<typeof resendSchema>;

export function AuthenticacaoEmail() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const tokenFromUrl = params.get("token") ?? "";
  const emailFromUrl = params.get("email") ?? "";

  const [confirmed, setConfirmed] = useState(false);

  // mensagens amigáveis (pra toast e FormMessage)
  const [confirmErrorMsg, setConfirmErrorMsg] = useState<string | null>(null);
  const [resendErrorMsg, setResendErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<ConfirmFormData>({
    resolver: zodResolver(confirmSchema),
    defaultValues: {
      token: tokenFromUrl,
      email: emailFromUrl,
    },
  });

  const {
    register: registerResend,
    handleSubmit: handleSubmitResend,
    formState: { errors: resendErrors, isSubmitting: resendSubmitting },
    setValue: setValueResend,
  } = useForm<ResendFormData>({
    resolver: zodResolver(resendSchema),
    defaultValues: {
      email: emailFromUrl || "",
    },
  });

  const confirmMutation = useMutation({
    mutationFn: confirmEmailRequest,
    onMutate: () => {
      setConfirmErrorMsg(null);
      setConfirmed(false);
    },
    onSuccess: () => {
      setConfirmed(true);
      setConfirmErrorMsg(null);
      toast.success("E-mail confirmado com sucesso!");
    },
    onError: (err) => {
      const msg = handleConfirmEmailError(err);
      setConfirmed(false);
      setConfirmErrorMsg(msg);
      toast.error(msg);
    },
  });

  const resendMutation = useMutation({
    mutationFn: resendConfirmEmailRequest,
    onMutate: () => {
      setResendErrorMsg(null);
    },
    onSuccess: () => {
      setResendErrorMsg(null);
      toast.success("E-mail de confirmação reenviado!");
    },
    onError: (err) => {
      // se quiser, crie um handler separado; por agora reaproveita (mensagens genéricas funcionam)
      const msg = handleConfirmEmailError(err);
      setResendErrorMsg(msg);
      toast.error(msg);
    },
  });

  const status = useMemo(() => {
    if (confirmed) return "success";
    if (confirmMutation.isPending) return "loading";
    if (confirmMutation.isError) return "error";
    return "idle";
  }, [confirmed, confirmMutation.isPending, confirmMutation.isError]);

  useEffect(() => {
    if (emailFromUrl) {
      setValue("email", emailFromUrl);
      setValueResend("email", emailFromUrl);
    }
    if (tokenFromUrl) {
      setValue("token", tokenFromUrl);
    }
  }, [emailFromUrl, tokenFromUrl, setValue, setValueResend]);

  function onSubmitConfirm(data: ConfirmFormData) {
    setConfirmErrorMsg(null);
    confirmMutation.mutate({ token: data.token.trim() });
  }

  function onSubmitResend(data: ResendFormData) {
    setResendErrorMsg(null);
    resendMutation.mutate({ email: data.email.trim().toLowerCase() });
  }

  return (
    <S.Container>
      <S.Card>
        <S.Header>
          <S.Badge aria-hidden="true">
            <FiMail />
          </S.Badge>

          <div>
            <S.Title>Confirmação de e-mail</S.Title>
            <S.Subtitle>
              Confirme sua conta para continuar usando o sistema.
            </S.Subtitle>
          </div>
        </S.Header>

        <S.StatusWrap>
          {status === "loading" && (
            <S.Status $variant="info">
              <S.StatusIcon aria-hidden="true">
                <S.Spinner />
              </S.StatusIcon>
              <div>
                <S.StatusTitle>Confirmando…</S.StatusTitle>
                <S.StatusText>
                  Aguarde enquanto validamos seu token.
                </S.StatusText>
              </div>
            </S.Status>
          )}

          {status === "success" && (
            <S.Status $variant="success">
              <S.StatusIcon aria-hidden="true">
                <FiCheckCircle />
              </S.StatusIcon>
              <div>
                <S.StatusTitle>Conta confirmada!</S.StatusTitle>
                <S.StatusText>
                  Seu e-mail foi validado. Você já pode acessar.
                </S.StatusText>
              </div>
            </S.Status>
          )}

          {status === "error" && (
            <S.Status $variant="danger">
              <S.StatusIcon aria-hidden="true">
                <FiXCircle />
              </S.StatusIcon>
              <div>
                <S.StatusTitle>Não foi possível confirmar</S.StatusTitle>
                <S.StatusText>
                  {confirmErrorMsg ??
                    "O token pode ter expirado ou já foi utilizado."}
                </S.StatusText>
              </div>
            </S.Status>
          )}

          {status === "idle" && (
            <S.Status $variant="neutral">
              <S.StatusIcon aria-hidden="true">
                <FiMail />
              </S.StatusIcon>
              <div>
                <S.StatusTitle>Verifique seu e-mail</S.StatusTitle>
                <S.StatusText>
                  Cole o token abaixo e clique em “Confirmar e-mail”.
                </S.StatusText>
              </div>
            </S.Status>
          )}
        </S.StatusWrap>

        {confirmed ? (
          <S.Actions>
            <S.PrimaryButton type="button" onClick={() => navigate("/login")}>
              Ir para o login
            </S.PrimaryButton>

            <S.SecondaryButton
              type="button"
              onClick={() => navigate("/")}
              title="Voltar"
            >
              Voltar
            </S.SecondaryButton>
          </S.Actions>
        ) : (
          <>
            <S.Section>
              <S.SectionTitle>Confirmar manualmente</S.SectionTitle>
              <S.SectionDesc>
                Cole o token do e-mail (ou abra o link novamente).
              </S.SectionDesc>

              <S.Form onSubmit={handleSubmit(onSubmitConfirm)}>
                <InputBase
                  label="Token de confirmação"
                  placeholder="Cole aqui o token"
                  autoComplete="one-time-code"
                  {...register("token")}
                  error={errors.token?.message}
                />

                {confirmErrorMsg && (
                  <FormMessage type="error" message={confirmErrorMsg} />
                )}

                <S.Actions>
                  <S.PrimaryButton
                    type="submit"
                    disabled={isSubmitting || confirmMutation.isPending}
                  >
                    Confirmar e-mail
                  </S.PrimaryButton>

                  <S.SecondaryButton
                    type="button"
                    disabled={confirmMutation.isPending}
                    onClick={() => {
                      setValue("token", "");
                      setConfirmErrorMsg(null);
                      toast.message(
                        "Cole um novo token ou use o link do e-mail.",
                      );
                    }}
                  >
                    Limpar
                  </S.SecondaryButton>
                </S.Actions>
              </S.Form>
            </S.Section>

            <S.Divider />

            <S.Section>
              <S.SectionTitle>Não recebeu o e-mail?</S.SectionTitle>
              <S.SectionDesc>
                Informe seu e-mail para reenviarmos a confirmação.
              </S.SectionDesc>

              <S.Form onSubmit={handleSubmitResend(onSubmitResend)}>
                <InputBase
                  label="E-mail"
                  placeholder="seuemail@dominio.com"
                  autoComplete="email"
                  {...registerResend("email")}
                  error={resendErrors.email?.message}
                />

                {resendErrorMsg && (
                  <FormMessage type="error" message={resendErrorMsg} />
                )}

                <S.Actions>
                  <S.PrimaryButton
                    type="submit"
                    disabled={resendSubmitting || resendMutation.isPending}
                  >
                    <FiRefreshCw aria-hidden="true" />
                    Reenviar confirmação
                  </S.PrimaryButton>

                  <S.SecondaryButton
                    type="button"
                    onClick={() => navigate("/login")}
                  >
                    Voltar para o login
                  </S.SecondaryButton>
                </S.Actions>
              </S.Form>
            </S.Section>
          </>
        )}

        <S.FooterNote>
          Dica: verifique também a caixa de spam/lixo eletrônico.
        </S.FooterNote>
      </S.Card>
    </S.Container>
  );
}
