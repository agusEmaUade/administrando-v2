import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Alert, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function ChangePassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState({ password: false, confirmPassword: false });
  const [serverError, setServerError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({ password: false, confirmPassword: false });
    setServerError('');
    setOpenSnackbar(false);

    if (!password) {
      setError((prev) => ({ ...prev, password: true }));
      return;
    }

    if (password !== confirmPassword) {
      setError((prev) => ({ ...prev, confirmPassword: true }));
      return;
    }

    try {
      const response = await fetch('/user/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setOpenSnackbar(true);
        setTimeout(() => navigate('/login'), 2000);
      } else {
        const errorData = await response.json();
        setServerError(errorData.message || 'Error al actualizar la contraseña.');
      }
    } catch (err) {
      setServerError('Error de red. Intenta nuevamente.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
        <Typography variant="h5">Cambiar Contraseña</Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Nueva Contraseña"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error.password}
            helperText={error.password ? 'La contraseña es requerida' : ''}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirmar Contraseña"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={error.confirmPassword}
            helperText={error.confirmPassword ? 'Las contraseñas no coinciden' : ''}
          />

          {serverError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {serverError}
            </Alert>
          )}

          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2, mb: 2 }}>
            Actualizar Contraseña
          </Button>
        </Box>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={4000}
          message="Contraseña actualizada exitosamente"
        />
      </Box>
    </Container>
  );
}

export default ChangePassword;
