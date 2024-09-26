// AddExpenseModal.js
import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Snackbar, Alert } from '@mui/material';

const AddExpenseModal = ({ open, onClose, onAddExpense }) => {
  const [concept, setConcept] = useState('');
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleAddExpense = () => {
    if (!concept || !amount) {
      if (!amount) setAmountError('El monto es requerido');
      return;
    }

    const newExpense = { concept, amount: parseFloat(amount) };
    onAddExpense(newExpense);
    setSnackbarMessage('Gasto agregado');
    setSnackbarOpen(true);
    handleClose();
  };

  const handleClose = () => {
    setConcept('');
    setAmount('');
    setAmountError('');
    onClose();
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ p: 4, backgroundColor: 'white', maxWidth: 400, mx: 'auto', mt: 10 }}>
          <Typography variant="h6">Agregar Gasto</Typography>
          <TextField
            label="Concepto"
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Monto"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              if (e.target.value) setAmountError('');
            }}
            fullWidth
            type="number"
            error={!!amountError}
            helperText={amountError}
            sx={{ mt: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleAddExpense} sx={{ mt: 2 }}>
            Agregar
          </Button>
        </Box>
      </Modal>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddExpenseModal;
