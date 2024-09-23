import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Paper, Link, CircularProgress, IconButton, InputAdornment, Box, Grid, Divider, Grid2 } from '@mui/material';

import { Visibility, VisibilityOff } from '@mui/icons-material';
import SocialLogin from '../SocialLogin';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const handleToggleVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { token, userId } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      setLoading(false);
      navigate('/courses');
      window.location.reload(); 
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <Container
      maxWidth="xs"
      style={{ display: "flex", alignItems: "center", height: "100vh" }}
    >
      <Paper elevation={3} style={{ padding: "2rem", width: "100%" }}>
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
            disabled={loading}
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            margin="normal"
            variant="outlined"
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleToggleVisibility}>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: "1rem" }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Log In"
            )}
          </Button>
        </form>
        <Box mt={4} display="flex" flexDirection="column" alignItems="center">
          <Grid container alignItems="center">
            <Grid item xs>
              <Divider />
            </Grid>
            <Grid item>
              <Box mx={1}>
                <Typography variant="body2" color="text.secondary">
                  Or Sign in with
                </Typography>
              </Box>
            </Grid>
            <Grid item xs>
              <Divider />
            </Grid>
          </Grid>
          <SocialLogin />
        </Box>

        <Typography align="center" style={{ marginTop: "1rem" }}>
          Don't have an account?{" "}
          <Link href="/register" color="primary">
            Sign up
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;
