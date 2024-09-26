// AddUserModal.js
import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Snackbar, Alert } from '@mui/material';

const AddUserModal = ({ open, onClose, onAddUser }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

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

    onAddUser(email);
    setSnackbarMessage('Usuario agregado al proyecto');
    setSnackbarOpen(true);
    handleClose();
  };

  const handleClose = () => {
    setEmail('');
    setEmailError('');
    onClose();
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ p: 4, backgroundColor: 'white', maxWidth: 400, mx: 'auto', mt: 10 }}>
          <Typography variant="h6">Agregar Usuario</Typography>
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            error={!!emailError}
            helperText={emailError}
          />
          <Button variant="contained" color="primary" onClick={handleAddUser} sx={{ mt: 2 }}>
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

export default AddUserModal;
