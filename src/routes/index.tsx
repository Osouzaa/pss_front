// src/routes/index.tsx
import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import { AnimatePresence } from "framer-motion";

import { DefaultLayout } from "../_layout/defaultLayout";
import { Home } from "../pages/Home";
import { Processo } from "../pages/Processo";
import { ProcessoSeletivosDetalhes } from "../pages/ProcessoDetalhes";
import { Login } from "../pages/Login";
import { Cadastro } from "../pages/Cadastro";
import { Perfil } from "../pages/Perfil";
import { InscricaoPage } from "../pages/Inscricao";
import { MinhasInscricoes } from "../pages/MinhasInscricoes";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      {/* ✅ Routes é quem recebe location + key */}
      <Routes location={location} key={location.pathname}>
        {/* Rotas SEM layout (login/cadastro) */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Rotas COM layout */}
        <Route element={<DefaultLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/processos" element={<Processo />} />
          <Route
            path="/processos_detalhes/:id"
            element={<ProcessoSeletivosDetalhes />}
          />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/processos/:id/inscricao" element={<InscricaoPage />} />
          <Route
            path="/processos/:id/inscricao/:id_inscricao"
            element={<InscricaoPage />}
          />
          <Route path="/minhas-inscricoes" element={<MinhasInscricoes />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

const Router = () => {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
};

export default Router;
