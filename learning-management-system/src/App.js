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
import PrivateRoute from './components/PrivateRoute';
import PaymentSuccess from './components/PaymentSuccess';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/courses" element={<CourseList />} />
        <Route
          path="/courses/:id"
          element={
            <PrivateRoute>
              <CourseDetail />
            </PrivateRoute>
          }
        />
        <Route path="/create-course"
         element={
            <PrivateRoute>
              <CreateCourse />
            </PrivateRoute>
          }
         />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/success" element={<PaymentSuccess />} />
      </Routes>
    </Router>
  );
}

export default App;
