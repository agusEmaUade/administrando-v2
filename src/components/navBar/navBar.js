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
          to="/dashboard"
        >
          Dashboard
        </Button>
        <Button
          className="navbar-link"
          color="inherit"
          component={Link}
          to="/perfil"
        >
          MI Perfil
        </Button>
        <Button
          className="navbar-link"
          color="inherit"
          component={Link}
          to="/"
        >
          Cerrar sesion
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
