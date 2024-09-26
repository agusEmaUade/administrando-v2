// pages/Registro.js
import React, { useState } from 'react';
import { Container, Typography, TextField, FormControlLabel, Checkbox, Button, Box, Alert, Link } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

function Registro() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: false, password: false, emailFormat: false, emailExists: false });
  const navigate = useNavigate();

  const validateEmail = (email) => {
    // Expresión regular para validar formato de email
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Resetea los errores antes de validar
    let hasError = false;
    setErrors({ email: false, password: false, emailFormat: false, emailExists: false });

    // Validar si los campos están vacíos
    if (!email) {
      setErrors((prev) => ({ ...prev, email: true }));
      hasError = true;
    }

    if (!password) {
      setErrors((prev) => ({ ...prev, password: true }));
      hasError = true;
    }

    // Validar el formato del email si no está vacío
    if (email && !validateEmail(email)) {
      setErrors((prev) => ({ ...prev, emailFormat: true }));
      hasError = true;
    }

    if (!hasError) {
      const appData = JSON.parse(localStorage.getItem('appData'));
      const emailExists = appData.usuarios.some((usuario) => usuario.email === email);

      if (emailExists) {
        // Si el email ya existe, mostrar el error
        setErrors((prev) => ({ ...prev, emailExists: true }));
        return; // Evitar que el usuario se registre
      }

      // Crear un nuevo usuario con un id único
      const nuevoUsuario = {
        id: appData.usuarios.length + 1, // O usa alguna otra lógica para generar el ID
        email,
        password,
      };

      // Agregar el nuevo usuario al array de usuarios
      appData.usuarios.push(nuevoUsuario);

      // Guardar el objeto actualizado de nuevo en el localStorage
      localStorage.setItem('appData', JSON.stringify(appData));
      navigate('/login');
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
        <Typography variant="h5">¿Primera vez? ¡Regístrate!</Typography>
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
            error={errors.email || errors.emailFormat || errors.emailExists}
            helperText={
              errors.email
                ? 'El email es requerido'
                : errors.emailFormat
                ? 'El formato del email no es válido'
                : errors.emailExists
                ? 'El email ya está registrado'
                : ''
            }
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
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Recordar credenciales"
          />
          
          <Alert
            severity="info"
            sx={{ width: '100%', mt: 2, mb: 2 }}
            action={
              <Link to="/recuperar-cuenta" component={RouterLink} color="inherit">
                ¡Toca acá!
              </Link>
            }
          >
            ¿Tienes cuenta y no te acuerdas la contraseña?{' '}
          </Alert>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2, mb: 2 }}
          >
            Registrarse
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Registro;
