import React, { useState } from 'react';
import { Container, Typography, TextField, FormControlLabel, Checkbox, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { blue } from '@mui/material/colors';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock'; 

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene la recarga de la página

    // Validaciones de campos obligatorios
    let valid = true;

    if (email.trim() === '') {
      setErrorEmail(true);
      valid = false;
    } else {
      setErrorEmail(false);
    }

    if (password.trim() === '') {
      setErrorPassword(true);
      valid = false;
    } else {
      setErrorPassword(false);
    }

    if (valid) {
      try {
        const response = await fetch("http://localhost:8080/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } else {
      const errorData = await response.json();
      alert(errorData.message || "Usuario o contraseña incorrectos");
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    alert("Hubo un problema al conectarse al servidor.");
  }
}
};

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh', // Hace que ocupe toda la altura de la ventana
        backgroundColor: '#f4f6f8', // Fondo suave para el resto de la página
      }}
    >
      <Container component="main" maxWidth="xs" sx={{ backgroundColor: '#e0e0e0', borderRadius: 2, boxShadow: 3, padding: 4 }}>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: blue[600] }}>Iniciar Sesión</Typography>
          <Box
            component="form"
            noValidate
            sx={{
              mt: 3,
              width: '100%',
            }}
            onSubmit={handleSubmit} // Manejador del submit del formulario
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(e) => setEmail(e.target.value)} // Actualiza el estado del email
              error={errorEmail}
              helperText={errorEmail ? 'El campo Email es obligatorio' : ''}
              InputProps={{
                startAdornment: <EmailIcon sx={{ color: blue[500], mr: 1 }} />, // Icono al inicio del campo
              }}
              sx={{
                borderRadius: 1,
                '& .MuiInputBase-root': { paddingLeft: 2 },
              }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)} // Actualiza el estado del password
              error={errorPassword}
              helperText={errorPassword ? 'El campo Contraseña es obligatorio' : ''}
              InputProps={{
                startAdornment: <LockIcon sx={{ color: blue[500], mr: 1 }} />, // Icono al inicio del campo
              }}
              sx={{
                borderRadius: 1,
                '& .MuiInputBase-root': { paddingLeft: 2 },
              }}
            />
            
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Recordar credenciales"
              />
              <Link to="/recuperar-cuenta" style={{ textDecoration: 'none', color: blue[500] }}>
                ¿Olvidaste tu contraseña?
              </Link>
            </Box>
            
            <div className="alert alert-primary" role="alert" style={{ marginTop: 10 }}>
  Aun no tenes cuenta? <Link to="/registro" style={{ textDecoration: 'none', color: blue[500] }}>Selecciona acá</Link> para crear una cuenta.
</div>

            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2, borderRadius: 20, textTransform: 'none', boxShadow: 2 }}
            >
              Iniciar Sesión
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Login;
