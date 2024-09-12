import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');

  };
  return (
    <AppBar position="static">
      <Toolbar>
        <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography left={0} variant="h6" color="inherit">
            Learning Management System
          </Typography>
          <div>
            <Button color="inherit" component={Link} to="/">About</Button>
            <Button color="inherit" component={Link} to="/courses">Courses</Button>
            <Button color="inherit" component={Link} to="/create-course">Create Course</Button>
            <Button color="inherit" component={Link} to="/progress">Progress</Button>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </div>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
