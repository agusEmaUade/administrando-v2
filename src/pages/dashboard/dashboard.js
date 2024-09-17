import React, { useState } from 'react';
import { Container, Typography, Box, Button, Card, CardContent, CardActions } from '@mui/material';
import './dashboard.css'; // Estilos
import NavBar from '../../components/navBar/navBar';

function Dashboard() {
  // Estado para manejar la lista de proyectos
  const [projects, setProjects] = useState([
    { id: 1, name: 'Proyecto A', totalAmount: 1000 },
    { id: 2, name: 'Proyecto B', totalAmount: 2000 },
  ]);

  // Función para agregar un nuevo proyecto
  const addNewProject = () => {
    const newProject = {
      id: projects.length + 1, // Genera un id incremental
      name: `Proyecto ${String.fromCharCode(65 + projects.length)}`, // Nombre dinámico
      totalAmount: Math.floor(Math.random() * 5000) + 1000, // Monto aleatorio
    };
    setProjects([...projects, newProject]); // Añade el nuevo proyecto
  };

  return (
    <div>
      <NavBar />
      <Container maxWidth="lg" sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 5 }}>
        <Box sx={{ textAlign: 'center', pb: 5 }}>
          <Typography variant="h2" component="h1" className="hero-title" gutterBottom>
            Hola, José
          </Typography>
        </Box>

        {/* Renderizar tarjetas de proyectos */}
        {projects.map((project) => (
          <Card key={project.id} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                {project.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Monto total: ${project.totalAmount}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" variant="outlined" color="primary">
                Ver Detalle
              </Button>
            </CardActions>
          </Card>
        ))}

        {/* Botón para agregar nuevo proyecto siempre al final */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={addNewProject}
          >
            Agregar nuevo proyecto
          </Button>
        </Box>
      </Container>
    </div>
  );
}

export default Dashboard;
