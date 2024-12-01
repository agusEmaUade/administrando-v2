import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function Perfil() {
  const [profileData, setProfileData] = useState({
    email: "",
    password: "",
  });
  const [emailError, setEmailError] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [showPasswordInputs, setShowPasswordInputs] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState("");
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        console.error("No se encontró el token en localStorage.");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:8080/api/validate-token",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al validar el token.");
        }

        const validateTokenData = await response.json();
        const userId = validateTokenData.user.id;
        setUserId(userId);

        const userResponse = await fetch(
          `http://localhost:8080/api/user/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!userResponse.ok) {
          throw new Error("Error al obtener los datos del usuario.");
        }

        const userData = await userResponse.json();

        setProfileData({ email: userData.email });
        setEmail(userData.email);
      } catch (error) {
        console.error("Error al validar el token:", error.message);
      }
    };

    validateToken();
  }, []);


  const handleSaveEmail = async () => {
    if (!token || !userId) {
      console.error("Token o UserId no disponibles.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8080/api/user/${userId}/email`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: email }),
      });
  
      if (!response.ok) {
        throw new Error("Error al actualizar el correo electrónico.");
      }
  
      const data = await response.json();
      console.log("Correo actualizado:", data);
  
      alert("Correo electrónico actualizado con éxito.");
      setShowEmailInput(false); // Cierra el input después de guardar
    } catch (error) {
      console.error("Error al actualizar el correo electrónico:", error.message);
      alert("Hubo un problema al actualizar el correo electrónico.");
    }
  };
  

  const handleCancelEmail = () => {
    setShowEmailInput(false);
  };


  const handleSavePassword = async () => {
    if (!token || !userId) {
      console.error("Token o UserId no disponibles.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8080/api/user/${userId}/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: oldPassword,
          newPassword: newPassword,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Error al actualizar la contraseña.");
      }
  
      const data = await response.json();
      console.log("Contraseña actualizada:", data);
  
      alert("Contraseña actualizada con éxito.");
      setShowPasswordInputs(false); // Cierra los inputs después de guardar
    } catch (error) {
      console.error("Error al actualizar la contraseña:", error.message);
      alert("Hubo un problema al actualizar la contraseña.");
    }
  };
  

  const handleCancelPassword = () => {
    setShowPasswordInputs(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Gestionar Perfil
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Actualiza tus datos personales de forma segura.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Sección de correo */}
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            {!showEmailInput ? (
              <>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setShowEmailInput(true)}
                  sx={{ mt: 2 }}
                >
                  Cambiar Correo
                </Button>
              </>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                <TextField
                  fullWidth
                  label="Nuevo Correo Electrónico"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={emailError}
                  helperText={emailError ? "Correo inválido" : ""}
                  variant="outlined"
                />
                <Box sx={{ mt: 2, display: "flex", justifyContent: "center", width: "100%" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveEmail}
                    disabled={emailError}
                    sx={{ mr: 2 }}
                  >
                    Guardar Correo
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleCancelEmail}
                  >
                    Cancelar
                  </Button>
                </Box>
              </Box>
            )}
          </Grid>

          {/* Sección de contraseña */}
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            {!showPasswordInputs ? (
              <>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setShowPasswordInputs(true)}
                  sx={{ mt: 2 }}
                >
                  Cambiar Contraseña
                </Button>
              </>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                <TextField
                  fullWidth
                  label="Contraseña Actual"
                  name="oldPassword"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Nueva Contraseña"
                  name="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  error={passwordError}
                  helperText={passwordError ? "Debe tener al menos 6 caracteres" : ""}
                  variant="outlined"
                  sx={{ mt: 2 }}
                />
                <Box sx={{ mt: 2, display: "flex", justifyContent: "center", width: "100%" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSavePassword}
                    disabled={passwordError}
                    sx={{ mr: 2 }}
                  >
                    Guardar Contraseña
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleCancelPassword}
                  >
                    Cancelar
                  </Button>
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/dashboard")}
          >
            Volver
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Perfil;
