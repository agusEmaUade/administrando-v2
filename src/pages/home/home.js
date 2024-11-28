import React from 'react';
import { Button, Container, Typography, Box, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import './home.css'; // Estilos personalizados

function Home() {
  return (
    <div className="home-background">
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', py: 5 }}>
          {/* Sección principal con título y botones */}
          <Box className="hero-section"sx={{ mt: -4 }}>
            <Typography variant="h2" component="h1" className="hero-title" gutterBottom sx={{ fontFamily: 'Tahoma, sans-seriff'}}>
              Divide gastos de manera simple y clara.

            </Typography>
            <Typography variant="h5" className="hero-subtitle" gutterBottom sx={{ fontFamily: 'Lobster, cursive'}} sx={{ mt: 5 }}>
              Con nuestra aplicación, gestionar y dividir los gastos es más fácil que nunca. ¡Conéctate con amigos, familiares o compañeros de trabajo!
            </Typography>

            <Box className="hero-buttons" sx={{ mt: 6 }}>

              <Button 
                className="custom-button primary"
                component={Link} 
                to="/registro"
                sx={{
                  '&:hover': {
                    backgroundColor: '#1976d2', // Cambia el color de fondo al pasar el mouse
                    color: 'black', // Cambia el color de la tipografía a negro
                    transform: 'scale(1.05)', // Efecto de agrandado
                  },
                  transition: 'all 0.3s ease', // Añade la transición suave
                }}
              >
                Regístrate Gratis
              </Button>
              <Button 
                className="custom-button secondary"
                component={Link} 
                to="/login"
                sx={{
                  '&:hover': {
                    backgroundColor: '#1976d2', // Cambia el color de fondo
                    color: 'black', // Cambia la tipografía a negro
                    transform: 'scale(1.05)', // Efecto de agrandado
                  },
                  transition: 'all 0.3s ease', // Efecto suave de transición
                }}
              >
                Inicia Sesión
              </Button>
            </Box>
          </Box>

          {/* Sección de características principales */}
          <Box className="features-section" sx={{ textAlign: 'center', marginBottom: 4 }}>
  {/* Título centrado */}
  <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 4 }}>
    ¿Por qué usar nuestro Administrador de Gastos?
  </Typography>

  {/* Contenedor de las características, alineado en columnas */}
  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
    <Box 
      sx={{
        backgroundColor: '#f5f5f5',
        borderRadius: '12px',
        padding: 3,
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        textAlign: 'center',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: '0 8px 12px rgba(0,0,0,0.2)',
        },
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', marginBottom: 2 }}>
        <i className="fas fa-users" style={{ marginRight: '8px' }}></i> Fácil de usar
      </Typography>
      <Typography variant="body1" sx={{ color: 'black', fontFamily: 'Lobster, cursive' }}>
        Crea grupos, añade gastos y nuestro sistema se encargará de dividir todo de manera equitativa o personalizada.
      </Typography>
    </Box>

    <Box 
      sx={{
        backgroundColor: '#f5f5f5',
        borderRadius: '12px',
        padding: 3,
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        textAlign: 'center',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: '0 8px 12px rgba(0,0,0,0.2)',
        },
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', marginBottom: 2 }}>
        <i className="fas fa-chart-line" style={{ marginRight: '8px' }}></i> Mantén el control
      </Typography>
      <Typography variant="body1" sx={{ color: 'black', fontFamily: 'Lobster, cursive' }}>
        Lleva un registro detallado de tus gastos compartidos y sabe siempre cuánto te deben o cuánto debes.
      </Typography>
    </Box>

    <Box 
      sx={{
        backgroundColor: '#f5f5f5',
        borderRadius: '12px',
        padding: 3,
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        textAlign: 'center',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: '0 8px 12px rgba(0,0,0,0.2)',
        },
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', marginBottom: 2 }}>
        <i className="fas fa-bell" style={{ marginRight: '8px' }}></i> Recordatorios automáticos
      </Typography>
      <Typography variant="body1" sx={{ color: 'black', fontFamily: 'Lobster, cursive' }}>
        La aplicación enviará recordatorios automáticos para que nadie olvide saldar sus deudas.
      </Typography>
    </Box>
  </Box>
</Box>




          {/* Sección de comentarios */}

          
          <Box className="testimonials-section">
  <Typography variant="h4" gutterBottom>
    Lo que dicen nuestros usuarios
  </Typography>
  <Box className="testimonials-container">
    <Box 
      className="testimonial" 
      sx={{
        transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Transición suave
        '&:hover': {
          transform: 'scale(1.05)', // Efecto de agrandado
          boxShadow: '0 8px 12px rgba(0,0,0,0.2)', // Sombra más fuerte al hacer hover
        },
      }}
    >
      <Box className="testimonial-header">
        <Avatar src={require("../../assets/imagenes/Anaimagen.png")} className="testimonial-avatar" />
        <Typography variant="body2" className="testimonial-name">
          Ana García
        </Typography>
      </Box>
      <Typography variant="body1" className="testimonial-text">
        "Esta aplicación ha hecho que dividir gastos con mis amigos sea mucho más fácil y sin estrés. ¡Me encanta!"
      </Typography>
    </Box>

    <Box 
      className="testimonial" 
      sx={{
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: '0 8px 12px rgba(0,0,0,0.2)',
        },
      }}
    >
      <Box className="testimonial-header">
        <Avatar src={require("../../assets/imagenes/Luis.enc")} className="testimonial-avatar" />
        <Typography variant="body2" className="testimonial-name">
          Luis Fernández
        </Typography>
      </Box>
      <Typography variant="body1" className="testimonial-text">
        "La mejor herramienta para llevar un control de mis gastos compartidos. Muy intuitiva y útil."
      </Typography>
    </Box>

    <Box 
      className="testimonial" 
      sx={{
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: '0 8px 12px rgba(0,0,0,0.2)',
        },
      }}
    >
      <Box className="testimonial-header">
        <Avatar src={require("../../assets/imagenes/Maria.webp")} className="testimonial-avatar" />
        <Typography variant="body2" className="testimonial-name">
          Marta López
        </Typography>
      </Box>
      <Typography variant="body1" className="testimonial-text">
        "Simple, eficiente y todo lo que necesitaba para manejar mis gastos en grupo. Muy recomendada."
      </Typography>
    </Box>
  </Box>
</Box>

        </Box>
      </Container>
    </div>
  );
}

export default Home;
