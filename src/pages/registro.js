// pages/Registro.js
import React from 'react';
import { Container, Typography, TextField, FormControlLabel, Checkbox, Button, Box, Alert, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function Registro() {
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
