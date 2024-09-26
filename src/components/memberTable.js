// MemberTable.js
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from '@mui/material';

const MemberTable = ({ members }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="h6">Nombre</Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant="h6">Monto que debe</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {members.map((member, index) => (
            <TableRow key={index}>
              <TableCell>{member.name}</TableCell>
              <TableCell align="right">${member.amountOwed}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MemberTable;
