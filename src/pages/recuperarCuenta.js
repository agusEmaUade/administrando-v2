// pages/RecuperarCuenta.js
import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Alert, Link, Snackbar } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function RecuperarCuenta() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState({ email: false, emailFormat: false });
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const validateEmail = (email) => {
    // Expresión regular para validar formato de email
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Reiniciar errores
    setError({ email: false, emailFormat: false });

    // Validar si el campo está vacío
    if (!email) {
      setError((prev) => ({ ...prev, email: true }));
      return;
    }

    // Validar formato del email
    if (!validateEmail(email)) {
      setError((prev) => ({ ...prev, emailFormat: true }));
      return;
    }

    // Si las validaciones son correctas, mostrar el snackbar (pop-up)
    setOpenSnackbar(true);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
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
        <Typography variant="h5">Recuperar Cuenta</Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error.email || error.emailFormat}
            helperText={
              error.email
                ? 'El email es requerido'
                : error.emailFormat
                ? 'El formato del email no es válido'
                : ''
            }
          />

          <Alert
            severity="info"
            sx={{ width: '100%', mt: 2, mb: 2 }}
            action={
              <Link to="/login" component={RouterLink} color="inherit">
                Regresar al inicio de sesión
              </Link>
            }
          >
            ¿No recuerdas tu contraseña? Ingresa tu email para recibir instrucciones.
          </Alert>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2, mb: 2 }}
          >
            Enviar Instrucciones
          </Button>
        </Box>

        {/* Snackbar para mostrar el mensaje de confirmación */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          message={`Se ha enviado un mail a ${email} con las instrucciones`}
        />
      </Box>
    </Container>
  );
}

export default RecuperarCuenta;
