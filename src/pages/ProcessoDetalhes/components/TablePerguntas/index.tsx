import { Pencil, Trash2 } from "lucide-react";
import * as S from "./styles";
import { useMutation } from "@tanstack/react-query";
import { type IGetAllAnswers } from "../../../../api/buscar-perguntas-processos";
import { formatDate } from "../../../../utils/fomartDate.utils";
import { queryClient } from "../../../../lib/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { ModalConfirmDelete } from "../../../../components/ModalConfirmDelete";
import { ModalOpcoes } from "../ModalOpcoes";
import { deletarPergunta } from "../../../../api/deletar-pergunta";

interface ITablePerguntasProps {
  perguntas: IGetAllAnswers[] | undefined;
  processo_seletivo_id: string;
  isAdmin: boolean;
  isLoadingPerguntas: boolean;

  setPerguntaToEdit: React.Dispatch<React.SetStateAction<any>>;
  setOpenModalNovaPergunta: React.Dispatch<React.SetStateAction<boolean>>;
}

export function TablePerguntas({
  perguntas,
  processo_seletivo_id,
  isAdmin,
  isLoadingPerguntas,
  setPerguntaToEdit,
  setOpenModalNovaPergunta,
}: ITablePerguntasProps) {
  const [openModalOpcoes, setOpenModalOpcoes] = useState(false);
  const [perguntaSelecionada, setPerguntaSelecionada] = useState<{
    id_pergunta: string;
  } | null>(null);

  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [perguntaToDelete, setPerguntaToDelete] = useState<any>(null);

  function onEditarPergunta(pergunta: any) {
    if (!isAdmin) {
      toast.error("Apenas administradores podem editar perguntas.");
      return;
    }
    setPerguntaToEdit(pergunta);
    setOpenModalNovaPergunta(true);
  }

  function onAbrirOpcoes(pergunta: { id_pergunta: string }) {
    if (!isAdmin) {
      toast.error("Apenas administradores podem gerenciar opções.");
      return;
    }
    setPerguntaSelecionada(pergunta);
    setOpenModalOpcoes(true);
  }

  const deletePerguntaMut = useMutation({
    mutationFn: deletarPergunta,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["perguntas-processos", processo_seletivo_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["processo-id", processo_seletivo_id],
      });
    },
  });

  function onExcluirPergunta(pergunta: any) {
    if (!isAdmin) {
      toast.error("Apenas administradores podem excluir perguntas.");
      return;
    }
    setPerguntaToDelete(pergunta);
    setOpenModalDelete(true);
  }

  return (
    <S.Section>
      <S.SectionHeader>
        <S.SectionTitle>Perguntas do Processo</S.SectionTitle>
        <S.SectionHint>
          Gerencie as perguntas utilizadas neste processo seletivo.
        </S.SectionHint>
      </S.SectionHeader>

      {isLoadingPerguntas ? (
        <S.EmptyState>
          <S.EmptyTitle>Carregando perguntas...</S.EmptyTitle>
          <S.EmptyText>Aguarde um momento.</S.EmptyText>
        </S.EmptyState>
      ) : !perguntas || perguntas.length === 0 ? (
        <S.EmptyState>
          <S.EmptyTitle>Nenhuma pergunta cadastrada</S.EmptyTitle>
          <S.EmptyText>
            {isAdmin
              ? 'Cadastre perguntas para este processo seletivo clicando no botão "Cadastrar perguntas" acima.'
              : "Nenhuma pergunta cadastrada para este processo seletivo."}
          </S.EmptyText>
        </S.EmptyState>
      ) : (
        <S.PerguntasTableWrap>
          <S.PerguntasTable>
            <thead>
              <tr>
                <S.Th style={{ width: 70 }}>Ordem</S.Th>
                <S.Th>Pergunta</S.Th>
                <S.Th style={{ width: 140 }}>Tipo</S.Th>
                <S.Th style={{ width: 140 }}>Obrigatória</S.Th>
                <S.Th style={{ width: 120 }}>Ativa</S.Th>
                <S.Th style={{ width: 120 }}>Opções</S.Th>
                <S.Th style={{ width: 160 }}>Criada</S.Th>
                <S.Th style={{ width: 260, textAlign: "right" }}>Ações</S.Th>
              </tr>
            </thead>

            <tbody>
              {perguntas
                .slice()
                .sort((a, b) => a.orderm - b.orderm)
                .map((pergunta, index) => {
                  const hasOpcoes =
                    Array.isArray(pergunta.opcoes) &&
                    pergunta.opcoes.length > 0;

                  const podeGerenciarOpcoes =
                    pergunta.tipo === "SELECT" ||
                    pergunta.tipo === "MULTISELECT";

                  return (
                    <S.Tr key={pergunta.id_pergunta}>
                      <S.Td>
                        <S.PerguntaOrderPill title="Ordem">
                          #{index + 1}
                        </S.PerguntaOrderPill>
                      </S.Td>

                      <S.Td>
                        <S.PerguntaTitleCell title={pergunta.titulo}>
                          {pergunta.titulo}
                        </S.PerguntaTitleCell>

                        {pergunta.descrição && (
                          <S.PerguntaDescCell title={pergunta.descrição}>
                            {pergunta.descrição}
                          </S.PerguntaDescCell>
                        )}
                      </S.Td>

                      <S.Td>
                        <S.PerguntaTipoPill $tipo={String(pergunta.tipo)} />
                      </S.Td>

                      <S.Td>
                        {pergunta.obrigatoria ? (
                          <S.YesPill>Sim</S.YesPill>
                        ) : (
                          <S.NoPill>Não</S.NoPill>
                        )}
                      </S.Td>

                      <S.Td>
                        {pergunta.ativa ? (
                          <S.YesPill>Sim</S.YesPill>
                        ) : (
                          <S.NoPill>Não</S.NoPill>
                        )}
                      </S.Td>

                      <S.Td>
                        {podeGerenciarOpcoes ? (
                          <S.OpcoesCountPill data-has={hasOpcoes}>
                            {pergunta.opcoes?.length ?? 0}
                          </S.OpcoesCountPill>
                        ) : (
                          <S.Muted>—</S.Muted>
                        )}
                      </S.Td>

                      <S.Td>
                        <S.Muted>{formatDate(pergunta.data_criacao)}</S.Muted>
                      </S.Td>

                      <S.Td style={{ textAlign: "right" }}>
                        <S.RowActions>
                          {isAdmin ? (
                            <>
                              <S.IconButton
                                type="button"
                                title="Editar"
                                onClick={() => onEditarPergunta(pergunta)}
                              >
                                <Pencil size={16} />
                              </S.IconButton>

                              {podeGerenciarOpcoes && (
                                <S.SecondaryButton
                                  type="button"
                                  onClick={() => onAbrirOpcoes(pergunta)}
                                >
                                  Opções
                                </S.SecondaryButton>
                              )}

                              <S.IconButton
                                type="button"
                                title="Excluir"
                                className="danger"
                                onClick={() => onExcluirPergunta(pergunta)}
                                disabled={deletePerguntaMut.isPending}
                              >
                                <Trash2 size={16} />
                              </S.IconButton>
                            </>
                          ) : (
                            <S.Muted>—</S.Muted>
                          )}
                        </S.RowActions>
                      </S.Td>
                    </S.Tr>
                  );
                })}
            </tbody>
          </S.PerguntasTable>
        </S.PerguntasTableWrap>
      )}

      <ModalOpcoes
        open={openModalOpcoes}
        onOpenChange={(v) => {
          setOpenModalOpcoes(v);
          if (!v) setPerguntaSelecionada(null);
        }}
        id_pergunta={perguntaSelecionada?.id_pergunta ?? ""}
        id_processo_seletivo={processo_seletivo_id}
      />

      <ModalConfirmDelete
        open={openModalDelete}
        onOpenChange={(v) => {
          setOpenModalDelete(v);
          if (!v) setPerguntaToDelete(null);
        }}
        itemName={perguntaToDelete?.titulo ?? "Pergunta"}
        invalidateQueryKeys={[
          ["perguntas-processos", processo_seletivo_id],
          ["processo-id", processo_seletivo_id],
        ]}
        onConfirm={async () => {
          if (!perguntaToDelete?.id_pergunta) return;

          try {
            await deletePerguntaMut.mutateAsync(perguntaToDelete.id_pergunta);
            toast.success("Pergunta excluída com sucesso!");
          } catch (err: any) {
            const status = err?.response?.status;
            const msg =
              err?.response?.data?.message ||
              err?.response?.data?.error ||
              "Não foi possível excluir a pergunta.";

            if (status === 409) {
              toast.warning(
                "Não é possível excluir esta pergunta porque existem respostas vinculadas a essa pergunta.",
                { duration: 4000 },
              );
              return;
            }

            toast.error(msg);
          }
        }}
      />
    </S.Section>
  );
}
