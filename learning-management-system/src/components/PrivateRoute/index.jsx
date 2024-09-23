import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // Get tokens from localStorage
  const token = localStorage.getItem('token');
  const googleToken = localStorage.getItem('googleToken');
  const facebookToken = localStorage.getItem('facebookToken');

  // Check if any token exists
  const isAuthenticated = token || googleToken || facebookToken;

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
