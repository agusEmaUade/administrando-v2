// pages/Login.js
import React, { useState } from 'react';
import { Container, Typography, TextField, FormControlLabel, Checkbox, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom'; // Importa el Link de react-router-dom
import { blue } from '@mui/material/colors'; // Importa el color azul de MUI

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const navigate = useNavigate(); // Inicializa useNavigate para redireccionar

  const handleSubmit = (e) => {
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

     // Si los campos están llenos y las credenciales son correctas
     if (valid && email === 'test' && password === '1234') {
      navigate('/dash');
    } else if (valid) {
      alert('Usuario o contraseña incorrecta');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 8,
        }}
      >
        <Typography variant="h5">Iniciar Sesión</Typography>
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
