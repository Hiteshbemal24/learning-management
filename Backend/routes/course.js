const express = require('express');
const multer = require('multer');
const path = require('path');
const Course = require('../models/Course');
const auth = require('../middleware/auth');

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

module.exports = router;
