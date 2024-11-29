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
} from "@mui/icons-material";

function DetalleProyecto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [members, setMembers] = useState([]);
  const [openUserModal, setOpenUserModal] = useState(false);
  const [openExpenseModal, setOpenExpenseModal] = useState(false);

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
          concept: `Gasto del ${ticket.fecha}`,
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
        concept: `Gasto del ${ticket.fecha}`,
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
    setExpenses(updatedExpenses);

    const storedAppData = JSON.parse(localStorage.getItem("appData"));
    const updatedProject = {
      ...project,
      tickets: updatedExpenses.map((expense) => ({
        id: expense.id,
        monto: expense.amount,
        fecha: expense.concept.split(" del ")[1],
        usuariosParticipantes: expense.usuariosParticipantes,
      })),
    };

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
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <IconButton onClick={() => navigate("/dashboard")} color="primary">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" gutterBottom>
          Detalle del Proyecto: {project?.titulo}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Tooltip title="Agregar Usuario">
            <IconButton color="primary" onClick={handleOpenUserModal}>
              <AddReactionIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Descargar Gastos como Excel">
            <IconButton color="primary" onClick={downloadExcel}>
              <AttachFileIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Agregar Gasto">
            <IconButton color="primary" onClick={handleOpenExpenseModal}>
              <MonetizationOnIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h5">Gastos</Typography>
          {expenses.map((expense) => (
            <Box key={expense.id} sx={{ mb: 2 }}>
              <ExpenseCard expense={expense} />
              <Tooltip title="Eliminar Gasto">
                <IconButton
                  color="secondary"
                  onClick={() => handleDeleteExpense(expense.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          ))}

          <Typography variant="h6" sx={{ mt: 3, fontWeight: "bold" }}>
            Total Acumulado: ${totalAmount.toFixed(2)}
          </Typography>

          <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
            Total por persona: ${amountPerMember.toFixed(2)}
          </Typography>
        </Box>

        <Box sx={{ mt: 5 }}>
          <Typography variant="h5" gutterBottom>
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
                  <Card sx={{ backgroundColor: "#f0f0f0" }}>
                    <CardContent>
                      <Typography variant="h6">{member.name}</Typography>
                      <Typography variant="body2">
                        Total Aportado: ${memberTotal.toFixed(2)}
                      </Typography>
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
      </Container>
    </div>
  );
}

export default DetalleProyecto;
