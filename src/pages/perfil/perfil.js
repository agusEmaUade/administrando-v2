import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Perfil() {
  // Estado para los datos del perfil
  const [profileData, setProfileData] = useState({
    email: "",
    password: "",
  });

  // Estados para controlar la habilitación del botón y las validaciones
  const [emailError, setEmailError] = useState(false);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  const navigate = useNavigate(); // Para redirigir con el botón "Volver"

  // Cargar la información del usuario desde localStorage al montar el componente
  useEffect(() => {
    const userLogin = JSON.parse(localStorage.getItem("userLogin"));
    if (userLogin) {
      setProfileData({
        email: userLogin.email,
        password: userLogin.password,
      });
    }
  }, []);

  // Función para manejar los cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));

    // Validar si el campo email tiene formato válido
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(!emailRegex.test(value));
    }

    // Habilitar el botón de guardar solo si hay un cambio y no hay errores
    const isComplete = profileData.email && profileData.password;
    setIsSaveDisabled(!(isComplete && !emailError));
  };

  // Función para manejar el evento de guardar
  const handleSave = () => {
    if (!isSaveDisabled) {
      // Guardar los datos actualizados en localStorage
      const updatedUser = {
        id: JSON.parse(localStorage.getItem("userLogin")).id,
        email: profileData.email,
        password: profileData.password,
      };

      localStorage.setItem("userLogin", JSON.stringify(updatedUser));

      const appData = JSON.parse(localStorage.getItem("appData"));
      if (appData) {
        const updatedUsers = appData.usuarios.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        );
        localStorage.setItem(
          "appData",
          JSON.stringify({ ...appData, usuarios: updatedUsers })
        );
      }

      alert("Perfil guardado con éxito");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h4">Gestionar Perfil</Typography>
      </Box>

      <TextField
        fullWidth
        margin="normal"
        label="Correo Electrónico"
        name="email"
        value={profileData.email}
        onChange={handleInputChange}
        error={emailError}
        helperText={emailError ? "Correo inválido" : ""}
      />

      <TextField
        fullWidth
        margin="normal"
        label="Contraseña"
        name="password"
        type="password"
        value={profileData.password}
        onChange={handleInputChange}
      />

      {/* Botones para guardar o volver */}
      <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={isSaveDisabled}
        >
          Guardar
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate("/dashboard")} // Navegar a la página anterior
        >
          Volver
        </Button>
      </Box>
    </Container>
  );
}

export default Perfil;
