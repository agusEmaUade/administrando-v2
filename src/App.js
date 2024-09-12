// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home/home.js';
import Login from './pages/login';
import Registro from './pages/registro';
import RecuperarCuenta from './pages/recuperarCuenta';
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
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
