import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import * as S from "./styles";

import {
  createNovoUserSchema,
  type CreateNovoUserFormData,
} from "../../schemas/create-novo-user";

import { FormMessage } from "../../components/FormMessage";
import { novoUsuario } from "../../api/novo-usuario";
import { handleCadastroError } from "../../errs/handle.cadastro.erro"; // 👈 use o handler

import { useTheme } from "../../contexts/ThemeContext";

import {
  FiSun,
  FiMoon,
  FiEye,
  FiEyeOff,
  FiLock,
  FiUser,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

import Logo from "../../assets/logo.png";
import logo_pmi from "../../assets/logo-pmi-positiva.png";
import logo_pmi_negativa from "../../assets/logo-pmi-negativa.png";
import { PageTransition } from "../../components/PageTransition";

function passwordScore(pwd: string) {
  const okLen = pwd.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(pwd);
  const hasNumber = /\d/.test(pwd);
  return { okLen, hasLetter, hasNumber, ok: okLen && hasLetter && hasNumber };
}

type InlineMsg = {
  message?: string;
  type?: "success" | "error" | "warning";
};

export function Cadastro() {
  const navigate = useNavigate();
  const { mode, toggleTheme } = useTheme();

  const [showPass, setShowPass] = useState(false);
  const [inlineMsg, setInlineMsg] = useState<InlineMsg>({});

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
      role: "CANDIDATO",
    },
  });

  // limpa mensagem da API/sucesso quando o usuário altera qualquer campo
  useEffect(() => {
    const sub = watch(() => {
      setInlineMsg((prev) =>
        prev.type === "error" || prev.type === "success" ? {} : prev,
      );
    });
    return () => sub.unsubscribe();
  }, [watch]);

  const senhaValue = watch("senha") ?? "";
  const pwd = useMemo(() => passwordScore(senhaValue), [senhaValue]);

  const { mutateAsync: novoUsuarioFn, isPending } = useMutation({
    mutationFn: novoUsuario,
  });

  const canSubmit = isValid && pwd.ok && !isPending;

  async function onSubmit(data: CreateNovoUserFormData) {
    try {
      setInlineMsg({});

      await novoUsuarioFn({
        email: data.email,
        senha: data.senha,
        role: data.role,
      });

      setInlineMsg({
        type: "success",
        message: "Conta criada com sucesso! Redirecionando para o login…",
      });

      toast.success("Conta criada com sucesso! Faça login para continuar.");
      navigate("/login", { replace: true });
    } catch (err) {
      // ✅ erro da API
      setInlineMsg({
        type: "error",
        message: handleCadastroError(err),
      });
    }
  }

  const zodMsg =
    errors.email?.message ||
    errors.senha?.message ||
    (pwd.ok ? undefined : "A senha precisa cumprir os requisitos acima.");

  const message = inlineMsg.message ?? zodMsg;
  const type: "success" | "error" | "warning" | undefined =
    inlineMsg.type ?? (zodMsg ? "warning" : undefined);

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
                <S.MessageTitle>Crie sua conta ✨</S.MessageTitle>
                <S.MessageText>
                  Cadastre-se para acompanhar editais, inscrições, convocações e
                  resultados.
                </S.MessageText>

                <S.InfoCard>
                  <S.InfoTitle>Requisitos de senha</S.InfoTitle>
                  <S.InfoText>
                    Use uma senha com <b>mínimo de 8 caracteres</b>, contendo{" "}
                    <b>letras</b> e <b>números</b>.
                  </S.InfoText>
                </S.InfoCard>

                <S.BottomNote>
                  Já tem conta?{" "}
                  <S.LinkInline
                    type="button"
                    onClick={() => navigate("/login")}
                  >
                    Entrar
                  </S.LinkInline>
                </S.BottomNote>
              </S.LeftPane>

              <S.RightPane>
                <S.FormTitle>Dados de acesso</S.FormTitle>
                <S.FormSub>Preencha para criar sua conta.</S.FormSub>

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
                        autoComplete="new-password"
                        placeholder="Crie uma senha"
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

                    <S.Rules>
                      <S.Rule $ok={pwd.okLen}>
                        <S.RuleIconWrap $ok={pwd.okLen}>
                          {pwd.okLen ? <FiCheckCircle /> : <FiXCircle />}
                        </S.RuleIconWrap>
                        Mínimo de 8 caracteres
                      </S.Rule>

                      <S.Rule $ok={pwd.hasLetter}>
                        <S.RuleIconWrap $ok={pwd.hasLetter}>
                          {pwd.hasLetter ? <FiCheckCircle /> : <FiXCircle />}
                        </S.RuleIconWrap>
                        Pelo menos 1 letra
                      </S.Rule>

                      <S.Rule $ok={pwd.hasNumber}>
                        <S.RuleIconWrap $ok={pwd.hasNumber}>
                          {pwd.hasNumber ? <FiCheckCircle /> : <FiXCircle />}
                        </S.RuleIconWrap>
                        Pelo menos 1 número
                      </S.Rule>
                    </S.Rules>
                  </S.Field>

                  <FormMessage message={message} type={type} />

                  <S.PrimaryButton disabled={!canSubmit}>
                    {isPending ? "Cadastrando..." : "Criar conta"}
                  </S.PrimaryButton>

                  <S.Divider>
                    <span>ou</span>
                  </S.Divider>

                  <S.SecondaryButton
                    type="button"
                    onClick={() => navigate("/login")}
                    disabled={isPending}
                  >
                    Voltar para o login
                  </S.SecondaryButton>

                  <S.FooterHint>
                    Ao continuar, você concorda com os termos e a política de
                    privacidade.
                  </S.FooterHint>
                </S.Form>
              </S.RightPane>
            </S.ContentGrid>
          </S.Card>
        </S.Center>
      </S.Page>
    </PageTransition>
  );
}
