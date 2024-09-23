import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const googleToken = localStorage.getItem('googleToken');
    const facebookToken = localStorage.getItem('facebookToken'); 
    if (token || googleToken || facebookToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false); 
    }
  }, []); 
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsLoggedIn(false); 
    navigate('/login'); 
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" color="inherit">
            Learning Management System
          </Typography>
          <div>
            <Button color="inherit" component={Link} to="/">About</Button>
            <Button color="inherit" component={Link} to="/courses">Courses</Button>
            <Button color="inherit" component={Link} to="/create-course">Create Course</Button>
            {isLoggedIn ? (
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            ) : (
              <Button color="inherit" component={Link} to="/login">Login</Button>
            )}
          </div>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
