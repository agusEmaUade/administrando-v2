import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Alert, Link } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { blue } from '@mui/material/colors';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

function Registro() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: false, password: false, emailFormat: false });
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({ email: false, password: false, emailFormat: false });
    setServerError('');
    setSuccessMessage('');

    let hasError = false;

    if (!email) {
      setErrors((prev) => ({ ...prev, email: true }));
      hasError = true;
    }

    if (!password) {
      setErrors((prev) => ({ ...prev, password: true }));
      hasError = true;
    }

    if (email && !validateEmail(email)) {
      setErrors((prev) => ({ ...prev, emailFormat: true }));
      hasError = true;
    }

    if (!hasError) {
      try {
        const response = await fetch(`${process.env.API_URL}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          setSuccessMessage('¡Cuenta creada con éxito! Redirigiendo al inicio de sesión...');
          setTimeout(() => navigate('/login'), 2000);
        } else {
          const errorData = await response.json();
          setServerError(errorData.message || 'Ocurrió un error al registrarte.');
        }
      } catch (err) {
        setServerError('Error de red. Intenta nuevamente más tarde.');
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f4f6f8',
      }}
    >
      <Container
        component="main"
        maxWidth="xs"
        sx={{ backgroundColor: '#e0e0e0', borderRadius: 2, boxShadow: 3, padding: 4 }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: blue[600] }}>
            ¿Primera vez? ¡Regístrate!
          </Typography>
          <Box
            component="form"
            noValidate
            sx={{
              mt: 3,
              width: '100%',
            }}
            onSubmit={handleSubmit}
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
              error={errors.email || errors.emailFormat}
              helperText={
                errors.email
                  ? 'El email es requerido'
                  : errors.emailFormat
                  ? 'El formato del email no es válido'
                  : ''
              }
              InputProps={{
                startAdornment: <EmailIcon sx={{ color: blue[500], mr: 1 }} />,
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              helperText={errors.password ? 'La contraseña es requerida' : ''}
              InputProps={{
                startAdornment: <LockIcon sx={{ color: blue[500], mr: 1 }} />,
              }}
            />

            {serverError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {serverError}
              </Alert>
            )}

            {successMessage && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {successMessage}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2, borderRadius: 20, textTransform: 'none', boxShadow: 2 }}
            >
              Registrarse
            </Button>

            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" component={RouterLink} color="primary">
                Inicia sesión aquí
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Registro;
