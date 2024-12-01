import React, { useState, useEffect, useCallback } from "react";
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
  CloudUpload as UploadIcon,
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
  const [totalAmount, setTotalAmount] = useState(0);
  const [amountPerMember, setAmountPerMember] = useState(0);
  const token = localStorage.getItem("token");

  // Función para obtener datos del proyecto
  const fetchProjectData = useCallback(async () => {
    try {
      if (!token) {
        alert("No se encontró el token de autenticación.");
        return;
      }

      // Llamada a la API para obtener los tickets y el proyecto
      const response = await fetch(`http://localhost:8080/api/ticket/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 404) {
        const errorData = await response.json();

        // Verificar si el mensaje es "No se encontraron tickets para este proyecto."
        if (
          errorData.message === "No se encontraron tickets para este proyecto."
        ) {
          setProject(null);
          setExpenses([]);
          setMembers([]);
          return;
        } else {
          throw new Error(`Error inesperado: ${errorData.message}`);
        }
      }

      if (!response.ok) {
        throw new Error(`Error al obtener datos: ${response.statusText}`);
      }

      const tickets = await response.json();

      if (tickets.length > 0) {
        // Extraer información del proyecto desde el primer ticket
        const { Proyecto } = tickets[0];

        setProject({
          id: Proyecto.id,
          title: Proyecto.titulo,
          description: Proyecto.descripcion,
        });

        // Formatear los gastos
        const projectExpenses = tickets.map((ticket) => ({
          id: ticket.id,
          concept:
            ticket.concepto ||
            `Gasto del ${new Date(ticket.fecha).toLocaleDateString()}`,
          amount: ticket.monto,
          fileName: ticket.archivoNombre,
        }));
        setExpenses(projectExpenses);

        // Formatear los miembros del proyecto
        const projectMembers = Proyecto.Usuarios.map((user) => ({
          id: user.id,
          name: user.email,
        }));
        setMembers(projectMembers);

        const countTotalAmount = projectExpenses.reduce(
          (acc, expense) => acc + expense.amount,
          0
        );
        setTotalAmount(countTotalAmount);
        const countAmountPerMember =
          projectMembers.length > 0
            ? countTotalAmount / projectMembers.length
            : 0;
        setAmountPerMember(countAmountPerMember);
      }
    } catch (err) {
      alert(err.message);
    }
  }, [id, token]);

  // Llamada inicial para cargar los datos al montar el componente
  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);

  const downloadExcel = () => {
    const filteredExpenses = expenses.map(({ id, concept, amount }) => ({
      id,
      concepto: concept,
      monto: amount,
    }));
    const worksheet = XLSX.utils.json_to_sheet(filteredExpenses);
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

  const handleOpenDetailModal = (expense) => {
    setSelectedExpense(expense);
    setOpenDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setOpenDetailModal(false);
    setSelectedExpense(null);
  };

  const handleAddUser = async (email) => {
    try {
      // Llamada a la API para validar si el usuario existe
      const validateUserResponse = await fetch(
        "http://localhost:8080/api/user/existe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Asegúrate de tener el token disponible
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!validateUserResponse.ok) {
        throw new Error("Error al validar el usuario.");
      }

      const validationResult = await validateUserResponse.text();

      if (validationResult.replace(/^"|"$/g, "") === "existe") {
        // Si el usuario existe, asignarlo al proyecto
        //all user
        const allUserResponse = await fetch("http://localhost:8080/api/user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!allUserResponse.ok) {
          throw new Error("Error al obtener users.");
        }

        const allUser = await allUserResponse.json();
        const user = allUser.find((user) => user.email === email);

        const assignUserResponse = await fetch(
          `http://localhost:8080/api/project/${user.id}/assign`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ projectId: id }),
          }
        );

        if (!assignUserResponse.ok) {
          throw new Error("Error al asignar el usuario al proyecto.");
        }

        alert("Usuario asignado exitosamente al proyecto.");
      } else if (validationResult.replace(/^"|"$/g, "") === "no existe") {
        // Si el usuario no existe, enviar notificación
        // Validar el token
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
        const inviterEmail = validateTokenData.user.email;

        const notifyUserResponse = await fetch(
          "http://localhost:8080/api/notify",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              recipientEmail: email,
              recipientName: "Invitado",
              inviterName: inviterEmail,
              projectName: "Administrando",
              message: "Queremos que te unas para colaborar en este proyecto.",
              invitationLink: "http://localhost:3000/registro",
            }),
          }
        );

        if (!notifyUserResponse.ok) {
          throw new Error("Error al enviar la invitación.");
        }

        alert("Invitación enviada exitosamente.");
      } else {
        throw new Error("Respuesta inesperada al validar el usuario.");
      }

      await fetchProjectData();
      handleCloseUserModal();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleAddExpense = async (newExpense) => {
    try {
      // Validar el token
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

      // Construir el objeto del ticket a enviar
      const updatedTickets = {
        monto: newExpense.amount,
        concepto: newExpense.concept,
        fecha: new Date().toISOString().split("T")[0],
        archivoNombre: newExpense.fileName || "archivo.pdf",
        archivoData: newExpense.fileData || "",
        userIds: [userId],
      };

      // Llamada a la API para crear el ticket
      const response = await fetch(`http://localhost:8080/api/ticket/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTickets),
      });

      if (!response.ok) {
        throw new Error("Error al crear el ticket.");
      }

      await fetchProjectData();

      const amountUpdate = totalAmount + newExpense.amount;
      const projectUpdateResponse = await fetch(
        `http://localhost:8080/api/project/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ montoTotal: amountUpdate }),
        }
      );

      if (!projectUpdateResponse.ok) {
        throw new Error("Error al actualizar el monto del proyecto.");
      }

      handleCloseExpenseModal();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteExpense = async (expense) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/ticket/${expense.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar el ticket.");
      }
      await fetchProjectData();

      const montoUpdate = totalAmount - expense.amount;
      const projectUpdateResponse = await fetch(
        `http://localhost:8080/api/project/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ montoTotal: montoUpdate }),
        }
      );

      if (!projectUpdateResponse.ok) {
        throw new Error("Error al actualizar el monto del proyecto.");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleUploadTicket = async (expense, file) => {
    if (!file) {
      console.error("No se seleccionó ningún archivo.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `http://localhost:8080/api/ticket/${expense.id}/file`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Error al subir el ticket.");
      }

      const data = await response.json();
      console.log("Ticket actualizado:", data);
    } catch (error) {
      console.error("Error al subir el ticket:", error.message);
    }
  };

  return (
    <div>
      <NavBar />
      <Box
        sx={{
          background: "linear-gradient(to bottom, #6a11cb, #2575fc)",
          minHeight: "100vh",
          py: 5,
        }}
      >
        <Container maxWidth="lg">
          <IconButton
            onClick={() => navigate("/dashboard")}
            sx={{ color: "#fff" }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ color: "#fff", fontWeight: "bold" }}
          >
            Detalle del Proyecto: {project?.titulo}
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Tooltip title="Agregar Usuario">
              <IconButton sx={{ color: "#fff" }} onClick={handleOpenUserModal}>
                <AddReactionIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Descargar Gastos como Excel">
              <IconButton sx={{ color: "#fff" }} onClick={downloadExcel}>
                <AttachFileIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Agregar Gasto">
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  sx={{ color: "#fff" }}
                  onClick={handleOpenExpenseModal}
                >
                  <MonetizationOnIcon />
                </IconButton>
                <Typography variant="body1" sx={{ ml: 1, color: "#fff" }}>
                  Agregar
                </Typography>
              </Box>
            </Tooltip>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h5" sx={{ color: "#fff", fontWeight: "bold" }}>
              Gastos
            </Typography>
            {expenses.map((expense) => (
              <Box key={expense.id} sx={{ mb: 2 }}>
                <ExpenseCard expense={expense} />
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Tooltip title="Ver Detalles del Gasto">
                    <IconButton
                      sx={{ color: "#fff" }}
                      onClick={() => handleOpenDetailModal(expense)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar Gasto">
                    <IconButton
                      sx={{ color: "#ff1744" }}
                      onClick={() => handleDeleteExpense(expense)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Subir Ticket">
                    <IconButton sx={{ color: "#fff" }} component="label">
                      <UploadIcon />
                      <input
                        type="file"
                        hidden
                        onChange={(e) =>
                          handleUploadTicket(expense, e.target.files[0])
                        }
                      />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            ))}

            <Typography
              variant="h6"
              sx={{ mt: 3, fontWeight: "bold", color: "#fff" }}
            >
              Total Acumulado: ${totalAmount.toFixed(2)}
            </Typography>

            <Typography
              variant="h6"
              sx={{ mt: 2, fontWeight: "bold", color: "#fff" }}
            >
              Total por persona: ${amountPerMember.toFixed(2)}
            </Typography>
          </Box>

          <Box sx={{ mt: 5 }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ color: "#fff", fontWeight: "bold" }}
            >
              Integrantes del Proyecto
            </Typography>
            <Grid container spacing={2}>
              {members.map((member, index) => {
                return (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card
                      sx={{
                        backgroundColor: "#ffffffdd",
                        borderRadius: 4,
                        boxShadow: 3,
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                          {member.name}
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
              <Typography
                id="expense-detail-title"
                variant="h6"
                component="h2"
                sx={{ fontWeight: "bold" }}
              >
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
