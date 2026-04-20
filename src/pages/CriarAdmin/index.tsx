import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  FiUser, FiMail, FiLock, FiEye, FiEyeOff,
  FiCheckCircle, FiXCircle, FiShield, FiCheck,
} from "react-icons/fi";

import * as S from "./styles";
import { criarAdmin } from "../../api/criar-admin";
import { api } from "../../lib/axios";
import { SECRETARIAS } from "../../utils/secreatias.map.utils";

// ─── schema ────────────────────────────────────────────────────────────────

const schema = z.object({
  nome_completo: z.string().min(2, "Nome deve ter pelo menos 2 caracteres.").max(120),
  email: z.string().email("E-mail inválido.").max(120),
  senha: z
    .string()
    .min(8, "Mínimo 8 caracteres.")
    .max(72)
    .regex(/[a-zA-Z]/, "Deve conter pelo menos uma letra.")
    .regex(/\d/, "Deve conter pelo menos um número."),
  secretaria_usuario: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

function passwordScore(pwd: string) {
  return {
    okLen: pwd.length >= 8,
    hasLetter: /[a-zA-Z]/.test(pwd),
    hasNumber: /\d/.test(pwd),
  };
}

const SECRETARIAS_OPTIONS = [
  { value: "all", label: "Todas as secretarias (superadmin)" },
  ...SECRETARIAS.map((s) => ({ value: s, label: s })),
];

async function fetchAdmins() {
  const { data } = await api.get<
    { id_usuario: string; nome_completo: string; email: string; secretaria_usuario: string; ativo: boolean }[]
  >("/auth/admins");
  return data;
}

// ─── component ─────────────────────────────────────────────────────────────

export function CriarAdmin() {
  const queryClient = useQueryClient();
  const [showPass, setShowPass] = useState(false);
  const [lastCreated, setLastCreated] = useState<{ nome: string; email: string } | null>(null);

  const { data: admins = [], isLoading: loadingAdmins } = useQuery({
    queryKey: ["admins-list"],
    queryFn: fetchAdmins,
    staleTime: 30_000,
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { nome_completo: "", email: "", senha: "", secretaria_usuario: "" },
  });

  const senhaValue = watch("senha") ?? "";
  const pwd = useMemo(() => passwordScore(senhaValue), [senhaValue]);
  const canSubmit = isValid && pwd.okLen && pwd.hasLetter && pwd.hasNumber;

  const { mutateAsync, isPending } = useMutation({
    mutationFn: criarAdmin,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admins-list"] }),
  });

  async function onSubmit(data: FormData) {
    try {
      await mutateAsync({
        nome_completo: data.nome_completo.trim(),
        email: data.email.trim(),
        senha: data.senha,
        secretaria_usuario: data.secretaria_usuario || undefined,
      });
      setLastCreated({ nome: data.nome_completo.trim(), email: data.email.trim() });
      toast.success(`Admin "${data.nome_completo.trim()}" criado!`);
      reset();
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 409) toast.error("Este e-mail já está cadastrado.");
      else if (status === 403) toast.error("Sem permissão para criar administradores.");
      else toast.error("Erro ao criar administrador. Tente novamente.");
    }
  }

  return (
    <S.Page>
      <S.PageHeader>
        <S.HeaderLeft>
          <S.Title>Administradores</S.Title>
          <S.Subtitle>Crie e gerencie contas com acesso administrativo ao sistema.</S.Subtitle>
        </S.HeaderLeft>
        <S.CountBadge>
          <FiShield style={{ marginRight: 6 }} />
          {admins.length} admin{admins.length !== 1 ? "s" : ""}
        </S.CountBadge>
      </S.PageHeader>

      {lastCreated && (
        <S.SuccessBox>
          <S.SuccessIcon><FiCheck /></S.SuccessIcon>
          <S.SuccessText>
            <S.SuccessTitle>Admin criado com sucesso</S.SuccessTitle>
            <S.SuccessSub>{lastCreated.nome} · {lastCreated.email}</S.SuccessSub>
          </S.SuccessText>
        </S.SuccessBox>
      )}

      <S.Body>
        {/* ── coluna esquerda: formulário ── */}
        <S.Card>
          <S.CardHeader>
            <S.CardTitle>Novo administrador</S.CardTitle>
          </S.CardHeader>
          <S.CardBody>
            <S.Form onSubmit={handleSubmit(onSubmit)}>
              <S.Field>
                <S.Label htmlFor="nome_completo">Nome completo</S.Label>
                <S.InputWrap>
                  <S.InputIcon><FiUser /></S.InputIcon>
                  <S.Input
                    id="nome_completo"
                    type="text"
                    autoComplete="name"
                    placeholder="Nome do administrador"
                    $error={!!errors.nome_completo}
                    {...register("nome_completo")}
                  />
                </S.InputWrap>
                {errors.nome_completo && <S.ErrorText>{errors.nome_completo.message}</S.ErrorText>}
              </S.Field>

              <S.Field>
                <S.Label htmlFor="email">E-mail institucional</S.Label>
                <S.InputWrap>
                  <S.InputIcon><FiMail /></S.InputIcon>
                  <S.Input
                    id="email"
                    type="email"
                    inputMode="email"
                    autoComplete="off"
                    placeholder="admin@exemplo.gov.br"
                    $error={!!errors.email}
                    {...register("email")}
                  />
                </S.InputWrap>
                {errors.email && <S.ErrorText>{errors.email.message}</S.ErrorText>}
              </S.Field>

              <S.Field>
                <S.Label htmlFor="secretaria_usuario">Secretaria</S.Label>
                <S.Select id="secretaria_usuario" {...register("secretaria_usuario")}>
                  <option value="">Nenhuma (sem secretaria vinculada)</option>
                  {SECRETARIAS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </S.Select>
              </S.Field>

              <S.Field>
                <S.Label htmlFor="senha">Senha inicial</S.Label>
                <S.InputWrap>
                  <S.InputIcon><FiLock /></S.InputIcon>
                  <S.Input
                    id="senha"
                    type={showPass ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Defina uma senha"
                    $error={!!errors.senha}
                    {...register("senha")}
                  />
                  <S.IconButton
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    aria-label={showPass ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPass ? <FiEyeOff /> : <FiEye />}
                  </S.IconButton>
                </S.InputWrap>
                <S.Rules>
                  <S.Rule $ok={pwd.okLen}>
                    {pwd.okLen ? <FiCheckCircle /> : <FiXCircle />} Mínimo 8 caracteres
                  </S.Rule>
                  <S.Rule $ok={pwd.hasLetter}>
                    {pwd.hasLetter ? <FiCheckCircle /> : <FiXCircle />} Pelo menos 1 letra
                  </S.Rule>
                  <S.Rule $ok={pwd.hasNumber}>
                    {pwd.hasNumber ? <FiCheckCircle /> : <FiXCircle />} Pelo menos 1 número
                  </S.Rule>
                </S.Rules>
              </S.Field>

              <S.Divider />

              <S.PrimaryButton type="submit" disabled={!canSubmit || isPending}>
                {isPending ? "Criando..." : "Criar administrador"}
              </S.PrimaryButton>
            </S.Form>
          </S.CardBody>
        </S.Card>

        {/* ── coluna direita: lista ── */}
        <S.Card>
          <S.CardHeader>
            <S.CardTitle>Administradores cadastrados</S.CardTitle>
            <S.CountBadge>{admins.length}</S.CountBadge>
          </S.CardHeader>

          <S.AdminTable>
            {loadingAdmins ? (
              <S.LoadingState>Carregando...</S.LoadingState>
            ) : admins.length === 0 ? (
              <S.EmptyState>
                <FiShield size={32} />
                <span>Nenhum administrador cadastrado ainda.</span>
              </S.EmptyState>
            ) : (
              admins.map((a) => (
                <S.AdminRow key={a.id_usuario}>
                  <S.Avatar>{(a.nome_completo || "A").charAt(0).toUpperCase()}</S.Avatar>
                  <S.AdminInfo>
                    <S.AdminName>{a.nome_completo || "—"}</S.AdminName>
                    <S.AdminEmail>{a.email}</S.AdminEmail>
                  </S.AdminInfo>
                  {a.secretaria_usuario && (
                    <S.SecretariaPill title={a.secretaria_usuario}>
                      {a.secretaria_usuario === "all" ? "Todas" : a.secretaria_usuario}
                    </S.SecretariaPill>
                  )}
                </S.AdminRow>
              ))
            )}
          </S.AdminTable>
        </S.Card>
      </S.Body>
    </S.Page>
  );
}
