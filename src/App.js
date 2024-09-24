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

function App() {
  const initAppData = {
    usuarios: [
      {
        id: 1,
        email: "juan.perez@example.com",
        password: "password123",
      },
      {
        id: 2,
        email: "ana.lopez@example.com",
        password: "password456",
      },
      // Agrega más usuarios según lo necesites
    ],
    proyectos: [
      {
        id: 1,
        titulo: "Proyecto 1",
        descripcion: "Descripción del proyecto 1",
        montoTotal: 1000,
        usuarios: [
          { id: 1, email: "juan.perez@example.com" },
          { id: 2, email: "ana.lopez@example.com" },
        ],
        tickets: [
          {
            id: 101,
            monto: 200,
            fecha: "2024-09-24",
            usuariosParticipantes: [{ id: 1, email: "juan.perez@example.com" }],
            archivo: {
              nombre: "ticket.jpg",
              data: "",
            },
          },
          {
            id: 102,
            monto: 300,
            fecha: "2024-09-23",
            usuariosParticipantes: [{ id: 2, email: "ana.lopez@example.com" }],
            archivo: {
              nombre: "ticket.jpg",
              data: "",
            },
          },
        ],
      },
      {
        id: 2,
        titulo: "Proyecto 2",
        descripcion: "Descripción del proyecto 2",
        montoTotal: 1500,
        usuarios: [{ id: 1, email: "juan.perez@example.com" }],
        tickets: [
          {
            id: 201,
            monto: 400,
            fecha: "2024-09-20",
            usuariosParticipantes: [{ id: 1, email: "juan.perez@example.com" }],
            archivo: {
              nombre: "ticket.jpg",
              data: "",
            },
          },
        ],
      },
    ],
    tickets: [
      {
        id: 101,
        monto: 200,
        fecha: "2024-09-24",
        usuariosParticipantes: [{ id: 1, email: "juan.perez@example.com" }],
        archivo: {
          nombre: "ticket.jpg",
          data: "",
        },
      },
      {
        id: 102,
        monto: 300,
        fecha: "2024-09-23",
        usuariosParticipantes: [{ id: 2, email: "ana.lopez@example.com" }],
        archivo: {
          nombre: "ticket.jpg",
          data: "",
        },
      },
      {
        id: 201,
        monto: 400,
        fecha: "2024-09-20",
        usuariosParticipantes: [{ id: 1, email: "juan.perez@example.com" }],
        archivo: {
          nombre: "ticket.jpg",
          data: "",
        },
      },
    ],
  };

  useEffect(() => {
    if (!localStorage.getItem("appData")) {
      localStorage.setItem("appData", JSON.stringify(initAppData));
      console.log("Datos iniciales cargados en localStorage.");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/recuperar-cuenta" element={<RecuperarCuenta />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mi-perfil" element={<Perfil />} />
          <Route path="/detalle-proyecto" element={<DetalleProyecto />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
