import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Typography, Container, Box, Link, InputAdornment, IconButton, Divider, Grid } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import SocialLogin from '../SocialLogin';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleToggleVisibility = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      console.log('Registration successful', response);
      alert('Registration successful');
    } catch (error) {
      console.error('Registration failed', error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#fff',
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography component="h1" variant="h5" gutterBottom>
          Register
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={formData.username}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
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
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
          <Box mt={2} display="flex" flexDirection="column" alignItems="center">
          <Grid container alignItems="center">
            <Grid item xs>
              <Divider />
            </Grid>
            <Grid item>
              <Box mx={1}>
                <Typography variant="body2" color="text.secondary">
                  Or Sign up with
                </Typography>
              </Box>
            </Grid>
            <Grid item xs>
              <Divider />
            </Grid>
          </Grid>
          <SocialLogin />
        </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" mt={2}>
            <Typography variant="body2">
              Already have an account?
            </Typography>
            <Link href="/login" variant="body2">
              Login
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
