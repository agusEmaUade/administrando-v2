import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import NavBar from "../../components/navBar/navBar";

function Dashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [userLogin, setUserLogin] = useState(null);
  const [userId, setUserId] = useState(null);
  const [appData, setAppData] = useState(null);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [newProject, setNewProject] = useState({ name: "", description: "" });
  const [editProject, setEditProject] = useState({ name: "", description: "" });
  const [errors, setErrors] = useState({ name: false, description: false });
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProjects = async () => {
      if (!token) {
        alert("No se encontró el token de autenticación.");
        return;
      }

      try {
        const validateTokenResponse = await fetch(
          "http://localhost:8080/api/validate-token",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!validateTokenResponse.ok) {
          throw new Error("Error al validar el token.");
        }

        const validateTokenData = await validateTokenResponse.json();

        const userId = validateTokenData.user.id;
        setUserId(userId);

        const projectsResponse = await fetch(
          `http://localhost:8080/api/project/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!projectsResponse.ok) {
          throw new Error("Error al obtener los proyectos del usuario.");
        }

        const projectsData = await projectsResponse.json();
        setProjects(projectsData);
      } catch (error) {
        alert(error.message);
      }
    };

    fetchProjects();
  }, [token]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewProject({ name: "", description: "" });
    setErrors({ name: false, description: false });
  };

  const handleOpenEdit = (project) => {
    setSelectedProject(project);
    setEditProject({ name: project.titulo, description: project.descripcion });
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setSelectedProject(null);
    setEditProject({ name: "", description: "" });
    setErrors({ name: false, description: false });
  };

  const handleSave = async () => {
    if (!newProject.name || !newProject.description) {
      setErrors({
        name: !newProject.name,
        description: !newProject.description,
      });
      return;
    }

    const newProjectData = {
      titulo: newProject.name,
      descripcion: newProject.description,
    };

    try {
      const newProjectResponse = await fetch(
        `http://localhost:8080/api/project/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newProjectData),
        }
      );

      if (!newProjectResponse.ok) {
        throw new Error("Error al crear los proyectos.");
      }
      const projectsResponse = await fetch(
        `http://localhost:8080/api/project/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!projectsResponse.ok) {
        throw new Error("Error al obtener los proyectos del usuario.");
      }

      const projectsData = await projectsResponse.json();
      setProjects(projectsData);
      handleClose();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEditSave = () => {
    if (!editProject.name || !editProject.description) {
      setErrors({
        name: !editProject.name,
        description: !editProject.description,
      });
      return;
    }

    const updatedProjects = appData.proyectos.map((project) =>
      project.id === selectedProject.id
        ? {
            ...project,
            titulo: editProject.name,
            descripcion: editProject.description,
          }
        : project
    );

    const updatedAppData = { ...appData, proyectos: updatedProjects };
    localStorage.setItem("appData", JSON.stringify(updatedAppData));
    setAppData(updatedAppData);

    const userProjects = updatedAppData.proyectos.filter((project) =>
      project.usuarios.some((user) => user.id === userLogin.id)
    );
    setProjects(userProjects);
    handleCloseEdit();
  };

  const handleDelete = (projectId) => {
    const updatedProjects = appData.proyectos.filter(
      (project) => project.id !== projectId
    );
    const updatedAppData = { ...appData, proyectos: updatedProjects };
    localStorage.setItem("appData", JSON.stringify(updatedAppData));
    setAppData(updatedAppData);

    const userProjects = updatedAppData.proyectos.filter((project) =>
      project.usuarios.some((user) => user.id === userLogin.id)
    );
    setProjects(userProjects);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditProject((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div>
      <NavBar />
      <Box
        sx={{
          background: "linear-gradient(to bottom, #6a11cb, #2575fc)",
          minHeight: "100vh",
          py: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{ color: "#fff", mb: 4, fontWeight: "bold" }}
        >
          Dashboard de Proyectos
        </Typography>
        <Container maxWidth="lg">
          {projects.map((project) => (
            <Card
              key={project.id}
              sx={{
                mb: 3,
                borderRadius: 4,
                boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                background: "#ffffffdd",
                backdropFilter: "blur(10px)",
              }}
            >
              <CardContent
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    {project.titulo}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {project.descripcion}
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    textAlign: "right",
                    fontWeight: "bold",
                    color: "#4caf50",
                  }}
                >
                  ${project.montoTotal}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end" }}>
                <Button
                  size="small"
                  variant="contained"
                  sx={{
                    backgroundColor: "#6a11cb",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#2575fc" },
                  }}
                  onClick={() => navigate(`/detalle-proyecto/${project.id}`)}
                >
                  Ver Detalle
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  sx={{
                    backgroundColor: "#ffa726",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#fb8c00" },
                  }}
                  onClick={() => handleOpenEdit(project)}
                >
                  Editar
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  sx={{
                    backgroundColor: "#e53935",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#d32f2f" },
                  }}
                  onClick={() => handleDelete(project.id)}
                >
                  Eliminar
                </Button>
              </CardActions>
            </Card>
          ))}
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#4caf50",
                color: "#fff",
                py: 1.5,
                px: 3,
                fontSize: "1rem",
                borderRadius: 50,
                "&:hover": { backgroundColor: "#388e3c" },
              }}
              onClick={handleOpen}
            >
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
                helperText={errors.name && "El nombre es requerido"}
              />
              <TextField
                margin="dense"
                label="Descripción del proyecto"
                name="description"
                fullWidth
                value={newProject.description}
                onChange={handleInputChange}
                error={errors.description}
                helperText={errors.description && "La descripción es requerida"}
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
          <Dialog open={openEdit} onClose={handleCloseEdit}>
            <DialogTitle>Editar proyecto</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Nombre del proyecto"
                name="name"
                fullWidth
                value={editProject.name}
                onChange={handleEditInputChange}
                error={errors.name}
                helperText={errors.name && "El nombre es requerido"}
              />
              <TextField
                margin="dense"
                label="Descripción del proyecto"
                name="description"
                fullWidth
                value={editProject.description}
                onChange={handleEditInputChange}
                error={errors.description}
                helperText={errors.description && "La descripción es requerida"}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseEdit} color="secondary">
                Cancelar
              </Button>
              <Button onClick={handleEditSave} color="primary">
                Guardar
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </div>
  );
}

export default Dashboard;
