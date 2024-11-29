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
  TextField,
  IconButton,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Ícono de usuario
import { useNavigate } from 'react-router-dom';
import { decodeJWT } from '../../utils/decodeJWT';
import './dashboard.css';
import NavBar from '../../components/navBar/navBar';
import { getUserIdFromJWT } from '../../../utils/jswDecode';

function Dashboard() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);
  const [openProjectModal, setOpenProjectModal] = useState(false);
  const [openUserModal, setOpenUserModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState({ name: false, description: false });

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      const decodedUser = decodeJWT(token);
      setUser(decodedUser);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleOpenProjectModal = () => setOpenProjectModal(true);
  const handleCloseProjectModal = () => {
    setOpenProjectModal(false);
    setNewProject({ name: '', description: '' });
    setErrors({ name: false, description: false });
  };

  const handleOpenUserModal = () => setOpenUserModal(true);
  const handleCloseUserModal = () => setOpenUserModal(false);

  const handleSaveProject = async () => {
    if (!newProject.name || !newProject.description) {
      setErrors({
        name: !newProject.name,
        description: !newProject.description,
      });
      return;
    }

    try {
      const userID = getUserIdFromJWT();
      const response = await fetch(`${process.env.API_URL}/${userID}/proyect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
        body: JSON.stringify({
          proyectName: newProject.name,
          proyectDescription: newProject.description,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al guardar el proyecto');
      }

      const data = await response.json();
      setProjects((prevProjects) => [...prevProjects, data]);
      handleCloseProjectModal();
    } catch (error) {
      console.error('Error al guardar el proyecto:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div>
      <NavBar />
      {/* Ícono de usuario en la esquina superior derecha */}
      <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
        <IconButton onClick={handleOpenUserModal}>
          <AccountCircleIcon fontSize="large" />
        </IconButton>
      </Box>

      <Container maxWidth="lg" sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 5 }}>
        {projects.map((project) => (
          <Card key={project.id} sx={{ mb: 3 }}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h5">{project.proyectName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {project.proyectDescription}
                </Typography>
              </Box>
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <Button
                size="small"
                variant="outlined"
                color="primary"
                onClick={() => navigate(`/detalle-proyecto/${project.id}`)}
              >
                Ver Detalle
              </Button>
            </CardActions>
          </Card>
        ))}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button variant="contained" color="primary" onClick={handleOpenProjectModal}>
            Agregar nuevo proyecto
          </Button>
        </Box>

        {/* Modal para agregar proyecto */}
        <Dialog open={openProjectModal} onClose={handleCloseProjectModal}>
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
            <Button onClick={handleCloseProjectModal} color="secondary">
              Cancelar
            </Button>
            <Button onClick={handleSaveProject} color="primary">
              Guardar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modal de usuario */}
        <Dialog open={openUserModal} onClose={handleCloseUserModal}>
          <DialogTitle>Opciones de Usuario</DialogTitle>
          <DialogContent>
            <Typography>Bienvenido, {user?.name || 'Usuario'}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => navigate('/perfil/perfil')} color="primary">
              Ir a mi Perfil
            </Button>
            <Button onClick={handleCloseUserModal} color="secondary">
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
}

export default Dashboard;
