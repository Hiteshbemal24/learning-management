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
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [user, setUser] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/courses/courses/${id}`);
        setCourse(response.data);

        // Fetch the saved progress for the current user
        const progressResponse = await axios.get(`http://localhost:5000/api/progress/${id}`);
        const savedProgress = progressResponse.data?.timeWatched || 0;
        setVideoTime(savedProgress); // Set video to the saved time
      } catch (error) {
        console.error('Error fetching course details or progress:', error);
      }
    };

    fetchCourseDetail();
  }, [id]);
  useEffect(() => {
    // Retrieve the saved user from localStorage
    const savedUser = JSON.parse(localStorage.getItem('user'));
    const accessToken = localStorage.getItem('accessToken');

    if (savedUser && accessToken) {
        setUser(savedUser);  // Set the user state
    } else {
        // Redirect to login page if no user is found
        window.location.href = '/login';
    }
}, []);

  // Function to extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})|(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+v=|watch\/|playlist\?list=|shorts\/)?([a-zA-Z0-9_-]{11})/;
    const matches = url.match(regex);
    return matches ? (matches[1] || matches[2]) : null;
  };

  const handleVideoLoad = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);

      // Set the video time to the previously saved progress
      videoRef.current.currentTime = videoTime;
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      setVideoTime(currentTime);
      setProgressPercentage((currentTime / videoRef.current.duration) * 100);
    }
  };

  const saveProgress = async () => {
    if (videoRef.current) {
      try {
        await axios.post(`http://localhost:5000/api/progress/${id}/video-progress`, {
          videoId: course._id,
          timeWatched: videoTime,
        });
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    }
  };

  const handleVideoPause = () => {
    saveProgress();
  };

  if (!course) {
    return (
      <Container>
        <Typography variant="h5">Loading...</Typography>
      </Container>
    );
  }

  const videoId = course.youtubeUrl ? getYouTubeVideoId(course.youtubeUrl) : null;

  return (
    <Container sx={{ py: 8, display: "flex" }}>
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
            onTimeUpdate={handleTimeUpdate}
            onPause={handleVideoPause}
          ></iframe>
        )}

        {course.file && (
          <Button
            component="a"
            href={`http://localhost:5000/uploads/${course.file}`}
            target="_blank"
            rel="noopener noreferrer"
            download
          >
            View File
          </Button>
        )}

        {/* Quiz display */}
        <Typography variant="h6" component="h2" gutterBottom>
          Quiz
        </Typography>
        {course.quizzes && course.quizzes.length > 0 && <Quiz quizzes={course.quizzes} />}

        {/* Assignment display */}
        <Typography variant="h6" component="h2" gutterBottom>
          Assignments
        </Typography>
        {course.assignments && course.assignments.length > 0 ? (
          course.assignments.map((assignment, index) => (
            <Typography key={index} variant="body1" paragraph>
              {`Assignment ${index + 1}: ${assignment.name || "Not available"}`}
            </Typography>
          ))
        ) : (
          <Typography>No assignments available</Typography>
        )}
      </Box>

      <Box sx={{ width: "300px", ml: 4 }}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Progress</Typography>
          <Box sx={{ width: "100%", mb: 2 }}>
            <LinearProgress variant="determinate" value={progressPercentage} />
          </Box>
          <Typography variant="h4">{progressPercentage.toFixed(2)}%</Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default CourseDetail;
