import React from 'react';
import {  Container, Typography, Box } from '@mui/material';
import './dashboard.css'; // Estilos 
import NavBar from '../../components/navBar/navBar';

function Dashboard() {
  return (
    <div>
     <NavBar /> 
     <div>
     <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', py: 5 }}>
        <Typography variant="h2" component="h1" className="hero-title" gutterBottom>
             hola jose
            </Typography>
        </Box>
      </Container>

     </div> 
     
    </div>
  );
}

export default Dashboard;
