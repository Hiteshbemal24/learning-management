import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
} from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51PeEYoRvKc9EVsnEtcuUBVKe7jqb0oXrymfjuCZLQfUvjj633bfudCTPGDTIz03FURjjZag73KpeHG4AouYUDM7q00vVf5q9n8'); 

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/courses');
        setCourses(response.data);

        const uniqueCategories = [...new Set(response.data.flatMap((course) => course.categories))];
        const uniqueTags = [...new Set(response.data.flatMap((course) => course.tags))];
        setCategories(uniqueCategories);
        setTags(uniqueTags);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  const handleBuyNow = async (courseId) => {
    const stripe = await stripePromise;
    try {
      const response = await axios.post('http://localhost:5000/api/courses/checkout', { courseId });

      const sessionId = response.data.sessionId;

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error('Error redirecting to Stripe:', error);
      }
    } catch (error) {
      console.error('Error creating Stripe checkout session:', error);
    }
  };

  const filteredCourses = courses.filter(
    (course) =>
      (selectedCategory === '' || course.categories.includes(selectedCategory)) &&
      (selectedTag === '' || course.tags.includes(selectedTag)) &&
      (course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Available Courses
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        label="Search Courses"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 4 }}
      />

      <FormControl fullWidth variant="outlined" sx={{ mb: 4 }}>
        <InputLabel>Filter by Category</InputLabel>
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          label="Filter by Category"
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((category, index) => (
            <MenuItem key={index} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth variant="outlined" sx={{ mb: 4 }}>
        <InputLabel>Filter by Tag</InputLabel>
        <Select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          label="Filter by Tag"
        >
          <MenuItem value="">All Tags</MenuItem>
          {tags.map((tag, index) => (
            <MenuItem key={index} value={tag}>
              {tag}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Grid container spacing={4}>
        {filteredCourses.map((course) => (
          <Grid item key={course._id} xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  {course.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {course.description}
                </Typography>
                <Button
                  component={Link}
                  to={`/courses/${course._id}`}
                  color="primary"
                  style={{ marginRight: "8px" }}
                >
                  View Course
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleBuyNow(course._id)}
                  style={{ marginLeft: "50px" }}
                >
                  Buy Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CourseList;
