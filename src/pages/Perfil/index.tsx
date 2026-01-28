import { useEffect, useState } from "react";
import {
  FiUser,
  FiMapPin,
  FiFileText,
  FiUploadCloud,
  FiTrash2,
  FiSave,
  FiShield,
} from "react-icons/fi";

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

import { ModalAddAnexo } from "./components/ModalAddAnexo";
import { getDocumentosMe } from "../../api/get-documentos-me";
import {
  removeDocumentoMe,
  type CandidatoDocumentoDTO,
} from "../../api/remove-documento-me";
import { formatTelefone, unformatTelefone } from "../../utils/formart-phone";
import { formatCPF } from "../../utils/formart-cpf";

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

  // força UTC para não "voltar um dia"
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(2)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(2)} GB`;
}

export function Perfil() {
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [openModal, setOpenModal] = useState(false);

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
    onError: () => {
      toast.error("Erro ao atualizar o perfil. Tente novamente.");
    },
  });

  const isSaving = updateMutation.isPending;
  const locked = !isEditing || isSaving;

  // ===== Documentos (lista real) =====
  const {
    data: docs = [],
    isLoading: isLoadingDocs,
    isFetching: isFetchingDocs,
  } = useQuery({
    queryKey: ["me-documentos"],
    queryFn: getDocumentosMe,
    enabled: !!result?.candidato,
  });

  const removeDocMutation = useMutation({
    mutationFn: removeDocumentoMe,
    onSuccess: () => {
      toast.success("Documento removido!");
      queryClient.invalidateQueries({ queryKey: ["me-documentos"] });
    },
    onError: () => toast.error("Erro ao remover documento."),
  });

  const cepValue = watch("cep");

  // Busca ViaCEP quando tiver 8 dígitos
  useEffect(() => {
    // só auto-preenche quando estiver editando
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

  const docsBusy = isLoadingDocs || isFetchingDocs;

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

            <S.SelectField>
              <S.SelectLabel htmlFor="uf">UF</S.SelectLabel>
              <S.Select
                id="uf"
                defaultValue="MG"
                disabled={locked}
                {...register("uf")}
              >
                {[
                  "AC",
                  "AL",
                  "AP",
                  "AM",
                  "BA",
                  "CE",
                  "DF",
                  "ES",
                  "GO",
                  "MA",
                  "MT",
                  "MS",
                  "MG",
                  "PA",
                  "PB",
                  "PR",
                  "PE",
                  "PI",
                  "RJ",
                  "RN",
                  "RS",
                  "RO",
                  "RR",
                  "SC",
                  "SP",
                  "SE",
                  "TO",
                ].map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </S.Select>
            </S.SelectField>
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
          <S.CardHeader>
            <S.CardIcon $variant="success">
              <FiFileText />
            </S.CardIcon>

            <S.CardHeaderText>
              <S.CardTitle>Documentos</S.CardTitle>
              <S.CardDesc>
                Envie arquivos e mantenha tudo organizado.
              </S.CardDesc>
            </S.CardHeaderText>
          </S.CardHeader>

          <S.DocActions>
            <S.UploadButton type="button" onClick={() => setOpenModal(true)}>
              <FiUploadCloud />
              Adicionar arquivo
            </S.UploadButton>
          </S.DocActions>

          {docsBusy ? (
            <S.Empty>
              <S.EmptyTitle>Carregando documentos...</S.EmptyTitle>
            </S.Empty>
          ) : docs.length === 0 ? (
            <S.Empty>
              <S.EmptyIcon>
                <FiShield />
              </S.EmptyIcon>
              <S.EmptyTitle>Nenhum documento enviado</S.EmptyTitle>
              <S.EmptyDesc>
                Clique em <strong>Adicionar arquivo</strong> para enviar seus
                documentos.
              </S.EmptyDesc>
            </S.Empty>
          ) : (
            <S.DocList>
              {docs.map((d: CandidatoDocumentoDTO) => (
                <S.DocItem key={d.id_candidato_documento}>
                  <S.DocLeft>
                    <S.DocBadge>{d.tipo}</S.DocBadge>
                    <S.DocInfo>
                      <S.DocName title={d.arquivo.nome_original}>
                        {d.arquivo.nome_original}
                      </S.DocName>
                      <S.DocMeta>
                        {formatBytes(d.arquivo.tamanho_bytes)} •{" "}
                        {new Date(d.data_criacao).toLocaleDateString("pt-BR")}
                      </S.DocMeta>
                    </S.DocInfo>
                  </S.DocLeft>

                  <S.DocRight>
                    <S.DangerIconButton
                      type="button"
                      title="Remover"
                      disabled={
                        !isEditing || isSaving || removeDocMutation.isPending
                      }
                      onClick={() =>
                        removeDocMutation.mutate(d.id_candidato_documento)
                      }
                    >
                      <FiTrash2 />
                    </S.DangerIconButton>
                  </S.DocRight>
                </S.DocItem>
              ))}
            </S.DocList>
          )}

          <S.FooterActions>
            <S.SecondaryButton type="button" disabled={!isEditing || isSaving}>
              <FiSave />
              Salvar alterações
            </S.SecondaryButton>
          </S.FooterActions>
        </S.Card>
      </S.Content>

      <ModalAddAnexo open={openModal} onOpenChange={setOpenModal} />
    </S.Page>
  );
}
