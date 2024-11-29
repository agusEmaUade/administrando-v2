import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Alert, Link, Snackbar } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

function EmailValidation() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState({ email: false, emailFormat: false });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({ email: false, emailFormat: false });
    setServerError('');
    setOpenSnackbar(false);

    if (!email) {
      setError((prev) => ({ ...prev, email: true }));
      return;
    }

    if (!validateEmail(email)) {
      setError((prev) => ({ ...prev, emailFormat: true }));
      return;
    }

    try {
      const response = await fetch('/user/password-mail', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mail: email }),
      });

      if (response.ok) {
        setOpenSnackbar(true);
        setTimeout(() => navigate('/cambiar-password'), 2000);
      } else {
        const errorData = await response.json();
        setServerError(errorData.message || 'Error al enviar el correo.');
      }
    } catch (err) {
      setServerError('Error de red. Intenta nuevamente.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
        <Typography variant="h5">Recuperar Cuenta</Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
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

          {serverError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {serverError}
            </Alert>
          )}

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

          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2, mb: 2 }}>
            Enviar Instrucciones
          </Button>
        </Box>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={4000}
          message={`Se ha enviado un mail a ${email} con las instrucciones`}
        />
      </Box>
    </Container>
  );
}

export default EmailValidation;
