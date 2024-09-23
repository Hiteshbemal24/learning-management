import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography } from '@mui/material';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/courses'); 
    }, 2000);

    return () => clearTimeout(timer); 
  }, [navigate]);

  return (
    <Container sx={{ py: 8, textAlign: 'center' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Payment Successful!
      </Typography>
      <Typography variant="body1">
        Thank you for your purchase. You will be redirected to the courses page shortly.
      </Typography>
    </Container>
  );
};

export default PaymentSuccess;
