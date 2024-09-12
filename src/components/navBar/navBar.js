import React from 'react';
import { AppBar, Toolbar, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import './navBar.css'; // Archivo de estilos personalizados

function NavBar() {
  return (
    <AppBar position="static" className="navbar">
      <Toolbar className="navbar-toolbar">
        <Button
          className="navbar-link"
          color="inherit"
          component={Link}
          to="/"
        >
          Home
        </Button>
        <Button
          className="navbar-link"
          color="inherit"
          component={Link}
          to="/login"
        >
          Login
        </Button>
        <Button
          className="navbar-link"
          color="inherit"
          component={Link}
          to="/registro"
        >
          Registro
        </Button>
        <Button
          className="navbar-link"
          color="inherit"
          component={Link}
          to="/recuperar-cuenta"
        >
          Recuperar Cuenta
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
