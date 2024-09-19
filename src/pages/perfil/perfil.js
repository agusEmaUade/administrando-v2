import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Perfil() {
  // Estado para los datos del perfil
  const [profileData, setProfileData] = useState({
    name: "José",
    email: "jose@example.com",
    password: "1234",
  });

  // Estados para controlar la habilitación del botón y las validaciones
  const [isEdited, setIsEdited] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  const navigate = useNavigate(); // Para redirigir con el botón "Volver"

  // Función para manejar los cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
    setIsEdited(true); // Marcar como editado

    // Validar si el campo email tiene formato válido
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(!emailRegex.test(value));
    }
  };

  // Efecto para habilitar el botón de guardar solo si los campos están completos y editados
  useEffect(() => {
    const isComplete =
      profileData.name && profileData.email && profileData.password;
    setIsSaveDisabled(!(isComplete && isEdited && !emailError));
  }, [profileData, isEdited, emailError]);

  // Función para manejar el evento de guardar
  const handleSave = () => {
    if (!isSaveDisabled) {
      // Aquí iría la lógica para guardar los datos actualizados
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
        label="Nombre"
        name="name"
        value={profileData.name}
        onChange={handleInputChange}
      />

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
