// App.js
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/home.js";
import Login from "./pages/login";
import Registro from "./pages/registro";
import RecuperarCuenta from "./pages/recuperarCuenta";
import Dashboard from "./pages/dashboard/dashboard.js";
import Perfil from "./pages/perfil/perfil.js";
import DetalleProyecto from "./pages/detalleProyecto/detalleProyecto.js";
import Layout from "./components/layout";
import PrivateRoute from "./components/privateRoute.js";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/recuperar-cuenta" element={<RecuperarCuenta />} />
          rutas protegidas
          <Route path="/dashboard" element={ <PrivateRoute> <Dashboard /></PrivateRoute>} />
          <Route path="/mi-perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
          <Route path="/detalle-proyecto/:id" element={<PrivateRoute><DetalleProyecto /></PrivateRoute>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
