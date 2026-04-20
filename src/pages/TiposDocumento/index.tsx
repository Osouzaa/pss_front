import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FiFileText, FiEdit2, FiSearch, FiX } from "react-icons/fi";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as S from "./styles";
import {
  getTiposDocumento,
  criarTipoDocumento,
  atualizarTipoDocumento,
  removerTipoDocumento,
  type TipoDocumento,
} from "../../api/tipo-documento";

type Filter = "todos" | "ativos" | "inativos";

const PAGE_SIZE = 10;

export function TiposDocumento() {
  const qc = useQueryClient();

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [erroNome, setErroNome] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("todos");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data: tipos = [], isLoading } = useQuery({
    queryKey: ["tipos-documento"],
    queryFn: () => getTiposDocumento(),
  });

  // reset página quando filtro ou busca mudam
  useEffect(() => { setPage(1); }, [filter, search]);

  const filtered = useMemo(() => {
    let list = tipos;
    if (filter === "ativos") list = list.filter((t) => t.ativo);
    if (filter === "inativos") list = list.filter((t) => !t.ativo);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (t) =>
          t.nome.toLowerCase().includes(q) ||
          (t.descricao ?? "").toLowerCase().includes(q),
      );
    }
    return list;
  }, [tipos, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const ativos = tipos.filter((t) => t.ativo).length;
  const inativos = tipos.length - ativos;

  const invalidate = () => qc.invalidateQueries({ queryKey: ["tipos-documento"] });

  const criarMutation = useMutation({
    mutationFn: criarTipoDocumento,
    onSuccess: () => { toast.success("Tipo criado!"); resetForm(); invalidate(); },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "Erro ao criar"),
  });

  const atualizarMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof atualizarTipoDocumento>[1] }) =>
      atualizarTipoDocumento(id, payload),
    onSuccess: () => { toast.success("Tipo atualizado!"); resetForm(); invalidate(); },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "Erro ao atualizar"),
  });

  const removerMutation = useMutation({
    mutationFn: removerTipoDocumento,
    onSuccess: () => { toast.success("Tipo removido!"); setConfirmDelete(null); invalidate(); },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "Erro ao remover"),
  });

  function resetForm() {
    setNome(""); setDescricao(""); setErroNome(""); setEditingId(null);
  }

  function startEdit(tipo: TipoDocumento) {
    setNome(tipo.nome);
    setDescricao(tipo.descricao ?? "");
    setErroNome("");
    setEditingId(tipo.id_tipo_documento);
    setConfirmDelete(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) { setErroNome("Nome é obrigatório"); return; }
    if (nome.trim().length > 40) { setErroNome("Máximo 40 caracteres"); return; }
    setErroNome("");

    if (editingId) {
      atualizarMutation.mutate({
        id: editingId,
        payload: { nome: nome.trim(), descricao: descricao.trim() || undefined },
      });
    } else {
      criarMutation.mutate({ nome: nome.trim(), descricao: descricao.trim() || undefined });
    }
  }

  function handleToggleAtivo(tipo: TipoDocumento) {
    atualizarMutation.mutate({ id: tipo.id_tipo_documento, payload: { ativo: !tipo.ativo } });
  }

  const isPending = criarMutation.isPending || atualizarMutation.isPending;
  const isEditing = editingId !== null;

  function buildPageNumbers(): (number | "…")[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "…")[] = [1];
    if (safePage > 3) pages.push("…");
    for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) {
      pages.push(i);
    }
    if (safePage < totalPages - 2) pages.push("…");
    pages.push(totalPages);
    return pages;
  }

  return (
    <S.Page>
      <S.PageHeader>
        <S.HeaderLeft>
          <S.Title>Tipos de Documento</S.Title>
          <S.Subtitle>Tipos disponíveis para candidatos ao enviar documentos.</S.Subtitle>
        </S.HeaderLeft>
        <S.CountBadge>
          <FiFileText />
          {tipos.length} tipo{tipos.length !== 1 ? "s" : ""}
        </S.CountBadge>
      </S.PageHeader>

      <S.Body>
        {/* ── esquerda: formulário ── */}
        <S.Card>
          <S.CardHeader $editing={isEditing}>
            <S.CardTitle>
              {isEditing ? (
                <><FiEdit2 size={14} style={{ marginRight: 6 }} />Editando tipo</>
              ) : (
                "Novo tipo"
              )}
            </S.CardTitle>
            {isEditing && (
              <S.CancelEditBtn type="button" onClick={resetForm}>Cancelar</S.CancelEditBtn>
            )}
          </S.CardHeader>

          <S.CardBody>
            <S.Form onSubmit={handleSubmit}>
              <S.Field>
                <S.Label htmlFor="td-nome">Nome *</S.Label>
                <S.Input
                  id="td-nome"
                  $error={!!erroNome}
                  $editing={isEditing}
                  placeholder="Ex: RG, CPF, Diploma..."
                  value={nome}
                  onChange={(e) => { setNome(e.target.value); setErroNome(""); }}
                  maxLength={40}
                  autoComplete="off"
                />
                {erroNome && <S.ErrorText>{erroNome}</S.ErrorText>}
              </S.Field>

              <S.Field>
                <S.Label htmlFor="td-desc">Descrição (opcional)</S.Label>
                <S.Textarea
                  id="td-desc"
                  placeholder="Orientação sobre este documento para o candidato..."
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </S.Field>

              <S.PrimaryButton type="submit" disabled={isPending} $editing={isEditing}>
                {isPending ? "Salvando..." : isEditing ? "Salvar alterações" : "Adicionar tipo"}
              </S.PrimaryButton>
            </S.Form>
          </S.CardBody>
        </S.Card>

        {/* ── direita: lista ── */}
        <S.Card>
          <S.CardHeader>
            <S.CardTitle>Tipos cadastrados</S.CardTitle>
            <S.CountBadge>{filtered.length}{search || filter !== "todos" ? ` de ${tipos.length}` : ""}</S.CountBadge>
          </S.CardHeader>

          {/* busca */}
          <S.SearchRow>
            <S.SearchWrap>
              <FiSearch size={14} />
              <S.SearchInput
                type="text"
                placeholder="Buscar por nome ou descrição..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </S.SearchWrap>
            {search && (
              <S.ClearBtn type="button" onClick={() => setSearch("")} title="Limpar busca">
                <FiX size={14} />
              </S.ClearBtn>
            )}
          </S.SearchRow>

          {/* filtros por status */}
          <S.FilterRow>
            <S.FilterTab $active={filter === "todos"} onClick={() => setFilter("todos")}>
              Todos ({tipos.length})
            </S.FilterTab>
            <S.FilterTab $active={filter === "ativos"} onClick={() => setFilter("ativos")}>
              Ativos ({ativos})
            </S.FilterTab>
            <S.FilterTab $active={filter === "inativos"} onClick={() => setFilter("inativos")}>
              Inativos ({inativos})
            </S.FilterTab>
          </S.FilterRow>

          {/* lista */}
          {isLoading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <S.SkeletonRow key={i}>
                  <S.SkeletonLine $w="40%" />
                  <S.SkeletonLine $w="65%" />
                </S.SkeletonRow>
              ))}
            </>
          ) : paginated.length === 0 ? (
            <S.EmptyState>
              <FiFileText size={28} />
              <span>
                {tipos.length === 0
                  ? "Nenhum tipo cadastrado ainda."
                  : search
                  ? `Nenhum resultado para "${search}".`
                  : "Nenhum tipo neste filtro."}
              </span>
            </S.EmptyState>
          ) : (
            <>
              {paginated.map((tipo) => (
                <S.ListRow
                  key={tipo.id_tipo_documento}
                  $inactive={!tipo.ativo}
                  $selected={editingId === tipo.id_tipo_documento}
                >
                  <S.RowInfo>
                    <S.RowName $inactive={!tipo.ativo}>
                      <S.StatusDot $ativo={tipo.ativo} />
                      {tipo.nome}
                      <S.Badge $ativo={tipo.ativo}>{tipo.ativo ? "Ativo" : "Inativo"}</S.Badge>
                    </S.RowName>
                    {tipo.descricao && <S.RowDesc>{tipo.descricao}</S.RowDesc>}
                  </S.RowInfo>

                  <S.RowActions>
                    <S.GhostBtn
                      onClick={() => editingId === tipo.id_tipo_documento ? resetForm() : startEdit(tipo)}
                      $active={editingId === tipo.id_tipo_documento}
                    >
                      {editingId === tipo.id_tipo_documento ? "Cancelar" : "Editar"}
                    </S.GhostBtn>

                    <S.GhostBtn
                      onClick={() => handleToggleAtivo(tipo)}
                      disabled={atualizarMutation.isPending}
                    >
                      {tipo.ativo ? "Desativar" : "Ativar"}
                    </S.GhostBtn>

                    {confirmDelete === tipo.id_tipo_documento ? (
                      <>
                        <S.DangerBtn
                          onClick={() => removerMutation.mutate(tipo.id_tipo_documento)}
                          disabled={removerMutation.isPending}
                        >
                          Confirmar
                        </S.DangerBtn>
                        <S.GhostBtn onClick={() => setConfirmDelete(null)}>Não</S.GhostBtn>
                      </>
                    ) : (
                      <S.DangerBtn
                        onClick={() => {
                          if (editingId === tipo.id_tipo_documento) resetForm();
                          setConfirmDelete(tipo.id_tipo_documento);
                        }}
                      >
                        Remover
                      </S.DangerBtn>
                    )}
                  </S.RowActions>
                </S.ListRow>
              ))}

              {/* paginação */}
              {totalPages > 1 && (
                <S.PaginationRow>
                  <S.PageInfo>
                    {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} de {filtered.length} tipo{filtered.length !== 1 ? "s" : ""}
                  </S.PageInfo>

                  <S.PageButtons>
                    <S.PageBtn
                      type="button"
                      onClick={() => setPage((p) => p - 1)}
                      disabled={safePage === 1}
                      title="Página anterior"
                    >
                      <ChevronLeft size={14} />
                    </S.PageBtn>

                    {buildPageNumbers().map((p, i) =>
                      p === "…" ? (
                        <S.PageBtn key={`ellipsis-${i}`} disabled style={{ cursor: "default" }}>
                          …
                        </S.PageBtn>
                      ) : (
                        <S.PageBtn
                          key={p}
                          type="button"
                          $active={p === safePage}
                          onClick={() => setPage(p)}
                        >
                          {p}
                        </S.PageBtn>
                      )
                    )}

                    <S.PageBtn
                      type="button"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={safePage === totalPages}
                      title="Próxima página"
                    >
                      <ChevronRight size={14} />
                    </S.PageBtn>
                  </S.PageButtons>
                </S.PaginationRow>
              )}
            </>
          )}
        </S.Card>
      </S.Body>
    </S.Page>
  );
}
