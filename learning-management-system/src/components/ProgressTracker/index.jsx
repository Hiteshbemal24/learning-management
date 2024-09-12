import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, List, ListItem, Button, Box } from '@mui/material';

const ProgressTracker = ({ courseId }) => {
  const [progress, setProgress] = useState({});
  const [videoTime, setVideoTime] = useState({});

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await axios.get(`/api/courses/progress/${courseId}`);
        setProgress(response.data);
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    };

    fetchProgress();
  }, [courseId]);

  const handleMarkComplete = async (itemType, itemId) => {
    try {
      await axios.post(`/api/courses/progress/${courseId}/complete`, { itemType, itemId });
      setProgress((prevProgress) => ({
        ...prevProgress,
        [itemType]: [...prevProgress[itemType], itemId],
      }));
    } catch (error) {
      console.error('Error marking item as complete:', error);
    }
  };

  const handleVideoProgress = async (videoId, timeWatched) => {
    try {
      await axios.post(`/api/courses/${courseId}/video-progress`, { videoId, timeWatched });
      setVideoTime((prevTime) => ({
        ...prevTime,
        [videoId]: timeWatched,
      }));
    } catch (error) {
      console.error('Error updating video progress:', error);
    }
  };

  return (
    <Box mt={4}>
      <Typography variant="h4" component="h2" gutterBottom>
        Your Progress
      </Typography>
      <Box mb={3}>
        <Typography variant="h5" component="h3" gutterBottom>
          Lessons
        </Typography>
        <List>
          {progress.lessons?.map((lesson, index) => (
            <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body1">{lesson.title}</Typography>
              <Button
                variant="text"
                color={progress.completedLessons.includes(lesson._id) ? 'success' : 'primary'}
                onClick={() => handleMarkComplete('lessons', lesson._id)}
              >
                {progress.completedLessons.includes(lesson._id) ? 'Completed' : 'Mark as Complete'}
              </Button>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Add similar sections for quizzes and assignments */}

      {/* Video Progress */}
      <Box mb={3}>
        <Typography variant="h5" component="h3" gutterBottom>
          Videos
        </Typography>
        <List>
          {progress.videoProgress && Object.keys(progress.videoProgress).map((videoId, index) => (
            <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body1">Video {videoId}</Typography>
              <Button
                variant="text"
                color="primary"
                onClick={() => handleVideoProgress(videoId, videoTime[videoId] || 0)}
              >
                Update Progress
              </Button>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default ProgressTracker;
