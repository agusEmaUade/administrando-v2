// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home/home.js';
import Login from './pages/login';
import Registro from './pages/registro';
import RecuperarCuenta from './pages/recuperarCuenta';
import Dashboard from './pages/dashboard/dashboard.js';
import Layout from './components/layout';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/recuperar-cuenta" element={<RecuperarCuenta />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
