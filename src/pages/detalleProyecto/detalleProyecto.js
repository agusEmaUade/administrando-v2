import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Grid,
  Card,
  CardContent,
  Modal,
} from "@mui/material";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import ExpenseCard from "../../components/expenseCard";
import AddUserModal from "../../components/addUserModal";
import AddExpenseModal from "../../components/addExpenseModal";
import NavBar from "../../components/navBar/navBar";
import {
  AddReaction as AddReactionIcon,
  AttachFile as AttachFileIcon,
  MonetizationOn as MonetizationOnIcon,
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";

function DetalleProyecto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [members, setMembers] = useState([]);
  const [openUserModal, setOpenUserModal] = useState(false);
  const [openExpenseModal, setOpenExpenseModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  useEffect(() => {
    const storedAppData = JSON.parse(localStorage.getItem("appData"));

    if (storedAppData) {
      const foundProject = storedAppData.proyectos.find(
        (proj) => proj.id === parseInt(id)
      );

      if (foundProject) {
        setProject(foundProject);

        const projectExpenses = foundProject.tickets.map((ticket) => ({
          id: ticket.id,
          concept: ticket.concepto || `Gasto del ${ticket.fecha}`,
          amount: ticket.monto,
          usuariosParticipantes: ticket.usuariosParticipantes || [],
        }));
        setExpenses(projectExpenses);

        const projectMembers = foundProject.usuarios.map((user) => ({
          id: user.id,
          name: user.email,
        }));
        setMembers(projectMembers);
      }
    }
  }, [id]);

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(expenses);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Gastos");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "gastos-proyecto.xlsx");
  };

  const handleOpenUserModal = () => setOpenUserModal(true);
  const handleCloseUserModal = () => setOpenUserModal(false);
  const handleOpenExpenseModal = () => setOpenExpenseModal(true);
  const handleCloseExpenseModal = () => setOpenExpenseModal(false);

  const handleOpenDetailModal = (expense) => {
    setSelectedExpense(expense);
    setOpenDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setOpenDetailModal(false);
    setSelectedExpense(null);
  };

  const handleAddUser = (email) => {
    const storedAppData = JSON.parse(localStorage.getItem("appData"));
    const userFound = storedAppData.usuarios.find(
      (user) => user.email === email
    );

    if (userFound) {
      const updatedProject = { ...project };
      const isAlreadyMember = updatedProject.usuarios.some(
        (user) => user.id === userFound.id
      );

      if (!isAlreadyMember) {
        updatedProject.usuarios.push({
          id: userFound.id,
          email: userFound.email,
        });
        setProject(updatedProject);
        setMembers([...members, { id: userFound.id, name: userFound.email }]);

        const updatedAppData = {
          ...storedAppData,
          proyectos: storedAppData.proyectos.map((proj) =>
            proj.id === updatedProject.id ? updatedProject : proj
          ),
        };
        localStorage.setItem("appData", JSON.stringify(updatedAppData));
      }
    }

    handleCloseUserModal();
  };

  const handleAddExpense = (newExpense) => {
    if (!project || !project.tickets) return;

    const storedAppData = JSON.parse(localStorage.getItem("appData"));

    const updatedTickets = [
      ...project.tickets,
      {
        id: Date.now(),
        monto: newExpense.amount,
        concepto: newExpense.concept,
        fecha: new Date().toISOString().split("T")[0],
        usuariosParticipantes: newExpense.users || [],
      },
    ];

    const updatedProject = {
      ...project,
      tickets: updatedTickets,
    };

    setProject(updatedProject);
    setExpenses(
      updatedTickets.map((ticket) => ({
        id: ticket.id,
        concept: ticket.concepto || `Gasto del ${ticket.fecha}`,
        amount: ticket.monto,
        usuariosParticipantes: ticket.usuariosParticipantes || [],
      }))
    );

    const updatedAppData = {
      ...storedAppData,
      proyectos: storedAppData.proyectos.map((proj) =>
        proj.id === updatedProject.id ? updatedProject : proj
      ),
    };

    localStorage.setItem("appData", JSON.stringify(updatedAppData));
    handleCloseExpenseModal();
  };

  const handleDeleteExpense = (expenseId) => {
    const updatedExpenses = expenses.filter(
      (expense) => expense.id !== expenseId
    );

    const updatedTickets = project.tickets.filter(
      (ticket) => ticket.id !== expenseId
    );

    const updatedProject = {
      ...project,
      tickets: updatedTickets,
    };

    setProject(updatedProject);
    setExpenses(
      updatedTickets.map((ticket) => ({
        id: ticket.id,
        concept: ticket.concepto || `Gasto del ${ticket.fecha}`,
        amount: ticket.monto,
        usuariosParticipantes: ticket.usuariosParticipantes || [],
      }))
    );

    const storedAppData = JSON.parse(localStorage.getItem("appData"));
    const updatedAppData = {
      ...storedAppData,
      proyectos: storedAppData.proyectos.map((proj) =>
        proj.id === updatedProject.id ? updatedProject : proj
      ),
    };

    localStorage.setItem("appData", JSON.stringify(updatedAppData));
  };

  const totalAmount = expenses.reduce((acc, expense) => acc + expense.amount, 0);
  const amountPerMember = members.length > 0 ? totalAmount / members.length : 0;

  return (
    <div>
      <NavBar />
      <Box
        sx={{
          background: 'linear-gradient(to bottom, #6a11cb, #2575fc)',
          minHeight: '100vh',
          py: 5,
        }}
      >
        <Container maxWidth="lg">
          <IconButton onClick={() => navigate("/dashboard")} sx={{ color: '#fff' }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" gutterBottom sx={{ color: '#fff', fontWeight: 'bold' }}>
            Detalle del Proyecto: {project?.titulo}
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Tooltip title="Agregar Usuario">
              <IconButton sx={{ color: '#fff' }} onClick={handleOpenUserModal}>
                <AddReactionIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Descargar Gastos como Excel">
              <IconButton sx={{ color: '#fff' }} onClick={downloadExcel}>
                <AttachFileIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Agregar Gasto">
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton sx={{ color: '#fff' }} onClick={handleOpenExpenseModal}>
                  <MonetizationOnIcon />
                </IconButton>
                <Typography variant="body1" sx={{ ml: 1, color: '#fff' }}>
                  Agregar
                </Typography>
              </Box>
            </Tooltip>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h5" sx={{ color: '#fff', fontWeight: 'bold' }}>Gastos</Typography>
            {expenses.map((expense) => (
              <Box key={expense.id} sx={{ mb: 2 }}>
                <ExpenseCard expense={expense} />
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Tooltip title="Ver Detalles del Gasto">
                    <IconButton
                      sx={{ color: '#fff' }}
                      onClick={() => handleOpenDetailModal(expense)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar Gasto">
                    <IconButton
                      sx={{ color: '#ff1744' }}
                      onClick={() => handleDeleteExpense(expense.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            ))}

            <Typography variant="h6" sx={{ mt: 3, fontWeight: "bold", color: '#fff' }}>
              Total Acumulado: ${totalAmount.toFixed(2)}
            </Typography>

            <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold", color: '#fff' }}>
              Total por persona: ${amountPerMember.toFixed(2)}
            </Typography>
          </Box>

          <Box sx={{ mt: 5 }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#fff', fontWeight: 'bold' }}>
              Integrantes del Proyecto
            </Typography>
            <Grid container spacing={2}>
              {members.map((member, index) => {
                const memberTotal = expenses.reduce((acc, expense) => {
                  if (expense.usuariosParticipantes.includes(member.id)) {
                    return acc + expense.amount;
                  }
                  return acc;
                }, 0);

                return (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card sx={{ backgroundColor: "#ffffffdd", borderRadius: 4, boxShadow: 3 }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{member.name}</Typography>
                        
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>

          <AddUserModal
            open={openUserModal}
            onClose={handleCloseUserModal}
            onAddUser={handleAddUser}
          />
          <AddExpenseModal
            open={openExpenseModal}
            onClose={handleCloseExpenseModal}
            onAddExpense={handleAddExpense}
          />
          <Modal
            open={openDetailModal}
            onClose={handleCloseDetailModal}
            aria-labelledby="expense-detail-title"
            aria-describedby="expense-detail-description"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "#ffffffee",
                borderRadius: 4,
                boxShadow: 24,
                p: 4,
              }}
            >
              <Typography id="expense-detail-title" variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                Detalles del Gasto
              </Typography>
              {selectedExpense && (
                <>
                  <Typography id="expense-detail-description" sx={{ mt: 2 }}>
                    Concepto: {selectedExpense.concept}
                  </Typography>
                  <Typography sx={{ mt: 1 }}>
                    Monto: ${selectedExpense.amount.toFixed(2)}
                  </Typography>
                  <Typography sx={{ mt: 1 }}>Usuarios Participantes:</Typography>
                  <ul>
                    {selectedExpense.usuariosParticipantes.map((userId) => {
                      const user = members.find((member) => member.id === userId);
                      return (
                        <li key={userId}>
                          {user ? user.name : "Usuario desconocido"}
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}
            </Box>
          </Modal>
        </Container>
      </Box>
    </div>
  );
}

export default DetalleProyecto;
