import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import * as S from "./styles";

import { theme } from "../../styles/theme";
import { darkTheme } from "../../styles/darkTheme";
import { ThemeProvider } from "styled-components";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema } from "../../schemas/login";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../api/login";
import { toast } from "sonner";
import type { z } from "zod";
import { TokenSistems } from "../../constants/env.constantes";

type LoginFormData = z.infer<typeof loginSchema>;

const THEME_KEY = "ps.theme";

function getStoredTheme(): "light" | "dark" {
  const v = localStorage.getItem(THEME_KEY);
  return v === "dark" ? "dark" : "light";
}

export function Login() {
  const navigate = useNavigate();

  const [mode, setMode] = useState<"light" | "dark">(getStoredTheme());
  useEffect(() => {
    localStorage.setItem(THEME_KEY, mode);
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  const currentTheme = useMemo(
    () => (mode === "dark" ? darkTheme : theme),
    [mode],
  );

  const [showPass, setShowPass] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      senha: "",
    },
  });

  const { mutateAsync: loginFn, isPending } = useMutation({
    mutationFn: login,
  });

  const loading = isPending;

  async function onSubmit(data: LoginFormData) {
    try {
      const response = await loginFn({
        email: data.email,
        senha: data.senha,
      });

      localStorage.setItem(TokenSistems.TOKEN_PSS, response.token);
      localStorage.setItem(
        TokenSistems.TOKEN_USER,
        JSON.stringify(response.user),
      );

      toast.success("Login realizado com sucesso!");
      navigate("/home");
    } catch (err: any) {
      toast.error("Não foi possível entrar. Verifique seus dados.");
    }
  }

  // Mostra um erro geral (prioriza email, depois senha)
  const formErrorMsg =
    errors.email?.message || errors.senha?.message || undefined;

  return (
    <ThemeProvider theme={currentTheme}>
      <S.Page>
        <S.Center>
          <S.Card>
            {/* Header do card (mobile) */}
            <S.CardHeader>
              <S.SwitchWrap>
                <S.SwitchText>
                  {mode === "dark" ? "Escuro" : "Claro"}
                </S.SwitchText>
                <S.SwitchButton
                  type="button"
                  $active={mode === "dark"}
                  onClick={() =>
                    setMode((p) => (p === "dark" ? "light" : "dark"))
                  }
                  aria-label={
                    mode === "dark" ? "Ativar modo claro" : "Ativar modo escuro"
                  }
                  title={mode === "dark" ? "Modo claro" : "Modo escuro"}
                >
                  <span />
                </S.SwitchButton>
              </S.SwitchWrap>
            </S.CardHeader>

            <S.ContentGrid>
              {/* ===== ESQUERDA: FORM ===== */}
              <S.LeftPane>
                <S.FormTitle>Entrar</S.FormTitle>
                <S.FormSub>Acesse sua conta para continuar.</S.FormSub>

                <S.Form onSubmit={handleSubmit(onSubmit)}>
                  <S.Field>
                    <S.Label htmlFor="email">E-mail</S.Label>
                    <S.Input
                      id="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="seuemail@exemplo.com"
                      {...register("email")}
                    />
                  </S.Field>

                  <S.Field>
                    <S.Label htmlFor="senha">Senha</S.Label>

                    <S.PasswordWrap>
                      <S.Input
                        id="senha"
                        type={showPass ? "text" : "senha"}
                        autoComplete="current-senha"
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
                        {showPass ? "Ocultar" : "Mostrar"}
                      </S.IconButton>
                    </S.PasswordWrap>
                  </S.Field>

                  {formErrorMsg ? (
                    <S.ErrorBox role="alert">{formErrorMsg}</S.ErrorBox>
                  ) : null}

                  <S.PrimaryButton disabled={loading || !isValid}>
                    {loading ? "Entrando..." : "Entrar"}
                  </S.PrimaryButton>

                  <S.Divider>
                    <span>ou</span>
                  </S.Divider>

                  <S.SecondaryButton
                    type="button"
                    onClick={() => navigate("/cadastro")}
                    disabled={loading}
                  >
                    Criar conta
                  </S.SecondaryButton>

                  <S.FooterHint>
                    Ao continuar, você concorda com os termos e a política de
                    privacidade.
                  </S.FooterHint>
                </S.Form>
              </S.LeftPane>

              {/* ===== DIREITA: TEXTO / LOGO / SWITCH ===== */}
              <S.RightPane>
                <S.Brand>
                  <S.LogoCircle aria-hidden="true">PMI</S.LogoCircle>
                  <div>
                    <S.BrandTitle>Prefeitura</S.BrandTitle>
                    <S.BrandSub>Processo Seletivo</S.BrandSub>
                  </div>
                </S.Brand>

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

                <S.DesktopOnly>
                  <S.ThemeRow>
                    <S.ThemeLabel>Modo</S.ThemeLabel>
                    <S.SwitchWrap>
                      <S.SwitchText>
                        {mode === "dark" ? "Escuro" : "Claro"}
                      </S.SwitchText>
                      <S.SwitchButton
                        type="button"
                        $active={mode === "dark"}
                        onClick={() =>
                          setMode((p) => (p === "dark" ? "light" : "dark"))
                        }
                      >
                        <span />
                      </S.SwitchButton>
                    </S.SwitchWrap>
                  </S.ThemeRow>
                </S.DesktopOnly>

                <S.BottomNote>
                  © {new Date().getFullYear()} — Sistema
                </S.BottomNote>
              </S.RightPane>
            </S.ContentGrid>
          </S.Card>
        </S.Center>
      </S.Page>
    </ThemeProvider>
  );
}
