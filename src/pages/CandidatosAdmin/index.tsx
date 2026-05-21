import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  Database,
  Filter,
  RotateCcw,
  Trash2,
} from "lucide-react";

import {
  listarCandidatosAdmin,
  removerCandidatoAdmin,
  type CandidatoAdmin,
  type ListarCandidatosParams,
} from "../../api/candidatos-admin";
import { formatCPF } from "../../utils/formart-cpf";
import { formatPhoneBR } from "../../utils/formatPhoneBR";
import { InputBase } from "../../components/InputBase";
import { SelectBase } from "../../components/SelectBase";
import * as S from "./styles";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const UF_OPTIONS = [
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
];

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  const [date] = value.split("T");
  const parts = date.split("-");
  if (parts.length !== 3) return "-";
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function locationOf(candidato: CandidatoAdmin) {
  if (candidato.cidade && candidato.uf) return `${candidato.cidade} / ${candidato.uf}`;
  return candidato.cidade || candidato.uf || "-";
}

export function CandidatosAdmin() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [filters, setFilters] = useState({
    nome: "",
    email: "",
    cpf: "",
    cidade: "",
    uf: "",
  });
  const [draftFilters, setDraftFilters] = useState(filters);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const params = useMemo<ListarCandidatosParams>(
    () => ({
      page,
      limit,
      nome: filters.nome.trim() || undefined,
      email: filters.email.trim() || undefined,
      cpf: onlyDigits(filters.cpf) || undefined,
      cidade: filters.cidade.trim() || undefined,
      uf: filters.uf.trim().toUpperCase() || undefined,
    }),
    [filters, limit, page],
  );

  const { data, isFetching, isLoading, isError } = useQuery({
    queryKey: ["candidatos-admin", params],
    queryFn: () => listarCandidatosAdmin(params),
    staleTime: 30_000,
  });

  const removerMutation = useMutation({
    mutationFn: removerCandidatoAdmin,
    onSuccess: (result) => {
      toast.success(
        result.inscricoes_count > 0
          ? "Candidato removido. As inscricoes vinculadas ao usuario foram preservadas."
          : "Candidato removido.",
      );
      setConfirmDelete(null);
      queryClient.invalidateQueries({ queryKey: ["candidatos-admin"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Erro ao remover candidato.");
    },
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const firstItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const lastItem = Math.min(page * limit, total);
  const activeFilterCount = Object.entries(filters).filter(([, value]) => value).length;
  const hasFilters = activeFilterCount > 0 || Object.values(draftFilters).some(Boolean);

  function updateDraftFilter(key: keyof typeof draftFilters, value: string) {
    setDraftFilters((current) => ({ ...current, [key]: value }));
  }

  function applyFilters() {
    setFilters(draftFilters);
    setPage(1);
  }

  function clearFilters() {
    const emptyFilters = { nome: "", email: "", cpf: "", cidade: "", uf: "" };
    setDraftFilters(emptyFilters);
    setFilters(emptyFilters);
    setPage(1);
  }

  function renderDeleteAction(candidato: CandidatoAdmin) {
    if (confirmDelete === candidato.id_candidato) {
      return (
        <S.ConfirmGroup>
          <S.DangerButton
            type="button"
            onClick={() => removerMutation.mutate(candidato.id_candidato)}
            disabled={removerMutation.isPending}
          >
            Confirmar
          </S.DangerButton>
          <S.GhostButton type="button" onClick={() => setConfirmDelete(null)}>
            Cancelar
          </S.GhostButton>
        </S.ConfirmGroup>
      );
    }

    return (
      <S.IconDangerButton
        type="button"
        onClick={() => setConfirmDelete(candidato.id_candidato)}
        title="Remover candidato"
      >
        <Trash2 size={16} />
      </S.IconDangerButton>
    );
  }

  return (
    <S.Page>
      <S.ExecutiveHeader>
        <S.HeaderContent>
          <S.Title>Registro geral de candidatos</S.Title>
        </S.HeaderContent>

        <S.HeaderStatus>
          <Database size={18} />
          <span>{isFetching ? "Sincronizando dados" : "Base atualizada"}</span>
        </S.HeaderStatus>
      </S.ExecutiveHeader>

      <S.ControlPanel>
        <S.ControlHeader>
          <S.ControlTitle>
            <Filter size={16} />
            Filtros e consulta
          </S.ControlTitle>
          <S.ControlActions>
            <S.Select
              aria-label="Itens por pagina"
              value={limit}
              onChange={(event) => {
                setLimit(Number(event.target.value));
                setPage(1);
              }}
            >
              {PAGE_SIZE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option} por pagina
                </option>
              ))}
            </S.Select>
            <S.ResetButton type="button" onClick={clearFilters} disabled={!hasFilters}>
              <RotateCcw size={15} />
              Limpar filtros
            </S.ResetButton>
            <S.FilterButton type="button" onClick={applyFilters}>
              <Filter size={15} />
              Filtrar
            </S.FilterButton>
          </S.ControlActions>
        </S.ControlHeader>

        <S.FilterGrid>
          <S.Field>
            <InputBase
              id="filtro-nome"
              label="Nome"
              placeholder="Digite o nome"
              value={draftFilters.nome}
              onChange={(event) => updateDraftFilter("nome", event.target.value)}
            />
          </S.Field>
          <S.Field>
            <InputBase
              id="filtro-email"
              label="E-mail"
              placeholder="exemplo@email.com"
              value={draftFilters.email}
              onChange={(event) => updateDraftFilter("email", event.target.value)}
              inputMode="email"
            />
          </S.Field>
          <S.Field>
            <InputBase
              id="filtro-cpf"
              label="CPF"
              placeholder="000.000.000-00"
              value={draftFilters.cpf}
              onChange={(event) => updateDraftFilter("cpf", event.target.value)}
              inputMode="numeric"
            />
          </S.Field>
          <S.Field>
            <InputBase
              id="filtro-cidade"
              label="Cidade"
              placeholder="Digite a cidade"
              value={draftFilters.cidade}
              onChange={(event) => updateDraftFilter("cidade", event.target.value)}
            />
          </S.Field>
          <S.Field>
            <SelectBase
              id="filtro-uf"
              label="UF"
              value={draftFilters.uf}
              onChange={(event) => updateDraftFilter("uf", event.target.value)}
            >
              <option value="">Selecione uma UF</option>
              {UF_OPTIONS.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </SelectBase>
          </S.Field>
        </S.FilterGrid>
      </S.ControlPanel>

      <S.DataPanel>
        <S.DataHeader>
          <S.DataTitle>Resultados</S.DataTitle>
          <S.ResultsMeta>
            {isFetching ? "Atualizando..." : `${firstItem}-${lastItem} de ${total}`}
          </S.ResultsMeta>
        </S.DataHeader>

        {isError ? (
          <S.State $variant="error">Nao foi possivel carregar os candidatos.</S.State>
        ) : isLoading ? (
          <S.State>Carregando candidatos...</S.State>
        ) : items.length === 0 ? (
          <S.State>Nenhum candidato encontrado.</S.State>
        ) : (
          <>
            <S.TableWrap>
              <S.Table>
                <thead>
                  <tr>
                    <S.Th>Candidato</S.Th>
                    <S.Th>Contato</S.Th>
                    <S.Th>Localidade</S.Th>
                    <S.Th>Nascimento</S.Th>
                    <S.Th $center>Inscricoes</S.Th>
                    <S.Th $actions>Acoes</S.Th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((candidato) => (
                    <S.Tr key={candidato.id_candidato}>
                      <S.Td>
                        <S.PersonName>{candidato.nome_completo || "-"}</S.PersonName>
                        <S.PersonDoc>{formatCPF(candidato.cpf)}</S.PersonDoc>
                      </S.Td>
                      <S.Td>
                        <S.CellStrong>{candidato.email}</S.CellStrong>
                        <S.CellSub>{formatPhoneBR(candidato.telefone)}</S.CellSub>
                      </S.Td>
                      <S.Td>
                        <S.CellStrong>{locationOf(candidato)}</S.CellStrong>
                      </S.Td>
                      <S.Td>{formatDate(candidato.data_nascimento)}</S.Td>
                      <S.Td $center>
                        <S.CountPill>{candidato.inscricoes_count}</S.CountPill>
                      </S.Td>
                      <S.Td $actions>{renderDeleteAction(candidato)}</S.Td>
                    </S.Tr>
                  ))}
                </tbody>
              </S.Table>
            </S.TableWrap>

            <S.MobileList>
              {items.map((candidato) => (
                <S.MobileRecord key={candidato.id_candidato}>
                  <S.MobileRecordBody>
                    <S.PersonName>{candidato.nome_completo || "-"}</S.PersonName>
                    <S.MobileMeta>{formatCPF(candidato.cpf)}</S.MobileMeta>
                    <S.MobileInfoGrid>
                      <span>{candidato.email}</span>
                      <span>{formatPhoneBR(candidato.telefone)}</span>
                      <span>{locationOf(candidato)}</span>
                      <span>{formatDate(candidato.data_nascimento)}</span>
                    </S.MobileInfoGrid>
                  </S.MobileRecordBody>
                  <S.MobileRecordAside>
                    <S.CountPill>{candidato.inscricoes_count}</S.CountPill>
                    {renderDeleteAction(candidato)}
                  </S.MobileRecordAside>
                </S.MobileRecord>
              ))}
            </S.MobileList>
          </>
        )}
      </S.DataPanel>

      <S.Pagination>
        <S.PageButton
          type="button"
          onClick={() => setPage((current) => Math.max(1, current - 1))}
          disabled={page <= 1}
          title="Pagina anterior"
        >
          <ChevronLeft size={16} />
        </S.PageButton>
        <S.PageInfo>
          Pagina <b>{page}</b> de <b>{totalPages}</b>
        </S.PageInfo>
        <S.PageButton
          type="button"
          onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
          disabled={page >= totalPages}
          title="Proxima pagina"
        >
          <ChevronRight size={16} />
        </S.PageButton>
      </S.Pagination>
    </S.Page>
  );
}
