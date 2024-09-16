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
          <Box className="hero-section">
            <Typography variant="h2" component="h1" className="hero-title" gutterBottom>
              Divide gastos de manera simple y clara
            </Typography>
            <Typography variant="h5" className="hero-subtitle" gutterBottom>
              Con nuestra aplicación, gestionar y dividir los gastos es más fácil que nunca. ¡Conéctate con amigos, familiares o compañeros de trabajo!
            </Typography>

            <Box className="hero-buttons">
              <Button 
                className="custom-button primary"
                component={Link} 
                to="/registro"
              >
                Regístrate Gratis
              </Button>
              <Button 
                className="custom-button secondary"
                component={Link} 
                to="/login"
              >
                Inicia Sesión
              </Button>
            </Box>
          </Box>

          {/* Sección de características principales */}
          <Box className="features-section">
            <Typography variant="h4" gutterBottom>
              ¿Por qué usar nuestro Administrador de Gastos?
            </Typography>
            <Box className="feature-box">
              <Typography variant="h6" className="feature-title">
                Fácil de usar
              </Typography>
              <Typography variant="body1" className="feature-description">
                Crea grupos, añade gastos y nuestro sistema se encargará de dividir todo de manera equitativa o personalizada.
              </Typography>
            </Box>
            <Box className="feature-box">
              <Typography variant="h6" className="feature-title">
                Mantén el control
              </Typography>
              <Typography variant="body1" className="feature-description">
                Lleva un registro detallado de tus gastos compartidos y sabe siempre cuánto te deben o cuánto debes.
              </Typography>
            </Box>
            <Box className="feature-box">
              <Typography variant="h6" className="feature-title">
                Recordatorios automáticos
              </Typography>
              <Typography variant="body1" className="feature-description">
                La aplicación enviará recordatorios automáticos para que nadie olvide saldar sus deudas.
              </Typography>
            </Box>
          </Box>

          {/* Sección de comentarios */}
          <Box className="testimonials-section">
            <Typography variant="h4" gutterBottom>
              Lo que dicen nuestros usuarios
            </Typography>
            <Box className="testimonials-container">
              <Box className="testimonial">
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
              <Box className="testimonial">
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
              <Box className="testimonial">
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
