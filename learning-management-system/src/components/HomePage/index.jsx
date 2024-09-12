import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const HomePage = () => {
  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to LMS
        </Typography>
        <Typography marginTop={10} variant="body1">
          LMS (Learning Management System) is a platform designed to help you
          manage and organize your learning materials and courses. Whether
          you're a student looking to enhance your knowledge or an instructor
          creating engaging content, LMS provides the tools you need to succeed.
          Explore our courses, stay updated with the latest information, and
          take control of your learning journey.
        </Typography>
      </Box>
    </Container>
  );
};

export default HomePage;
