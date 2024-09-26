import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Box, IconButton, Tooltip } from "@mui/material";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import ExpenseCard from "../../components/expenseCard"; // Importa el componente de gastos
import MemberTable from "../../components/memberTable"; // Importa el nuevo componente de tabla
import AddUserModal from "../../components/addUserModal"; // Importa el nuevo componente de modal
import AddExpenseModal from "../../components/addExpenseModal"; // Importa el nuevo componente de modal
import NavBar from "../../components/navBar/navBar";
import {
  AddReaction as AddReactionIcon,
  AttachFile as AttachFileIcon,
  MonetizationOn as MonetizationOnIcon,
} from "@mui/icons-material"; // Importar íconos de Material-UI

function DetalleProyecto() {
  const { id } = useParams();
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
        }));
        setExpenses(projectExpenses);

        const projectMembers = foundProject.usuarios.map((user) => ({
          name: user.email,
          amountOwed: calculateAmountOwed(user.id, foundProject.tickets),
        }));
        setMembers(projectMembers);
      }
    }
  }, [id]);

  const calculateAmountOwed = (userId, tickets) => {
    let totalOwed = 0;
    tickets.forEach((ticket) => {
      if (ticket.usuariosParticipantes.some((u) => u.id === userId)) {
        totalOwed += ticket.monto;
      }
    });
    return totalOwed;
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(expenses);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Gastos");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
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
        setMembers([...members, { name: userFound.email, amountOwed: 0 }]);

        const updatedAppData = {
          ...storedAppData,
          proyectos: storedAppData.proyectos.map((proj) =>
            proj.id === updatedProject.id ? updatedProject : proj
          ),
        };
        localStorage.setItem("appData", JSON.stringify(updatedAppData));
      }
    } else {
      // Lógica para invitar al usuario si no se encuentra en la base de datos
    }

    handleCloseUserModal();
  };

  const handleAddExpense = (newExpense) => {
    const updatedExpenses = [...expenses, { id: Date.now(), ...newExpense }];
    setExpenses(updatedExpenses);

    // Actualizar el proyecto en localStorage
    const storedAppData = JSON.parse(localStorage.getItem("appData"));
    const updatedProject = {
      ...project,
      tickets: [
        ...project.tickets,
        {
          id: Date.now(),
          monto: newExpense.amount,
          fecha: new Date().toISOString().split("T")[0],
          usuariosParticipantes: [],
        },
      ],
    };

    const updatedAppData = {
      ...storedAppData,
      proyectos: storedAppData.proyectos.map((proj) =>
        proj.id === updatedProject.id ? updatedProject : proj
      ),
    };

    localStorage.setItem("appData", JSON.stringify(updatedAppData));
    handleCloseExpenseModal();
  };

  return (
    <div>
      <NavBar />
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Detalle del Proyecto: {project?.titulo}
        </Typography>

        {/* Botones de acción en la parte superior */}
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

        {/* Lista de gastos */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h5">Gastos</Typography>
          {expenses.map((expense) => (
            <ExpenseCard key={expense.id} expense={expense} /> // Usar el componente de gastos aquí
          ))}
        </Box>

        {/* Tabla de integrantes */}
        <Box sx={{ mt: 5 }}>
          <Typography variant="h5" gutterBottom>
            Integrantes del Proyecto
          </Typography>
          <MemberTable members={members} />{" "}
          {/* Usar el nuevo componente de tabla aquí */}
        </Box>

        {/* Modal para agregar usuario */}
        <AddUserModal
          open={openUserModal}
          onClose={handleCloseUserModal}
          onAddUser={handleAddUser}
        />

        {/* Modal para agregar gasto */}
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
