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
import './dashboard.css';
import NavBar from '../../components/navBar/navBar';

function Dashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [userLogin, setUserLogin] = useState(null);
  const [appData, setAppData] = useState(null);
  const [open, setOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState({ name: false, description: false });

  useEffect(() => {
    const storedUserLogin = JSON.parse(localStorage.getItem('userLogin'));
    const storedAppData = JSON.parse(localStorage.getItem('appData'));

    if (storedUserLogin && storedAppData) {
      setUserLogin(storedUserLogin);
      setAppData(storedAppData);
      const userProjects = storedAppData.proyectos.filter(project => 
        project.usuarios.some(user => user.id === storedUserLogin.id)
      );
      setProjects(userProjects);
    }
  }, []);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setNewProject({ name: '', description: '' });
    setErrors({ name: false, description: false });
  };

  const handleSave = () => {
    if (!newProject.name || !newProject.description) {
      setErrors({
        name: !newProject.name,
        description: !newProject.description,
      });
      return;
    }

    const newProjectData = {
      id: appData.proyectos.length + 1,
      titulo: newProject.name,
      descripcion: newProject.description,
      montoTotal: 0,
      usuarios: [userLogin],
      tickets: []
    };

    const updatedAppData = {
      ...appData,
      proyectos: [...appData.proyectos, newProjectData]
    };

    localStorage.setItem('appData', JSON.stringify(updatedAppData));
    setAppData(updatedAppData);

    const userProjects = updatedAppData.proyectos.filter(project =>
      project.usuarios.some(user => user.id === userLogin.id)
    );
    setProjects(userProjects);
    handleClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div>
      <NavBar />
      <Container maxWidth="lg" sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 5 }}>
        {projects.map((project) => (
          <Card key={project.id} sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{project.titulo}</Typography>
                <Typography variant="body2" color="text.secondary">{project.descripcion}</Typography>
              </Box>
              <Typography variant="h6" sx={{ textAlign: 'right', fontWeight: 'bold', color: 'green' }}>
                ${project.montoTotal}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <Button size="small" variant="outlined" onClick={() => navigate(`/detalle-proyecto/${project.id}`)}>
                Ver Detalle
              </Button>
            </CardActions>
          </Card>
        ))}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Agregar nuevo proyecto
          </Button>
        </Box>
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
              helperText={errors.name && 'El nombre es requerido'}
            />
            <TextField
              margin="dense"
              label="Descripción del proyecto"
              name="description"
              fullWidth
              value={newProject.description}
              onChange={handleInputChange}
              error={errors.description}
              helperText={errors.description && 'La descripción es requerida'}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">Cancelar</Button>
            <Button onClick={handleSave} color="primary">Guardar</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
}

export default Dashboard;
