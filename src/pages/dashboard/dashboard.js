import React, { useState, useEffect } from 'react';
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
  const [projects, setProjects] = useState([]);
  const [userLogin, setUserLogin] = useState(null);
  const [appData, setAppData] = useState(null);

  // Estado para manejar el modal
  const [open, setOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState({ name: false, description: false });

  // Obtener datos de localStorage
  useEffect(() => {
    const storedUserLogin = JSON.parse(localStorage.getItem('userLogin'));
    const storedAppData = JSON.parse(localStorage.getItem('appData'));

    if (storedUserLogin && storedAppData) {
      setUserLogin(storedUserLogin);
      setAppData(storedAppData);
      
      // Filtrar los proyectos que incluyen al usuario logueado
      const userProjects = storedAppData.proyectos.filter(project => 
        project.usuarios.some(user => user.id === storedUserLogin.id)
      );
      setProjects(userProjects);
    }
  }, []);

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

    // Crear el nuevo proyecto
    const newProjectData = {
      id: appData.proyectos.length + 1, // ID dinámico basado en la cantidad de proyectos actuales
      titulo: newProject.name,
      descripcion: newProject.description,
      montoTotal: 0,
      usuarios: [userLogin], // Asignar el usuario logueado como miembro del proyecto
      tickets: []
    };

    // Actualizar el localStorage
    const updatedAppData = {
      ...appData,
      proyectos: [...appData.proyectos, newProjectData]
    };

    localStorage.setItem('appData', JSON.stringify(updatedAppData));
    setAppData(updatedAppData); // Actualizar el estado con los nuevos datos

    // Filtrar y actualizar la lista de proyectos del usuario logueado
    const userProjects = updatedAppData.proyectos.filter(project =>
      project.usuarios.some(user => user.id === userLogin.id)
    );
    setProjects(userProjects); // Actualizar los proyectos mostrados en pantalla

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
                <Typography variant="h5">{project.titulo}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {project.descripcion}
                </Typography>
              </Box>
              {/* Monto total en la derecha */}
              <Typography variant="h6" sx={{ textAlign: 'right' }}>
                ${project.montoTotal}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <Button size="small" variant="outlined" color="primary" onClick={() => navigate(`/detalle-proyecto/${project.id}`)}>
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
