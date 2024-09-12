import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Grid, Paper, Link } from '@mui/material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { token, userId } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      navigate('/courses'); 
      alert('Login successful');
    } catch (err) {
      setError(err.response.data.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <Container maxWidth="xs" style={{ display: 'flex', alignItems: 'center', height: '100vh' }}>
      <Paper elevation={3} style={{ padding: '2rem', width: '100%' }}>
        <Typography variant="h4" component="h2" gutterBottom align="center">
          Login
        </Typography>
        
        {error && (
          <Typography color="error" align="center" gutterBottom>
            {error}
          </Typography>
        )}
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            margin="normal"
            variant="outlined"
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            margin="normal"
            variant="outlined"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: '1rem' }}
          >
            Log In
          </Button>
        </form>


        <Typography align="center" style={{ marginTop: '1rem' }}>
          Don't have an account?{' '}
          <Link href="/register" color="primary">
            Sign up
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;
