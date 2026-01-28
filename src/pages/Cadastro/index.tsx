import { useEffect, useMemo, useState } from "react";
import { ThemeProvider } from "styled-components";
import { useNavigate } from "react-router";
import * as S from "./styles";

import { theme } from "../../styles/theme";
import { darkTheme } from "../../styles/darkTheme";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createNovoUserSchema,
  type CreateNovoUserFormData,
} from "../../schemas/create-novo-user";
import { InputBase } from "../../components/InputBase";
import { useMutation } from "@tanstack/react-query";
import { novoUsuario } from "../../api/novo-usuario";
import { toast } from "sonner";

const THEME_KEY = "ps.theme";

function passwordScore(pwd: string) {
  const okLen = pwd.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(pwd);
  const hasNumber = /\d/.test(pwd);
  return { okLen, hasLetter, hasNumber, ok: okLen && hasLetter && hasNumber };
}

function getStoredTheme(): "light" | "dark" {
  const v = localStorage.getItem(THEME_KEY);
  return v === "dark" ? "dark" : "light";
}

export function Cadastro() {
  const navigate = useNavigate();

  const [mode, setMode] = useState<"light" | "dark">(getStoredTheme());
  useEffect(() => {
    localStorage.setItem(THEME_KEY, mode);
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  const currentTheme = useMemo(
    () => (mode === "dark" ? darkTheme : theme),
    [mode]
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<CreateNovoUserFormData>({
    resolver: zodResolver(createNovoUserSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      senha: "",
      role: "CANDIDATO", // ajuste se seu schema usar outro valor
    },
  });

  const [showPass, setShowPass] = useState(false);

  const senhaValue = watch("senha") ?? "";
  const pwd = useMemo(() => passwordScore(senhaValue), [senhaValue]);

  const { mutateAsync: novoUsuarioFn, isPending } = useMutation({
    mutationFn: novoUsuario,
  });

  const loading = isPending;

  // mantém o botão coerente com as regras visuais da senha
  const canSubmit = isValid && pwd.ok && !loading;

  async function handleNovoUser(data: CreateNovoUserFormData) {
    try {
      await novoUsuarioFn({
        email: data.email,
        senha: data.senha,
        role: data.role,
      });

      toast.success("Sua conta foi criada com sucesso! Redirecionando para o login.");
      navigate("/login");
    } catch (err) {
      toast.error("Não foi possível criar sua conta. Verifique os dados e tente novamente.");
    }
  }

  return (
    <ThemeProvider theme={currentTheme}>
      <S.Page>
        <S.Center>
          <S.Card>
            <S.CardHeader>
              <S.BackButton type="button" onClick={() => navigate("/login")}>
                Voltar
              </S.BackButton>

              <S.SwitchWrap>
                <S.SwitchText>{mode === "dark" ? "Escuro" : "Claro"}</S.SwitchText>
                <S.SwitchButton
                  type="button"
                  $active={mode === "dark"}
                  onClick={() => setMode((p) => (p === "dark" ? "light" : "dark"))}
                  aria-label={mode === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
                  title={mode === "dark" ? "Modo claro" : "Modo escuro"}
                >
                  <span />
                </S.SwitchButton>
              </S.SwitchWrap>
            </S.CardHeader>

            <S.ContentGrid>
              <S.LeftPane>
                <S.Brand>
                  <S.LogoCircle aria-hidden="true">PMI</S.LogoCircle>
                  <div>
                    <S.BrandTitle>Prefeitura</S.BrandTitle>
                    <S.BrandSub>Processo Seletivo</S.BrandSub>
                  </div>
                </S.Brand>

                <S.MessageTitle>Crie sua conta</S.MessageTitle>
                <S.MessageText>
                  Cadastre-se para acompanhar editais, inscrições e resultados do processo seletivo.
                </S.MessageText>

                <S.InfoCard>
                  <S.InfoTitle>Você vai precisar de:</S.InfoTitle>
                  <S.Bullets>
                    <li>Um e-mail válido</li>
                    <li>Uma senha segura</li>
                  </S.Bullets>
                </S.InfoCard>

                <S.DesktopOnly>
                  <S.ThemeRow>
                    <S.ThemeLabel>Modo</S.ThemeLabel>
                    <S.SwitchWrap>
                      <S.SwitchText>{mode === "dark" ? "Escuro" : "Claro"}</S.SwitchText>
                      <S.SwitchButton
                        type="button"
                        $active={mode === "dark"}
                        onClick={() => setMode((p) => (p === "dark" ? "light" : "dark"))}
                      >
                        <span />
                      </S.SwitchButton>
                    </S.SwitchWrap>
                  </S.ThemeRow>
                </S.DesktopOnly>
              </S.LeftPane>

              <S.RightPane>
                <S.FormTitle>Dados de acesso</S.FormTitle>
                <S.FormSub>Preencha para criar sua conta.</S.FormSub>

                <S.Form onSubmit={handleSubmit(handleNovoUser)}>
                  <S.Field>
                    <InputBase
                      label="E-mail"
                      type="email"
                      error={errors.email?.message}
                      {...register("email")}
                    />
                  </S.Field>

                  <S.Field>
                    <S.PasswordWrap>
                      <InputBase
                        label="Senha"
                        type={showPass ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Crie uma senha"
                        error={errors.senha?.message}
                        {...register("senha")}
                      />

                      <S.IconButton
                        type="button"
                        onClick={() => setShowPass((v) => !v)}
                        aria-label={showPass ? "Ocultar senha" : "Mostrar senha"}
                        title={showPass ? "Ocultar senha" : "Mostrar senha"}
                      >
                        {showPass ? "Ocultar" : "Mostrar"}
                      </S.IconButton>
                    </S.PasswordWrap>

                    <S.Rules>
                      <S.Rule $ok={pwd.okLen}>• mínimo 8 caracteres</S.Rule>
                      <S.Rule $ok={pwd.hasLetter}>• pelo menos 1 letra</S.Rule>
                      <S.Rule $ok={pwd.hasNumber}>• pelo menos 1 número</S.Rule>
                    </S.Rules>
                  </S.Field>

                  <S.PrimaryButton disabled={!canSubmit}>
                    {loading ? "Cadastrando..." : "Criar conta"}
                  </S.PrimaryButton>

                  <S.FooterRow>
                    <S.FooterText>Já tem conta?</S.FooterText>
                    <S.LinkButton type="button" onClick={() => navigate("/login")}>
                      Entrar
                    </S.LinkButton>
                  </S.FooterRow>
                </S.Form>
              </S.RightPane>
            </S.ContentGrid>
          </S.Card>
        </S.Center>
      </S.Page>
    </ThemeProvider>
  );
}
