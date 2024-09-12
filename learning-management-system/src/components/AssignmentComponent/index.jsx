import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Card, CardContent } from '@mui/material';

const AssignmentComponent = ({ courseId }) => {
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentFile, setAssignmentFile] = useState(null);

  const handleAssignmentCreation = () => {
    // Handle assignment creation logic here
    console.log(`Assignment for Course ID ${courseId}:`, assignmentTitle, assignmentFile);
    // You can use axios.post() to send the assignment data to the backend
  };

  const handleFileUpload = (event) => {
    setAssignmentFile(event.target.files[0]);
  };

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Create an Assignment
        </Typography>
        <Box component="form" noValidate autoComplete="off">
          <TextField
            label="Assignment Title"
            fullWidth
            variant="outlined"
            value={assignmentTitle}
            onChange={(e) => setAssignmentTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            component="label"
            sx={{ mb: 2 }}
          >
            Upload Assignment File (PDF or others)
            <input type="file" hidden onChange={handleFileUpload} />
          </Button>
          <Button variant="contained" onClick={handleAssignmentCreation}>
            Create Assignment
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AssignmentComponent;
