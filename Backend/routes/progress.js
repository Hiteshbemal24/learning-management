const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth'); 

const router = express.Router();

// Get user's progress for a specific course
router.get('/:courseId', async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const progress = user.progress.get(courseId)?.videoProgress || {};
    res.json({ progress });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update video progress for a course
router.post('/:courseId/video-progress', async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;
    const { videoId, timeWatched } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.progress.has(courseId)) {
      user.progress.set(courseId, { videoProgress: new Map() });
    }

    user.progress.get(courseId).videoProgress.set(videoId, timeWatched);
    await user.save();

    res.status(200).json({ message: 'Video progress updated' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
