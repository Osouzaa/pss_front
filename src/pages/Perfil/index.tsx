import { useEffect, useState } from "react";
import { FiUser, FiMapPin, FiSave } from "react-icons/fi";

import * as S from "./styles";
import { InputBase } from "../../components/InputBase";
import { Controller, useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createCandidateSchema,
  type CreateCandidateFormData,
} from "../../schemas/create-candidate";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { atualizarInfoCandidate } from "../../api/atualiza-info-candidates";
import { toast } from "sonner";
import { getMe } from "../../api/get-me";

import { formatTelefone, unformatTelefone } from "../../utils/formart-phone";
import { formatCPF } from "../../utils/formart-cpf";
import { AnexosUser } from "../../components/AnexosUser";
import { atualizacaoPerfilError } from "../../errs/atualizacao.perfil.erro";

type ViaCepResponse = {
  cep?: string;
  logradouro?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string; // cidade
  uf?: string;
  erro?: boolean;
};

function toDateInputValue(value?: string | null) {
  if (!value) return "";
  // se já vier YYYY-MM-DD, retorna direto
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const d = new Date(value); // ISO
  if (Number.isNaN(d.getTime())) return "";

  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function Perfil() {
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);

  const { data: result, isLoading: isLoadingMe } = useQuery({
    queryFn: getMe,
    queryKey: ["me"],
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    reset,
    formState: { errors },
    control,
  } = useForm<CreateCandidateFormData>({
    resolver: zodResolver(createCandidateSchema),
    mode: "onBlur",
    defaultValues: { uf: "MG" },
  });

  const { field: cpfField } = useController({
    name: "cpf",
    control,
  });

  useEffect(() => {
    const cand = result?.candidato;
    if (!cand) return;

    reset({
      nome_completo: cand.nome_completo ?? "",
      email: cand.email ?? "",
      telefone: cand.telefone ?? "",
      cpf: cand.cpf ?? "",
      rg: cand.rg ?? "",
      data_nascimento: toDateInputValue(cand.data_nascimento),
      cep: cand.cep ?? "",
      logradouro: cand.logradouro ?? "",
      numero: cand.numero ?? "",
      complemento: cand.complemento ?? "",
      bairro: cand.bairro ?? "",
      cidade: cand.cidade ?? "",
      uf: (cand.uf ?? "MG").toUpperCase(),
    });
  }, [result, reset]);

  const updateMutation = useMutation({
    mutationFn: atualizarInfoCandidate,
    onSuccess: () => {
      toast.success("Perfil atualizado com sucesso!");
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (err) => {
      toast.error(atualizacaoPerfilError(err));
    },
  });
  const isSaving = updateMutation.isPending;
  const locked = !isEditing || isSaving;

  const cepValue = watch("cep");

  useEffect(() => {
    if (!isEditing) return;

    const cepDigits = (cepValue ?? "").replace(/\D/g, "");
    if (cepDigits.length !== 8) return;

    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cepDigits}/json/`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          setError("cep", {
            type: "manual",
            message: "Não foi possível consultar o CEP",
          });
          return;
        }

        const data = (await res.json()) as ViaCepResponse;

        if (data?.erro) {
          setError("cep", { type: "manual", message: "CEP não encontrado" });
          return;
        }

        setValue("logradouro", data.logradouro ?? "", { shouldValidate: true });
        setValue("bairro", data.bairro ?? "", { shouldValidate: true });
        setValue("cidade", data.localidade ?? "", { shouldValidate: true });
        setValue("uf", (data.uf ?? "MG").toUpperCase(), {
          shouldValidate: true,
        });
      } catch (e: any) {
        if (e?.name === "AbortError") return;
        setError("cep", {
          type: "manual",
          message: "Erro ao consultar ViaCEP",
        });
      }
    })();

    return () => controller.abort();
  }, [cepValue, setError, setValue, isEditing]);

  async function onSubmit(values: CreateCandidateFormData) {
    // garante formato de data pro backend (YYYY-MM-DD)
    const payload: CreateCandidateFormData = {
      ...values,
      data_nascimento: values.data_nascimento
        ? toDateInputValue(values.data_nascimento)
        : (values.data_nascimento ?? ""),
    };

    await updateMutation.mutateAsync(payload);
  }

  function handleToggleEdit() {
    if (isSaving) return;

    if (isEditing) {
      // cancelar edição: volta pro que veio da API
      const cand = result?.candidato;
      if (cand) {
        reset({
          nome_completo: cand.nome_completo ?? "",
          email: cand.email ?? "",
          telefone: cand.telefone ?? "",
          cpf: cand.cpf ?? "",
          rg: cand.rg ?? "",
          data_nascimento: toDateInputValue(cand.data_nascimento),
          cep: cand.cep ?? "",
          logradouro: cand.logradouro ?? "",
          numero: cand.numero ?? "",
          complemento: cand.complemento ?? "",
          bairro: cand.bairro ?? "",
          cidade: cand.cidade ?? "",
          uf: (cand.uf ?? "MG").toUpperCase(),
        });
      }
      setIsEditing(false);
      return;
    }

    setIsEditing(true);
  }

  return (
    <S.Page>
      <S.Header>
        <S.TitleWrap>
          <S.Title>Perfil</S.Title>
          <S.Subtitle>Atualize seus dados e envie documentos.</S.Subtitle>
        </S.TitleWrap>

        <S.HeaderActions>
          <S.SecondaryButton
            type="button"
            onClick={handleToggleEdit}
            disabled={isSaving || isLoadingMe}
          >
            {isEditing ? "Cancelar" : "Editar"}
          </S.SecondaryButton>

          <S.PrimaryButton
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={!isEditing || isSaving || isLoadingMe}
          >
            <FiSave />
            {isSaving ? "Salvando..." : "Salvar"}
          </S.PrimaryButton>
        </S.HeaderActions>
      </S.Header>

      <S.Content>
        {/* ===== Coluna 1: Dados pessoais + Endereço ===== */}
        <S.Card>
          <S.CardHeader>
            <S.CardIcon $variant="primary">
              <FiUser />
            </S.CardIcon>

            <S.CardHeaderText>
              <S.CardTitle>Dados pessoais</S.CardTitle>
              <S.CardDesc>Informações básicas do candidato.</S.CardDesc>
            </S.CardHeaderText>
          </S.CardHeader>

          <S.FormGrid>
            <InputBase
              id="nome_completo"
              label="Nome completo"
              placeholder="Seu nome completo"
              autoComplete="name"
              error={errors.nome_completo?.message}
              disabled={locked}
              {...register("nome_completo")}
            />

            <InputBase
              id="email"
              label="E-mail"
              placeholder="seuemail@dominio.com"
              inputMode="email"
              autoComplete="email"
              error={errors.email?.message}
              disabled={locked}
              {...register("email")}
            />

            <Controller
              name="telefone"
              control={control}
              render={({ field }) => {
                const formmatedValue = formatTelefone(field.value || "");
                return (
                  <InputBase
                    id="telefone"
                    label="Telefone"
                    placeholder="(00) 00000-0000"
                    inputMode="tel"
                    autoComplete="tel"
                    error={errors.telefone?.message}
                    disabled={locked}
                    value={formmatedValue}
                    onChange={(e) => {
                      const rawValue = unformatTelefone(e.target.value);
                      field.onChange(rawValue);
                    }}
                    onBlur={field.onBlur}
                  />
                );
              }}
            />

            <InputBase
              id="data_nascimento"
              label="Data de nascimento"
              type="date"
              error={errors.data_nascimento?.message}
              disabled={locked}
              {...register("data_nascimento")}
            />

            <InputBase
              id="cpf"
              label="CPF"
              placeholder="000.000.000-00"
              inputMode="numeric"
              autoComplete="off"
              error={errors.cpf?.message}
              disabled={locked}
              {...register("cpf")}
              value={cpfField.value ?? ""}
              onChange={(e) => cpfField.onChange(formatCPF(e.target.value))}
              onBlur={cpfField.onBlur}
            />

            <InputBase
              id="rg"
              label="RG"
              placeholder="RG"
              autoComplete="off"
              error={errors.rg?.message}
              disabled={locked}
              {...register("rg")}
            />
          </S.FormGrid>

          <S.Divider />

          <S.CardHeader>
            <S.CardIcon $variant="default">
              <FiMapPin />
            </S.CardIcon>

            <S.CardHeaderText>
              <S.CardTitle>Endereço</S.CardTitle>
              <S.CardDesc>
                Digite o CEP para preencher automaticamente.
              </S.CardDesc>
            </S.CardHeaderText>
          </S.CardHeader>

          <S.FormGrid>
            <InputBase
              id="cep"
              label="CEP"
              placeholder="00000-000"
              inputMode="numeric"
              autoComplete="postal-code"
              error={errors.cep?.message}
              disabled={locked}
              {...register("cep")}
            />

            <InputBase
              id="logradouro"
              label="Endereço"
              placeholder="Rua, Avenida..."
              autoComplete="address-line1"
              error={errors.logradouro?.message}
              disabled={locked}
              {...register("logradouro")}
            />

            <InputBase
              id="numero"
              label="Número"
              placeholder="Nº"
              inputMode="numeric"
              autoComplete="address-line2"
              error={errors.numero?.message}
              disabled={locked}
              {...register("numero")}
            />

            <InputBase
              id="complemento"
              label="Complemento"
              placeholder="Apto, bloco..."
              autoComplete="off"
              error={errors.complemento?.message}
              disabled={locked}
              {...register("complemento")}
            />

            <InputBase
              id="bairro"
              label="Bairro"
              placeholder="Bairro"
              autoComplete="address-level3"
              error={errors.bairro?.message}
              disabled={locked}
              {...register("bairro")}
            />

            <InputBase
              id="cidade"
              label="Cidade"
              placeholder="Cidade"
              autoComplete="address-level2"
              error={errors.cidade?.message}
              disabled={locked}
              {...register("cidade")}
            />

            <InputBase
              id="uf"
              label="Uf"
              placeholder="Ex: MG"
              error={errors.uf?.message}
              disabled={locked}
              {...register("uf")}
            />
          </S.FormGrid>
          <S.FooterActions>
            <S.SecondaryButton
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={!isEditing || isSaving}
            >
              <FiSave />
              {isSaving ? "Salvando..." : "Salvar alterações"}
            </S.SecondaryButton>
          </S.FooterActions>
        </S.Card>
        <S.Card>
          <AnexosUser />
        </S.Card>
      </S.Content>
    </S.Page>
  );
}
