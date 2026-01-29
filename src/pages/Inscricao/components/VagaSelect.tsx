import React from "react";
import { SelectBase } from "../../../components/SelectBase";
import type { VagaProcessoSeletivoResponse } from "../../../api/get-processo-id";

export function VagaSelect(props: {
  vagas: VagaProcessoSeletivoResponse[];
  value: string;
  onChange: (next: string) => void;
  disabled?: boolean;
}) {
  const { vagas, value, onChange, disabled } = props;

  return (
    <SelectBase
      label="Vaga do processo"
      id="id_vaga"
      value={value}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
        onChange(e.target.value)
      }
      disabled={disabled}
    >
      <option value="" disabled>
        Selecione uma vaga
      </option>

      {vagas.map((v) => (
        <option key={v.id_vaga} value={v.id_vaga}>
          {v.nome} ({v.nivel}) • {v.quantidade_de_vagas} vaga(s)
        </option>
      ))}
    </SelectBase>
  );
}
