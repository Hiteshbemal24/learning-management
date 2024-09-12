import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import CourseList from './components/CourseList';
import CourseDetail from './components/CourseDetail';
import CreateCourse from './components/CourseForm';
import HomePage from './components/HomePage';
import ProgressPage from './components/ProgressTracker';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/courses" element={<CourseList />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/create-course" element={<CreateCourse />} />
        <Route path="/progress" element={<ProgressPage />} /> {/* Add this route */}
      </Routes>
    </Router>
  );
}

export default App;
