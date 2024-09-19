import React, { useState } from 'react';
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
  Paper
} from '@mui/material';
import { Visibility } from '@mui/icons-material'; // Ícono de ojo para ver el detalle
import { saveAs } from 'file-saver'; // Para descargar el archivo Excel
import * as XLSX from 'xlsx'; // Librería para generar el Excel

function DetalleProyecto() {
  // Lista pre-cargada de gastos
  const [expenses] = useState([
    { id: 1, concept: 'Compra material', amount: 500 },
    { id: 2, concept: 'Alquiler de local', amount: 1200 },
    { id: 3, concept: 'Publicidad', amount: 300 },
  ]);

  // Lista pre-cargada de integrantes y cuánto debe cada uno
  const [members] = useState([
    { name: 'José', amountOwed: 600 },
    { name: 'María', amountOwed: 900 },
    { name: 'Carlos', amountOwed: 500 },
  ]);

  // Función para descargar el archivo Excel
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(expenses);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Gastos');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'gastos-proyecto.xlsx');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      {/* Título del Proyecto */}
      <Typography variant="h4" gutterBottom>
        Detalle del Proyecto
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

      {/* Botón para descargar el archivo Excel */}
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Button variant="contained" color="primary" onClick={downloadExcel}>
          Descargar Excel de Gastos
        </Button>
      </Box>
    </Container>
  );
}

export default DetalleProyecto;
