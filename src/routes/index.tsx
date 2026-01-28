import { BrowserRouter, Routes, Route } from "react-router";
import { Home } from "../pages/Home";
import { DefaultLayout } from "../_layout/defaultLayout";
import { Processo } from "../pages/Processo";
import { ProcessoSeletivosDetalhes } from "../pages/ProcessoDetalhes";
import { Login } from "../pages/Login";
import { Cadastro } from "../pages/Cadastro";
import { Perfil } from "../pages/Perfil";
import { InscricaoPage } from "../pages/Inscricao";
import { MinhasInscricoes } from "../pages/MinhasInscricoes";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route element={<DefaultLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/processos" element={<Processo />} />
          <Route
            path="/processos_detalhes/:id"
            element={<ProcessoSeletivosDetalhes />}
          />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/processos/:id/inscricao/:id_inscricao" element={<InscricaoPage />} />
          <Route path="/minhas-inscricoes" element={<MinhasInscricoes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
