import React, { useState } from 'react';
import { Container, Typography, TextField, FormControlLabel, Checkbox, Button, Box, Alert, Link } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom'; // Importa el Link de react-router-dom
import { blue } from '@mui/material/colors'; // Importa el color azul de MUI
import EmailIcon from '@mui/icons-material/Email'; // Icono para el campo de email
import LockIcon from '@mui/icons-material/Lock'; // Icono para el campo de contraseña

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
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: blue[600] }}>¿Primera vez? ¡Regístrate!</Typography>
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              helperText={errors.password ? 'La contraseña es requerida' : ''}
              InputProps={{
                startAdornment: <LockIcon sx={{ color: blue[500], mr: 1 }} />, // Icono al inicio del campo
              }}
              sx={{
                borderRadius: 1,
                '& .MuiInputBase-root': { paddingLeft: 2 },
              }}
            />

            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Recordar credenciales"
            />

<Alert
  severity="info"
  sx={{
    width: 'auto', // Ajusta el ancho automáticamente según el contenido
    maxWidth: '90%', // Establece un ancho máximo para la alerta
    mt: 2,
    mb: 2,
    backgroundColor: '#e3f2fd', // Color de fondo personalizado
    borderLeft: '3px solid #1e88e5', // Borde izquierdo personalizado
    paddingLeft: '10px', // Reduce el padding izquierdo para mover el contenido hacia la izquierda
  }}
  action={
    <Link to="/recuperar-cuenta" component={RouterLink} color="inherit">
      ¡Toca acá!
    </Link>
  }
>
  ¿Tienes cuenta y no te acuerdas la contraseña?{' '}
</Alert>



            <div className="alert alert-primary" role="alert" style={{ marginTop: 10 }}>
              Aún no tienes cuenta? <Link to="/registro" className="alert-link">Selecciona acá</Link> para crear una cuenta.
            </div>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2, borderRadius: 20, textTransform: 'none', boxShadow: 2 }}
            >
              Registrarse
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Registro;
