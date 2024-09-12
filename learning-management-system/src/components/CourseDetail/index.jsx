import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Button, Box, Paper, LinearProgress } from '@mui/material';
import Quiz from '../Quiz';

const CourseDetail = () => {
  const { id } = useParams(); // Get the course ID from the URL
  const [course, setCourse] = useState(null);
  const [videoTime, setVideoTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/courses/courses/${id}`);
        setCourse(response.data);
      } catch (error) {
        console.error('Error fetching course details:', error);
      }
    };

    fetchCourseDetail();
  }, [id]);

  // useEffect(() => {
  //   const handleVideoProgress = () => {
  //     if (videoRef.current) {
  //       const timeWatched = videoRef.current.currentTime;
  //       setVideoTime(timeWatched);
  //       try {
  //         const token = localStorage.getItem('token');
  //         console.log('Retrieved Token:', token);
  //         axios.post(`http://localhost:5000/api/courses/${id}/video-progress`, {
  //           videoId: course.youtubeUrl,
  //           timeWatched,
  //         }, {
  //           headers: {
  //             Authorization: `Bearer ${token}`, // Ensure token is included here
  //           }
  //         });
  //       } catch (error) {
  //         console.error('Error updating video progress:', error);
  //       }
  //     }
  //   };

  //   const intervalId = setInterval(handleVideoProgress, 10000); // Save progress every 10 seconds

  //   return () => clearInterval(intervalId);
  // }, [course, id]);

  // Function to extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})|(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+v=|watch\/|playlist\?list=|shorts\/)?([a-zA-Z0-9_-]{11})/;
    const matches = url.match(regex);
    return matches ? (matches[1] || matches[2]) : null;
  };

  const handleVideoLoad = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
    }
  };

  if (!course) {
    return (
      <Container>
        <Typography variant="h5">Loading...</Typography>
      </Container>
    );
  }

  const videoId = course.youtubeUrl ? getYouTubeVideoId(course.youtubeUrl) : null;

  // Calculate the progress percentage
  const progressPercentage = videoDuration > 0 ? (videoTime / videoDuration) * 100 : 0;

  return (
    <Container sx={{ py: 8, display: 'flex' }}>
      <Box sx={{ flex: 1 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {course.title}
        </Typography>

        <Typography variant="body1" paragraph>
          {course.description}
        </Typography>

        {videoId && (
          <iframe
            ref={videoRef}
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={handleVideoLoad}
          ></iframe>
        )}

        {/* Quiz display */}
        <Typography variant="h6" component="h2" gutterBottom>
          Quiz
        </Typography>
        {course.quizzes && course.quizzes.length > 0 && (
          <Quiz quizzes={course.quizzes} />
        )}

        {course.file && (
          <Button href={course.file} target="_blank" rel="noopener noreferrer">
            Download File
          </Button>
        )}
      </Box>

      <Box sx={{ width: '300px', ml: 4 }}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h6">Progress</Typography>
          <Box sx={{ width: '100%', mb: 2 }}>
            <LinearProgress variant="determinate" value={progressPercentage} />
          </Box>
          <Typography variant="h4">{progressPercentage.toFixed(2)}%</Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default CourseDetail;
