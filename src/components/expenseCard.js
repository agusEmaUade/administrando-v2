// ExpenseCard.js
import React from 'react';
import { Card, CardContent, Typography, IconButton } from '@mui/material';

const ExpenseCard = ({ expense }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Typography variant="h6">{expense.concept}</Typography>
          <Typography variant="body2" color="text.secondary">
            Monto: ${expense.amount}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseCard;
