import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import "./navBar.css"; // Archivo de estilos personalizados

function NavBar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Manejo del click en el ícono de usuario
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    localStorage.removeItem("token");
  };

    const handleMiPerfilClose = () => {
      setAnchorEl(null);
    };

  return (
    <AppBar position="static" className="navbar">
      <Toolbar className="navbar-toolbar">
        {/* Dashboard alineado a la izquierda */}
        <Box sx={{ flexGrow: 1 }}>
          <Button
            className="navbar-link"
            color="inherit"
            component={Link}
            to="/dashboard"
          >
            Dashboard
          </Button>
        </Box>

        {/* Ícono de usuario alineado a la derecha */}
        <IconButton edge="end" color="inherit" onClick={handleMenuClick}>
          <Avatar></Avatar> {/* Inicial del usuario, puedes personalizarla */}
        </IconButton>

        {/* Menú desplegable */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMiPerfilClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={handleMiPerfilClose} component={Link} to="/mi-perfil">
            Mi Perfil
          </MenuItem>
          <MenuItem onClick={handleClose} component={Link} to="/">
            Cerrar sesión
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
