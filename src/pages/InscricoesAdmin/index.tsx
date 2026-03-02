import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import * as S from "./styles";
import { api } from "../../lib/axios"; // ajuste o path

type Vaga = {
  id_vaga: string;
  nome: string;
  nivel?: string;
  quantidade_de_vagas?: number;
};

type Candidato = {
  id_candidato: string;
  nome_completo: string;
  cpf: string;
  // se existir no backend:
  pcd?: boolean | null;
};

type Usuario = {
  id_usuario: string;
  candidato?: Candidato | null;
};

type Inscricao = {
  id_inscricao: string;
  id_processo_seletivo: string;
  id_vaga?: string;

  status: string;
  protocolo: string;

  pontuacao_total?: number | null;
  classificacao?: number | null;
  experiencia_dias?: number | null;
  especializacao_pontos?: number | null;

  data_envio?: string | null;
  data_criacao?: string | null;

  usuario?: Usuario | null;
  vaga?: Vaga | null;
};

type PaginatedResponse<T> = {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

function onlyDigits(v: string) {
  return (v ?? "").replace(/\D/g, "");
}

function formatCPF(v?: string | null) {
  const d = onlyDigits(v ?? "");
  if (d.length !== 11) return v ?? "—";
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

function formatDateTimeBR(v?: string | null) {
  if (!v) return "—";
  const dt = new Date(v);
  if (Number.isNaN(dt.getTime())) return "—";
  return dt.toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusTone(status: string) {
  const s = (status || "").toUpperCase();
  if (s === "ENVIADA" || s === "DEFERIDA") return "success" as const;
  if (s === "RASCUNHO" || s === "ANALISE") return "warning" as const;
  if (s === "CANCELADA" || s === "INDEFERIDA") return "danger" as const;
  return "default" as const;
}

export function InscricoesAdmin() {
  const params = useParams();
  const id_processo_seletivo =
    (params as any)?.id_processo_seletivo || (params as any)?.idProcesso;

  // ========= filtros DO DTO (back) =========
  const [idVaga, setIdVaga] = useState<string>("ALL");
  const [gerarClassificacao, setGerarClassificacao] = useState<boolean>(true);

  // ========= filtros FRONT (ainda não existem no DTO) =========
  const [pcd, setPcd] = useState<"ALL" | "YES" | "NO">("ALL");
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");

  // paginação (back)
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  // debounce (front)
  const [debNome, setDebNome] = useState(nome);
  const [debCpf, setDebCpf] = useState(cpf);

  useEffect(() => {
    const t = setTimeout(() => setDebNome(nome), 300);
    return () => clearTimeout(t);
  }, [nome]);

  useEffect(() => {
    const t = setTimeout(() => setDebCpf(cpf), 300);
    return () => clearTimeout(t);
  }, [cpf]);

  // reset page quando muda filtro do BACK
  useEffect(() => {
    setPage(1);
  }, [idVaga, gerarClassificacao, limit]);

  const inscricoesQuery = useQuery({
    queryKey: [
      "inscricoes-admin",
      id_processo_seletivo,
      page,
      limit,
      idVaga,
      gerarClassificacao,
    ],
    enabled: Boolean(id_processo_seletivo),
    queryFn: async () => {
      const q: any = { page, limit, gerarClassificacao };

      if (idVaga !== "ALL") q.id_vaga = idVaga;

      // ROTA: GET all/:id_processo_seletivo
      const { data } = await api.get<PaginatedResponse<Inscricao>>(
        `processos-seletivos-inscricoes/all/${id_processo_seletivo}`,
        { params: q },
      );

      return data;
    },
    staleTime: 10_000,
  });

  const serverData = inscricoesQuery.data?.data ?? [];
  console.log(serverData)

  // opções de vaga: dá pra montar com base no retorno atual
  // (se quiser perfeito, ideal é ter endpoint /vagas do processo)
  const vagas = useMemo(() => {
    const map = new Map<string, Vaga>();
    for (const i of serverData) {
      if (i?.vaga?.id_vaga) map.set(i.vaga.id_vaga, i.vaga);
      else if (i?.id_vaga) map.set(i.id_vaga, { id_vaga: i.id_vaga, nome: i.id_vaga });
    }
    return Array.from(map.values()).sort((a, b) => (a.nome || "").localeCompare(b.nome || ""));
  }, [serverData]);

  // filtro FRONT (nome/cpf/pcd) aplicado em cima do que veio do servidor
  const filtered = useMemo(() => {
    const nomeQ = debNome.trim().toLowerCase();
    const cpfQ = onlyDigits(debCpf.trim());

    return serverData.filter((i) => {
      const cand = i.usuario?.candidato;

      if (nomeQ) {
        const n = (cand?.nome_completo ?? "").toLowerCase();
        if (!n.includes(nomeQ)) return false;
      }

      if (cpfQ) {
        const c = onlyDigits(cand?.cpf ?? "");
        if (!c.includes(cpfQ)) return false;
      }

      if (pcd !== "ALL") {
        const isPcd = cand?.pcd;
        if (typeof isPcd !== "boolean") return false;
        if (pcd === "YES" && isPcd !== true) return false;
        if (pcd === "NO" && isPcd !== false) return false;
      }

      return true;
    });
  }, [serverData, debNome, debCpf, pcd]);

  const total = inscricoesQuery.data?.total ?? 0;
  const totalPages = inscricoesQuery.data?.totalPages ?? 1;

  const tituloHeader = useMemo(() => {
    // se sua API não retorna o título do processo, fica genérico
    // dá pra buscar em outra rota depois
    return "Inscrições do Processo Seletivo";
  }, []);

  function clearFilters() {
    setIdVaga("ALL");
    setGerarClassificacao(true);
    setPcd("ALL");
    setNome("");
    setCpf("");
    setPage(1);
    setLimit(20);
  }

  const isLoading = inscricoesQuery.isLoading;
  const isError = inscricoesQuery.isError;

  return (
    <S.Page>
      <S.Header>
        <S.HeaderLeft>
          <S.Title>{tituloHeader}</S.Title>
          <S.Subtitle>
            {id_processo_seletivo ? `Processo: ${id_processo_seletivo}` : "Sem ID do processo na rota."}
          </S.Subtitle>

          <S.Pills>
            <S.Pill>
              📌 Total (servidor): <b>{total}</b>
            </S.Pill>
            <S.Pill>
              📄 Página: <b>{page}</b> / <b>{totalPages}</b>
            </S.Pill>
            <S.Pill>
              🔎 Filtrados (front): <b>{filtered.length}</b>
            </S.Pill>
          </S.Pills>
        </S.HeaderLeft>
      </S.Header>

      <S.Card>
        <S.Filters>
          {/* ======= BACK FILTERS ======= */}
          <S.Field>
            <S.Label>Vaga (backend: id_vaga)</S.Label>
            <S.Select value={idVaga} onChange={(e) => setIdVaga(e.target.value)} disabled={isLoading}>
              <option value="ALL">Todas</option>
              {vagas.map((v) => (
                <option key={v.id_vaga} value={v.id_vaga}>
                  {v.nome}
                </option>
              ))}
            </S.Select>
          </S.Field>

          <S.Field>
            <S.Label>Nome (front)</S.Label>
            <S.Input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Filtrar por nome"
              disabled={isLoading}
            />
          </S.Field>

          <S.Field>
            <S.Label>CPF (front)</S.Label>
            <S.Input
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              placeholder="Somente números"
              inputMode="numeric"
              disabled={isLoading}
            />
          </S.Field>

          <S.Field>
            <S.Label>Limite (backend)</S.Label>
            <S.Select value={String(limit)} onChange={(e) => setLimit(Number(e.target.value))} disabled={isLoading}>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </S.Select>
          </S.Field>

          <S.Button onClick={clearFilters} $variant="ghost" type="button" disabled={isLoading}>
            Limpar
          </S.Button>
        </S.Filters>

        {isError && (
          <div>
            Erro ao carregar inscrições. Verifique a baseURL do axios e a rota <b>/all/:id_processo_seletivo</b>.
          </div>
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <S.Empty>Nenhuma inscrição encontrada com os filtros atuais.</S.Empty>
        )}

        <S.TableWrap>
          <S.Table>
            <thead>
              <tr>
                <th>#</th>
                <th>Protocolo</th>
                <th>Nome</th>
                <th>CPF</th>
                <th>Vaga</th>
                <th>Pontuação</th>
                <th>Exp. (dias)</th>
                <th>Status</th>
                <th>Enviado em</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={10} style={{ padding: 14 }}>
                    Carregando...
                  </td>
                </tr>
              ) : (
                filtered.map((i) => {
                  const cand = i.usuario?.candidato;
                  const nomeC = cand?.nome_completo || "—";
                  const cpfC = cand?.cpf || "—";
                  const isPCD = cand?.pcd;

                  return (
                    <tr key={i.id_inscricao}>
                      <td>{i.classificacao ?? "—"}</td>
                      <td>{i.protocolo || "—"}</td>
                      <td title={nomeC}>{nomeC}</td>
                      <td>{formatCPF(cpfC)}</td>
                      <td>{i.vaga?.nome || i.id_vaga || "—"}</td>
                      <td>{i.pontuacao_total ?? "—"}</td>
                      <td>{i.experiencia_dias ?? "—"}</td>
                      <td>
                        <S.Badge $tone={statusTone(i.status)}>{i.status}</S.Badge>
                      </td>
                      <td>{formatDateTimeBR(i.data_envio)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </S.Table>
        </S.TableWrap>

        <S.Footer>
          <S.Muted>
            Mostrando <b>{filtered.length}</b> da página atual (server total: <b>{total}</b>)
          </S.Muted>

          <S.Pagination>
            <S.Button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1 || isLoading}>
              ← Anterior
            </S.Button>

            <S.Pill>
              Página <b>{page}</b> / <b>{totalPages}</b>
            </S.Pill>

            <S.Button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || isLoading}
              $variant="primary"
            >
              Próxima →
            </S.Button>
          </S.Pagination>
        </S.Footer>
      </S.Card>
    </S.Page>
  );
}