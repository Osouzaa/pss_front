import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";

import { getMe } from "../../api/get-me";
import { ModalPrimeiroAcesso } from "./components/ModalPrimeiroAcesso";

export function Home() {
  const navigate = useNavigate();

  const { data: result, isLoading } = useQuery({
    queryKey: ["get-me"],
    queryFn: getMe,
  });

  const [openFirstAccess, setOpenFirstAccess] = useState(false);

  useEffect(() => {
    if (!result) return;

    // ✅ regra clara: primeiro acesso → abre modal
    if (result.fl_primeiro_acesso === true) {
      setOpenFirstAccess(true);
    }
  }, [result]);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <ModalPrimeiroAcesso
        open={openFirstAccess}
        onOpenChange={setOpenFirstAccess}
        lockClose={true}
        onGoProfile={() => navigate("/perfil")}
      />

      <div>
        <h1>{result?.email}</h1>
        <h1>{result?.data_atualizacao}</h1>
        <h1>{String(result?.fl_primeiro_acesso)}</h1>
      </div>
    </>
  );
}
