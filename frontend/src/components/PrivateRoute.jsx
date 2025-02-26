import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const PrivateRoute = ({ children }) => {
  const location = useLocation(); 
  const { user, loading } = useContext(AuthContext); // 🆕 Access loading state

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress /> {/* 🌀 Show loading spinner while checking auth */}
      </Box>
    );
  }

  return user ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
