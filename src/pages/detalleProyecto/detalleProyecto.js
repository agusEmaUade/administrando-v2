import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Box, IconButton, Tooltip, Grid, Card, CardContent } from "@mui/material";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import NavBar from "../../components/navBar/navBar";
import {
  AddReaction as AddReactionIcon,
  AttachFile as AttachFileIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material"; // Importar íconos de Material-UI

function DetalleProyecto() {
  const { id } = useParams(); // id del proyecto desde los parámetros de la URL
  const navigate = useNavigate();

  const [projectData, setProjectData] = useState(null); // Datos completos del proyecto
  const [loading, setLoading] = useState(true);

  // Obtener datos del proyecto desde el backend
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      navigate("/login");
      return;
    }

    const userID = localStorage.getItem("userID");  
    fetch(`${process.env.API_URL}/${userID}/proyect`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error al cargar los datos del proyecto");
        return response.json();
      })
      .then((data) => {
        setProjectData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  }, [id, navigate]);

  // Descargar gastos en formato Excel
  const downloadExcel = () => {
    if (!projectData) return;

    const worksheet = XLSX.utils.json_to_sheet(
      projectData.proyectMembersAmount.map((item) => ({
        Usuario: item.name,
        Monto: item.amount,
        Detalle: item.detail,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Gastos");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "gastos-proyecto.xlsx");
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Typography variant="h5">Cargando datos del proyecto...</Typography>
      </Container>
    );
  }

  if (!projectData) {
    return (
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Typography variant="h5" color="error">
          No se encontraron datos para este proyecto.
        </Typography>
      </Container>
    );
  }

  return (
    <div>
      <NavBar />
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <IconButton onClick={() => navigate("/dashboard")} color="primary">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" gutterBottom>
          Detalle del Proyecto
        </Typography>

        {/* Información de los gastos */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h5" gutterBottom>
            Gastos del Proyecto
          </Typography>
          <Grid container spacing={2}>
            {projectData.proyectMembersAmount.map((expense, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ backgroundColor: "#f0f0f0" }}>
                  <CardContent>
                    <Typography variant="h6">{expense.name}</Typography>
                    <Typography variant="body2">Monto: ${expense.amount.toFixed(2)}</Typography>
                    <Typography variant="body2">Detalle: {expense.detail}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Botón para descargar Excel */}
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Tooltip title="Descargar Gastos como Excel">
            <IconButton color="primary" onClick={downloadExcel}>
              <AttachFileIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Información de los miembros */}
        <Box sx={{ mt: 5 }}>
          <Typography variant="h5" gutterBottom>
            Integrantes del Proyecto
          </Typography>
          <Grid container spacing={2}>
            {projectData.proyectMembers.map((member, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ backgroundColor: "#f0f0f0" }}>
                  <CardContent>
                    <Typography variant="h6">{member.name}</Typography>
                    <Typography variant="body2">Correo: {member.mail}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </div>
  );
}

export default DetalleProyecto;
