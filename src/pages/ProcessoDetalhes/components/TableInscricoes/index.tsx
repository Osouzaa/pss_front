import { Eye } from "lucide-react";
import * as S from "./styles";
import type { GetAllInscricoesByProcessoIdResponse } from "../../../../api/get-all-inscricoes-by-processoId";
import { Pagination } from "../../../../components/Pagination"; // ajuste o path
import { formatDate } from "../../../../utils/fomartDate.utils";
import { formatPhoneBR } from "../../../../utils/formatPhoneBR";

interface ITableInscricoesProps {
  resultAllInscricoes: GetAllInscricoesByProcessoIdResponse | undefined;
  isLoadingInscricoes: boolean;

  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function TableInscricoes({
  resultAllInscricoes,
  isLoadingInscricoes,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: ITableInscricoesProps) {
  const rows = resultAllInscricoes?.data ?? [];
  const total = resultAllInscricoes?.total ?? 0;

  return (
    <S.Section>
      <S.SectionHeader>
        <S.SectionTitle>Inscrições</S.SectionTitle>
        <S.SectionHint>
          Veja todas as inscrições feitas neste processo seletivo.
        </S.SectionHint>
      </S.SectionHeader>

      {isLoadingInscricoes ? (
        <S.EmptyState>
          <S.EmptyTitle>Carregando inscrições...</S.EmptyTitle>
          <S.EmptyText>Aguarde um momento.</S.EmptyText>
        </S.EmptyState>
      ) : total === 0 ? (
        <S.EmptyState>
          <S.EmptyTitle>Nenhuma inscrição encontrada</S.EmptyTitle>
          <S.EmptyText>Quando alguém se inscrever, aparecerá aqui.</S.EmptyText>
        </S.EmptyState>
      ) : (
        <>
          <S.InscricoesTableWrap>
            <S.InscricoesTable>
              <thead>
                <tr>
                  <S.Th style={{ width: 170 }}>Data</S.Th>
                  <S.Th style={{ width: 260 }}>Nome</S.Th>
                  <S.Th style={{ width: 180 }}>Telefone</S.Th>
                  <S.Th style={{ width: 220 }}>Vaga</S.Th>
                  <S.Th>Endereço</S.Th>
                  <S.Th style={{ width: 160, textAlign: "right" }}>Ações</S.Th>
                </tr>
              </thead>

              <tbody>
                {rows.map((i) => (
                  <S.Tr key={i.id_inscricao}>
                    <S.Td>
                      <S.Muted>{formatDate(i.data_criacao)}</S.Muted>
                    </S.Td>

                    <S.Td>
                      <S.CellStrong
                        title={i.usuario.candidato?.nome_completo ?? ""}
                      >
                        {i.usuario.candidato?.nome_completo ?? "—"}
                      </S.CellStrong>
                      <S.CellSub title={i.usuario?.email ?? ""}>
                        {i.usuario?.email ?? "—"}
                      </S.CellSub>
                    </S.Td>

                    <S.Td>
                      <S.CellMono title={i.usuario.candidato?.telefone ?? ""}>
                        {formatPhoneBR(i.usuario.candidato?.telefone) ?? "—"}
                      </S.CellMono>
                    </S.Td>

                    <S.Td>
                      <S.CellMono title={i.vaga.nome}>{i.vaga.nome}</S.CellMono>
                    </S.Td>

                    <S.Td>
                      <S.CellClamp2
                        title={i.usuario.candidato?.logradouro ?? ""}
                      >
                        {i.usuario.candidato?.logradouro ?? "—"}
                      </S.CellClamp2>
                    </S.Td>

                    <S.Td style={{ textAlign: "right" }}>
                      <S.RowActions>
                        <S.SecondaryButton type="button" title="Ver detalhes">
                          <S.BtnInline>
                            <Eye size={16} />
                            Ver mais
                          </S.BtnInline>
                        </S.SecondaryButton>
                      </S.RowActions>
                    </S.Td>
                  </S.Tr>
                ))}
              </tbody>
            </S.InscricoesTable>
          </S.InscricoesTableWrap>

          <Pagination
            page={page}
            total={total}
            pageSize={pageSize}
            onPageChange={onPageChange}
            showPageSize
            onPageSizeChange={onPageSizeChange}
            pageSizeOptions={[10, 20, 50, 100]}
            loading={isLoadingInscricoes}
          />
        </>
      )}
    </S.Section>
  );
}
