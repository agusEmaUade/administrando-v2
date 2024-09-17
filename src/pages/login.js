// pages/Login.js
import React from 'react';
import { Container, Typography, TextField, FormControlLabel, Checkbox, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom'; // Importa el Link de react-router-dom
import { blue } from '@mui/material/colors'; // Importa el color azul de MUI

function Login() {
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
          />
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Recordar credenciales"
            />
            <Link to="/recuperar-cuenta" style={{ textDecoration: 'none', color: 'primary' }}>
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
            Iniciar Sesion
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
