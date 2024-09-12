import React, { useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  IconButton,
  Chip,
  InputLabel,
  Radio,
  RadioGroup,
  FormControlLabel
} from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';

const CourseForm = ({ course = {}, isEditing = false, token }) => {
  const [title, setTitle] = useState(course?.title || '');
  const [description, setDescription] = useState(course?.description || '');
  const [lessons, setLessons] = useState(course?.lessons || []);
  const [quizzes, setQuizzes] = useState(course?.quizzes || []);
  const [categories, setCategories] = useState(course?.categories || []);
  const [tags, setTags] = useState(course?.tags || []);
  const [file, setFile] = useState(null); // For PDF upload
  const [youtubeUrl, setYoutubeUrl] = useState(course?.youtubeUrl || ''); // For video URL
  const [quizMCQs, setQuizMCQs] = useState([]); // MCQs
  const [assignments, setAssignments] = useState([]); // Assignments
  const [searchQuery, setSearchQuery] = useState(''); // Search query state

  // Handle file and URL changes
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUrlChange = (e) => {
    setYoutubeUrl(e.target.value);
  };

  // Tag and Category handlers
  const handleAddTag = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      setTags([...tags, e.target.value.trim()]);
      e.target.value = ''; // Clear the input after adding
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleAddCategory = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      setCategories([...categories, e.target.value.trim()]);
      e.target.value = ''; // Clear the input after adding
    }
  };

  const handleRemoveCategory = (categoryToRemove) => {
    setCategories(categories.filter(category => category !== categoryToRemove));
  };

  // Quiz MCQ handlers
  const handleAddMCQ = () => {
    setQuizMCQs([
      ...quizMCQs,
      { question: '', options: ['', '', '', ''], correctAnswer: '' },
    ]);
  };

  const handleMCQChange = (index, field, value) => {
    const newQuizMCQs = [...quizMCQs];
    if (field === 'question') {
      newQuizMCQs[index].question = value;
    } else {
      newQuizMCQs[index].options[field] = value;
    }
    setQuizMCQs(newQuizMCQs);
  };

  const handleMCQCorrectAnswerChange = (index, answer) => {
    const newQuizMCQs = [...quizMCQs];
    newQuizMCQs[index].correctAnswer = answer;
    setQuizMCQs(newQuizMCQs);
  };

  // Assignment handlers
  const handleAddAssignment = () => {
    setAssignments([...assignments, { name: '' }]);
  };

  const handleAssignmentChange = (index, value) => {
    const newAssignments = [...assignments];
    newAssignments[index].name = value;
    setAssignments(newAssignments);
  };

  const handleRemoveAssignment = (index) => {
    const newAssignments = assignments.filter((_, i) => i !== index);
    setAssignments(newAssignments);
  };

  const filteredQuizzes = quizMCQs.filter((mcq) =>
    mcq.question.toLowerCase().includes(searchQuery)
  );
  const filteredAssignments = assignments.filter((assignment) =>
    assignment.name.toLowerCase().includes(searchQuery)
  );
  const filteredCategories = categories.filter((category) =>
    category.toLowerCase().includes(searchQuery)
  );
  const filteredTags = tags.filter((tag) =>
    tag.toLowerCase().includes(searchQuery)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('categories', categories.join(', '));
    formData.append('tags', tags.join(', '));
    formData.append('lessons', lessons.join(', '));
    formData.append('quizzes', JSON.stringify(quizMCQs)); // Save MCQs
    formData.append('assignments', JSON.stringify(assignments)); // Save assignments
    formData.append('youtubeUrl', youtubeUrl); // YouTube URL
    if (file) {
      formData.append('file', file); // PDF file
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };

      if (isEditing) {
        await axios.put(`http://localhost:5000/api/courses/${course._id}`, formData, config);
      } else {
        await axios.post('http://localhost:5000/api/courses/create', formData, config);
      }
      alert('Course saved successfully!');
    } catch (error) {
      console.error('Error saving course:', error);
      alert(`Error: ${error.response ? error.response.data.error : 'An error occurred'}`);
    }
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: '800px', margin: '50px auto', padding: '1rem' }}>
      <Typography variant="h5" gutterBottom>
        {isEditing ? 'Update Course' : 'Create Course'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        {/* Existing form fields */}
        <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth variant="outlined" />
        <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth variant="outlined" multiline rows={4} />

        {/* File Upload for PDF */}
        <InputLabel htmlFor="file-upload">Upload PDF</InputLabel>
        <TextField type="file" onChange={handleFileChange} fullWidth variant="outlined" inputProps={{ id: 'file-upload' }} />

        {/* YouTube URL */}
        <TextField label="YouTube URL" value={youtubeUrl} onChange={handleUrlChange} fullWidth variant="outlined" />

        {/* Tags */}
        <Typography variant="h6" gutterBottom>Add Tags</Typography>
        <TextField
          label="Add a tag"
          onKeyDown={handleAddTag}
          variant="outlined"
          fullWidth
        />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {filteredTags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              onDelete={() => handleRemoveTag(tag)}
            />
          ))}
        </Box>

        {/* Categories */}
        <Typography variant="h6" gutterBottom>Add Categories</Typography>
        <TextField
          label="Add a category"
          onKeyDown={handleAddCategory}
          variant="outlined"
          fullWidth
        />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {filteredCategories.map((category, index) => (
            <Chip
              key={index}
              label={category}
              onDelete={() => handleRemoveCategory(category)}
            />
          ))}
        </Box>

        {/* Add MCQs */}
        <Typography variant="h6" gutterBottom>Add Quiz Questions</Typography>
        {filteredQuizzes.map((mcq, index) => (
          <Box key={index} sx={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}>
            <TextField
              label={`Question ${index + 1}`}
              value={mcq.question}
              onChange={(e) => handleMCQChange(index, 'question', e.target.value)}
              fullWidth
              variant="outlined"
              margin="normal"
            />
            <Typography variant="body1">Options:</Typography>
            {mcq.options.map((option, optIndex) => (
              <TextField
                key={optIndex}
                label={`Option ${optIndex + 1}`}
                value={option}
                onChange={(e) => handleMCQChange(index, optIndex, e.target.value)}
                fullWidth
                variant="outlined"
                margin="normal"
              />
            ))}
            <RadioGroup
              value={mcq.correctAnswer}
              onChange={(e) => handleMCQCorrectAnswerChange(index, e.target.value)}
            >
              {mcq.options.map((option, optIndex) => (
                <FormControlLabel
                  key={optIndex}
                  value={option}
                  control={<Radio />}

                  label={`Correct Answer: Option ${optIndex + 1}`}
                />
              ))}
            </RadioGroup>
          </Box>
        ))}
        <Button variant="outlined" onClick={handleAddMCQ}>
          Add MCQ
        </Button>

        {/* Add Assignments */}
        <Typography variant="h6" gutterBottom>Add Assignments</Typography>
        {filteredAssignments.map((assignment, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <TextField
              label={`Assignment ${index + 1}`}
              value={assignment.name}
              onChange={(e) => handleAssignmentChange(index, e.target.value)}
              variant="outlined"
              fullWidth
            />
            <IconButton onClick={() => handleRemoveAssignment(index)}>
              <RemoveCircleOutline />
            </IconButton>
          </Box>
        ))}
        <Button variant="outlined" onClick={handleAddAssignment}>
          Add Assignment
        </Button>

        <Button type="submit" variant="contained" color="primary" fullWidth>
          {isEditing ? 'Update Course' : 'Create Course'}
        </Button>
      </Box>
    </Paper>
  );
};

export default CourseForm;
