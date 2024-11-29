import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getUserIdFromJWT } from "../../../utils/jswDecode";

function Perfil() {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [emailError, setEmailError] = useState(false);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const navigate = useNavigate();

  // Obtener datos del usuario desde el servidor
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const userID = JSON.parse(localStorage.getItem("userLogin"))?.id;

    if (!token || !userID) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(`${process.env.API_URL}/user/${userID}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const data = await response.json();
          setProfileData({
            name: data.name,
            email: data.mail,
            password: "", // No mostramos la contraseña
          });
        } else {
          alert("Error al obtener los datos del usuario.");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
        alert("Error al conectar con el servidor.");
      }
    };

    fetchUserData();
  }, [navigate]);

  // Validar y manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(!emailRegex.test(value));
    }

    const isComplete = profileData.name && profileData.email && profileData.password;
    setIsSaveDisabled(!(isComplete && !emailError));
  };

  // Guardar datos
  const handleSave = async () => {
    const token = localStorage.getItem("userToken");
    const userID = getUserIdFromJWT();

    if (!token || !userID) {
      alert("No se encontró el token o ID del usuario.");
      return;
    }

    try {
      const response = await fetch(`${process.env.API_URL}/user/${userID}/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profileData.name,
          mail: profileData.email,
          password: profileData.password,
        }),
      });

      if (response.status === 200) {
        alert("Perfil actualizado con éxito");
        navigate("/dashboard");
      } else {
        alert("Error al actualizar el perfil.");
      }
    } catch (error) {
      console.error("Error al guardar el perfil:", error);
      alert("Error al conectar con el servidor.");
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
          onClick={() => navigate("/dashboard")}
        >
          Volver
        </Button>
      </Box>
    </Container>
  );
}

export default Perfil;
