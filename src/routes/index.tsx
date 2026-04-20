import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router";
import { AnimatePresence } from "framer-motion";

import { DefaultLayout } from "../_layout/defaultLayout";
import { Processo } from "../pages/Processo";
import { ProcessoSeletivosDetalhes } from "../pages/ProcessoDetalhes";
import { Login } from "../pages/Login";
import { Cadastro } from "../pages/Cadastro";
import { Perfil } from "../pages/Perfil";
import { InscricaoPage } from "../pages/Inscricao";
import { MinhasInscricoes } from "../pages/MinhasInscricoes";
import { AuthenticacaoEmail } from "../pages/AuthenticacaoEmail";
import { RequireAuth } from "./RequireAuth";
import { ForgotPassword } from "../pages/ForgotPassword";
import { ResetPassword } from "../pages/ResetPassword";
import InscricaoDetalhePage from "../pages/InscricaoDetalhePage";
import { RequireRole } from "./RequireRole";
import { InscricoesAdmin } from "../pages/InscricoesAdmin";
import { CriarAdmin } from "../pages/CriarAdmin";
import { TiposDocumento } from "../pages/TiposDocumento";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/confirmar-email" element={<AuthenticacaoEmail />} />
        <Route path="/esqueci_senha" element={<ForgotPassword />} />
        <Route path="/redefinir-senha" element={<ResetPassword />} />

        {/* privadas */}
        <Route element={<RequireAuth />}>
          <Route element={<DefaultLayout />}>
            <Route path="/processos" element={<Processo />} />
            <Route
              path="/processos_detalhes/:id"
              element={<ProcessoSeletivosDetalhes />}
            />
            <Route path="/perfil" element={<Perfil />} />
            <Route
              path="/processos/:id/inscricao"
              element={<InscricaoPage />}
            />
            <Route
              path="/processos/:id/inscricao/:id_inscricao"
              element={<InscricaoPage />}
            />
            <Route path="/minhas-inscricoes" element={<MinhasInscricoes />} />
            <Route element={<RequireRole allowedRoles={["ADMIN"]} />}>
              <Route
                path="/processos/:id/inscricoes/:id_inscricao/detalhe"
                element={<InscricaoDetalhePage />}
              />
              <Route
                path="/all-inscricoes/:id_processo_seletivo"
                element={<InscricoesAdmin />}
              />
              <Route
                path="/admin/usuarios"
                element={<CriarAdmin />}
              />
              <Route
                path="/admin/tipos-documento"
                element={<TiposDocumento />}
              />
            </Route>
          </Route>
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

const Router = () => (
  <BrowserRouter>
    <AnimatedRoutes />
  </BrowserRouter>
);

export default Router;
