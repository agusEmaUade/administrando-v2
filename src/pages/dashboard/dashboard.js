import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from '@mui/material';
import { useNavigate } from "react-router-dom";
import './dashboard.css'; // Estilos
import NavBar from '../../components/navBar/navBar';

function Dashboard() {
  
  const navigate = useNavigate(); // Para redirigir
  
  // Estado para manejar la lista de proyectos
  const [projects, setProjects] = useState([
    { id: 1, name: 'Proyecto A', description: 'Descripción del Proyecto A', totalAmount: 1000 },
    { id: 2, name: 'Proyecto B', description: 'Descripción del Proyecto B', totalAmount: 2000 },
  ]);

  // Estado para manejar el modal
  const [open, setOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState({ name: false, description: false });

  // Función para manejar la apertura del modal
  const handleOpen = () => {
    setOpen(true);
  };

  // Función para cerrar el modal
  const handleClose = () => {
    setOpen(false);
    setNewProject({ name: '', description: '' });
    setErrors({ name: false, description: false });
  };

  // Función para agregar un nuevo proyecto
  const handleSave = () => {
    if (!newProject.name || !newProject.description) {
      setErrors({
        name: !newProject.name,
        description: !newProject.description,
      });
      return;
    }
    const project = {
      id: projects.length + 1,
      name: newProject.name,
      description: newProject.description,
      totalAmount: 0,
    };
    setProjects([...projects, project]);
    handleClose(); // Cierra el modal después de agregar el proyecto
  };

  // Manejar los cambios en el formulario del modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div>
      <NavBar />
      <Container maxWidth="lg" sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 5 }}>
        {/* Renderizar tarjetas de proyectos */}
        {projects.map((project) => (
          <Card key={project.id} sx={{ mb: 3 }}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
              {/* Nombre y descripción en la izquierda */}
              <Box>
                <Typography variant="h5">{project.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {project.description}
                </Typography>
              </Box>
              {/* Monto total en la derecha */}
              <Typography variant="h6" sx={{ textAlign: 'right' }}>
                ${project.totalAmount}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <Button size="small" variant="outlined" color="primary" onClick={() => navigate("/detalle-proyecto")}>
                Ver Detalle
              </Button>
            </CardActions>
          </Card>
        ))}

        {/* Botón para abrir el modal */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Agregar nuevo proyecto
          </Button>
        </Box>

        {/* Modal para agregar proyecto */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Agregar nuevo proyecto</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nombre del proyecto"
              name="name"
              fullWidth
              value={newProject.name}
              onChange={handleInputChange}
              error={errors.name}
              helperText={errors.name ? 'El nombre es requerido' : ''}
            />
            <TextField
              margin="dense"
              label="Descripción del proyecto"
              name="description"
              fullWidth
              value={newProject.description}
              onChange={handleInputChange}
              error={errors.description}
              helperText={errors.description ? 'La descripción es requerida' : ''}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancelar
            </Button>
            <Button onClick={handleSave} color="primary">
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
}

export default Dashboard;
