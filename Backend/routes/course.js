const express = require('express');
const multer = require('multer');
const path = require('path');
const Course = require('../models/Course');
const auth = require('../middleware/auth');
const stripe = require('stripe')('sk_test_51PeEYoRvKc9EVsnEbrOevTJJOyHthQnoyedPZjDwrk178PEq45pukhOoX1MP0ERP83PJ6T2PnWzeZVUvm3V27jJn00BNu6O3w8');

const router = express.Router();

// storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// Create a new course
router.post('/create', upload.single('file'), async (req, res) => {
  const { title, description, lessons, quizzes, assignments, categories, tags, youtubeUrl } = req.body;
  const file = req.file ? req.file.filename : null;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and Description are required' });
  }

  try {
    const newCourse = new Course({
      title,
      description,
      lessons: lessons ? lessons.split(', ') : [],
      quizzes: quizzes ? JSON.parse(quizzes) : [],
      assignments: assignments ? JSON.parse(assignments) : [],
      categories: categories ? categories.split(', ') : [],
      tags: tags ? tags.split(', ') : [],
      file,
      youtubeUrl
    });

    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error(error);
  }
});

// Update a course
router.put('/:id', auth, upload.single('file'), async (req, res) => {
  const { title, description, lessons, quizzes, assignments, categories, tags, youtubeUrl } = req.body;
  const file = req.file ? req.file.filename : null;

  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.title = title || course.title;
    course.description = description || course.description;
    course.lessons = lessons ? lessons.split(', ') : course.lessons;
    course.quizzes = quizzes ? JSON.parse(quizzes) : course.quizzes;
    course.assignments = assignments ? JSON.parse(assignments) : course.assignments;
    course.categories = categories ? categories.split(', ') : course.categories;
    course.tags = tags ? tags.split(', ') : course.tags;
    course.youtubeUrl = youtubeUrl || course.youtubeUrl;
    if (file) course.file = file;

    await course.save();
    res.status(200).json(course);
    console.log("Course updated successfully");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all courses
router.get('/', async (req, res) => {
  try {
    const query = req.query;
    const courses = await Course.find(query);
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' });
    console.error(error);
  }
});

// Get a specific course
router.get('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch course' });
    console.error(error);
  }
});

router.post('/checkout', async (req, res) => {
  const { courseId } = req.body;


  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: 'Course Name', // Replace with the course title
            },
            unit_amount: 5000, // Replace with the price in cents (e.g., $10.00)
          },
          quantity: 1,
        },
      ],
      success_url: 'http://localhost:3000/success', // Redirect after successful payment
      cancel_url: 'http://localhost:3000/cancel',  // Redirect after cancelled payment
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
