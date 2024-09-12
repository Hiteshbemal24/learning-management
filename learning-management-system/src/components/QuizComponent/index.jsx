import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Card, CardContent } from '@mui/material';

const QuizComponent = ({ courseId }) => {
  const [quizTitle, setQuizTitle] = useState('');
  const [quizFile, setQuizFile] = useState(null);

  const handleQuizCreation = () => {
    // Handle quiz creation logic here
    console.log(`Quiz for Course ID ${courseId}:`, quizTitle, quizFile);
    // You can use axios.post() to send the quiz data to the backend
  };

  const handleFileUpload = (event) => {
    setQuizFile(event.target.files[0]);
  };

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Create a Quiz
        </Typography>
        <Box component="form" noValidate autoComplete="off">
          <TextField
            label="Quiz Title"
            fullWidth
            variant="outlined"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            component="label"
            sx={{ mb: 2 }}
          >
            Upload Quiz File (PDF or others)
            <input type="file" hidden onChange={handleFileUpload} />
          </Button>
          <Button variant="contained" onClick={handleQuizCreation}>
            Create Quiz
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default QuizComponent;
