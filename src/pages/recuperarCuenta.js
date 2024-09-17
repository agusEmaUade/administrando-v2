// pages/RecuperarCuenta.js
import React from 'react';
import { Container, Typography, TextField, Button, Box, Alert, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function RecuperarCuenta() {
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
      </Box>
    </Container>
  );
}

export default RecuperarCuenta;
