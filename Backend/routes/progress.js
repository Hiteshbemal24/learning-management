const express = require('express');
const User = require('../models/User');
const Course = require('../models/Course');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user progress for a course
router.get('/:courseId', async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const progress = user.progress.get(courseId) || { completedLessons: [], completedQuizzes: [], completedAssignments: [] };
    res.json(progress);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Mark an item as complete
router.post('/:courseId/complete', async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;
    const { itemType, itemId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.progress.has(courseId)) {
      user.progress.set(courseId, { completedLessons: [], completedQuizzes: [], completedAssignments: [] });
    }

    user.progress.get(courseId)[`completed${itemType.charAt(0).toUpperCase() + itemType.slice(1)}`].push(itemId);
    await user.save();

    res.status(200).json({ message: 'Item marked as complete' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.post('/:courseId/video-progress', async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;
    const { videoId, timeWatched } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.progress.has(courseId)) {
      user.progress.set(courseId, {
        
        videoProgress: {},
      });
    }

    user.progress.get(courseId).videoProgress.set(videoId, timeWatched);
    await user.save();

    res.status(200).json({ message: 'Video progress updated' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
