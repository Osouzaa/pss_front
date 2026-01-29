import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import * as S from "./styles";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema } from "../../schemas/login";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../api/login";
import { toast } from "sonner";
import type { z } from "zod";
import { TokenSistems } from "../../constants/env.constantes";
import { queryClient } from "../../lib/react-query";

import { FiEye, FiEyeOff, FiSun, FiMoon, FiLock, FiUser } from "react-icons/fi";
import { FormMessage } from "../../components/FormMessage";
import { handleLoginError } from "../../errs/handle.login.erro";

// import Logo from "../../assets/logo.png";
import logo_pmi from "../../assets/logo-pmi-positiva.png";
import logo_pmi_negativa from "../../assets/logo-pmi-negativa.png";
// import Logo from "../../assets/logo_pss_ok.png";
// import Logo from "../../assets/logo_pss_funil.png";
import Logo from "../../assets/logo_pss_funil0.png";

import { useTheme } from "../../contexts/ThemeContext";
import { PageTransition } from "../../components/PageTransition";

type LoginFormData = z.infer<typeof loginSchema>;

export function Login() {
  const navigate = useNavigate();

  const { mode, toggleTheme } = useTheme();

  const [showPass, setShowPass] = useState(false);
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { email: "", senha: "" },
  });

  useEffect(() => {
    const sub = watch(() => setFormError(undefined));
    return () => sub.unsubscribe();
  }, [watch]);

  const { mutateAsync: loginFn, isPending } = useMutation({
    mutationFn: login,
  });

  async function onSubmit(data: LoginFormData) {
    try {
      setFormError(undefined);

      const response = await loginFn({
        email: data.email,
        senha: data.senha,
      });

      localStorage.setItem(TokenSistems.TOKEN_PSS, response.token);
      localStorage.setItem(
        TokenSistems.TOKEN_USER,
        JSON.stringify(response.user),
      );

      queryClient.clear();

      toast.success("Login realizado com sucesso!");
      navigate("/processos", { replace: true });
    } catch (error) {
      setFormError(handleLoginError(error));
    }
  }

  const rhfMsg = errors.email?.message || errors.senha?.message;
  const apiMsg = formError;

  const message = apiMsg || rhfMsg || undefined;
  const messageType: "error" | "warning" | "success" = apiMsg
    ? "error"
    : rhfMsg
      ? "warning"
      : "success";

  return (
    <PageTransition>
      <S.Page>
        <S.Center>
          <S.Card>
            <S.TopBar>
              <S.BrandMini>
                <S.LogoRow>
                  <S.SystemLogoImg
                    src={mode === "dark" ? logo_pmi_negativa : logo_pmi}
                    alt="Logo do Sistema"
                  />
                  <S.LogoDivider aria-hidden="true" />
                  <S.LogoCircleImg src={Logo} alt="Logo do sistema PSS" />
                </S.LogoRow>
              </S.BrandMini>

              <S.ThemeToggle
                type="button"
                $active={mode === "dark"}
                onClick={toggleTheme}
                aria-label={
                  mode === "dark" ? "Ativar modo claro" : "Ativar modo escuro"
                }
                title={mode === "dark" ? "Modo claro" : "Modo escuro"}
              >
                <S.ToggleTrack $active={mode === "dark"}>
                  <S.ToggleIconLeft aria-hidden="true">
                    <FiSun />
                  </S.ToggleIconLeft>
                  <S.ToggleIconRight aria-hidden="true">
                    <FiMoon />
                  </S.ToggleIconRight>
                  <S.ToggleThumb $active={mode === "dark"}>
                    {mode === "dark" ? <FiMoon /> : <FiSun />}
                  </S.ToggleThumb>
                </S.ToggleTrack>
              </S.ThemeToggle>
            </S.TopBar>

            <S.ContentGrid>
              <S.LeftPane>
                <S.FormTitle>Processo Seletivo Simplificado</S.FormTitle>
                <S.FormSub>Acesse sua conta para continuar.</S.FormSub>

                <S.Form onSubmit={handleSubmit(onSubmit)}>
                  <S.Field>
                    <S.Label htmlFor="email">E-mail</S.Label>

                    <S.InputWrap>
                      <S.InputIcon aria-hidden="true">
                        <FiUser />
                      </S.InputIcon>

                      <S.Input
                        id="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        placeholder="seuemail@exemplo.com"
                        {...register("email")}
                      />
                    </S.InputWrap>
                  </S.Field>

                  <S.Field>
                    <S.Label htmlFor="senha">Senha</S.Label>

                    <S.PasswordWrap>
                      <S.InputIcon aria-hidden="true">
                        <FiLock />
                      </S.InputIcon>

                      <S.Input
                        id="senha"
                        type={showPass ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Sua senha"
                        {...register("senha")}
                      />

                      <S.IconButton
                        type="button"
                        onClick={() => setShowPass((v) => !v)}
                        aria-label={
                          showPass ? "Ocultar senha" : "Mostrar senha"
                        }
                        title={showPass ? "Ocultar senha" : "Mostrar senha"}
                      >
                        {showPass ? <FiEyeOff /> : <FiEye />}
                      </S.IconButton>
                    </S.PasswordWrap>
                  </S.Field>

                  <FormMessage message={message} type={messageType} />

                  <S.PrimaryButton disabled={isPending}>
                    {isPending ? "Entrando..." : "Entrar"}
                  </S.PrimaryButton>

                  <S.Divider>
                    <span>ou</span>
                  </S.Divider>

                  <S.SecondaryButton
                    type="button"
                    onClick={() => navigate("/cadastro")}
                    disabled={isPending}
                  >
                    Criar conta
                  </S.SecondaryButton>

                  <S.FooterHint>
                    Ao continuar, você concorda com os termos e a política de
                    privacidade.
                  </S.FooterHint>
                </S.Form>
              </S.LeftPane>

              <S.RightPane>
                <S.MessageTitle>Bem-vindo(a) 👋</S.MessageTitle>
                <S.MessageText>
                  Faça login para acompanhar editais, inscrições, convocações e
                  resultados.
                </S.MessageText>

                <S.InfoCard>
                  <S.InfoTitle>Dica rápida</S.InfoTitle>
                  <S.InfoText>
                    Se você ainda não tem conta, clique em <b>Criar conta</b>{" "}
                    para se cadastrar.
                  </S.InfoText>
                </S.InfoCard>

                <S.BottomNote>
                  © {new Date().getFullYear()} — Sistema
                </S.BottomNote>
              </S.RightPane>
            </S.ContentGrid>
          </S.Card>
        </S.Center>
      </S.Page>
    </PageTransition>
  );
}
