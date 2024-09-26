import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  TextField,
  Snackbar,
  Alert
} from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

function DetalleProyecto() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [members, setMembers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const storedAppData = JSON.parse(localStorage.getItem('appData'));

    if (storedAppData) {
      const foundProject = storedAppData.proyectos.find((proj) => proj.id === parseInt(id));

      if (foundProject) {
        setProject(foundProject);

        const projectExpenses = foundProject.tickets.map(ticket => ({
          id: ticket.id,
          concept: `Gasto del ${ticket.fecha}`,
          amount: ticket.monto,
        }));
        setExpenses(projectExpenses);

        const projectMembers = foundProject.usuarios.map(user => ({
          name: user.email,
          amountOwed: calculateAmountOwed(user.id, foundProject.tickets)
        }));
        setMembers(projectMembers);
      }
    }
  }, [id]);

  const calculateAmountOwed = (userId, tickets) => {
    let totalOwed = 0;
    tickets.forEach(ticket => {
      if (ticket.usuariosParticipantes.some(u => u.id === userId)) {
        totalOwed += ticket.monto;
      }
    });
    return totalOwed;
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(expenses);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Gastos');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'gastos-proyecto.xlsx');
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setEmail('');
    setEmailError('');
  };

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleAddUser = () => {
    if (!email) {
      setEmailError('El email es requerido');
      return;
    }
    
    if (!isValidEmail(email)) {
      setEmailError('Email no válido');
      return;
    }

    const storedAppData = JSON.parse(localStorage.getItem('appData'));
    const userFound = storedAppData.usuarios.find(user => user.email === email);

    if (userFound) {
      const updatedProject = { ...project };
      const isAlreadyMember = updatedProject.usuarios.some(user => user.id === userFound.id);

      if (!isAlreadyMember) {
        updatedProject.usuarios.push({ id: userFound.id, email: userFound.email });
        setProject(updatedProject);
        setMembers([...members, { name: userFound.email, amountOwed: 0 }]);

        const updatedAppData = {
          ...storedAppData,
          proyectos: storedAppData.proyectos.map(proj =>
            proj.id === updatedProject.id ? updatedProject : proj
          ),
        };
        localStorage.setItem('appData', JSON.stringify(updatedAppData));
      }

      setSnackbarMessage('Usuario agregado al proyecto');
    } else {
      setSnackbarMessage('Usuario no encontrado, se envió una invitación');
    }

    setSnackbarOpen(true);
    handleCloseModal();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Detalle del Proyecto: {project?.titulo}
      </Typography>

      {/* Lista de gastos */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h5">Gastos</Typography>
        {expenses.map((expense) => (
          <Card key={expense.id} sx={{ mb: 2 }}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h6">{expense.concept}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Monto: ${expense.amount}
                </Typography>
              </Box>
              <IconButton color="primary" aria-label="Ver detalle">
                <Visibility />
              </IconButton>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Lista de integrantes */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" gutterBottom>
          Integrantes del Proyecto
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Monto que debe</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {members.map((member, index) => (
                <TableRow key={index}>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>${member.amountOwed}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Botón para abrir el modal */}
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          Agregar Usuario
        </Button>
      </Box>

      {/* Botón para descargar el archivo Excel */}
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Button variant="contained" color="primary" onClick={downloadExcel}>
          Descargar Excel de Gastos
        </Button>
      </Box>

      {/* Modal para agregar usuario */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ p: 4, backgroundColor: 'white', maxWidth: 400, mx: 'auto', mt: 10 }}>
          <Typography variant="h6">Agregar usuario al proyecto</Typography>
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError('');
            }}
            error={!!emailError}
            helperText={emailError}
            sx={{ mt: 2, mb: 2 }}
          />
          <Button variant="contained" onClick={handleAddUser}>
            Enviar
          </Button>
        </Box>
      </Modal>

      {/* Snackbar para mostrar mensajes */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="info">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default DetalleProyecto;
