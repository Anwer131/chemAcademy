import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { keyframes } from '@emotion/react';
import logo from '../assets/logo.png'; // Replace with your logo path

// Logo pulsing animation
const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

// Text typing animation
const typing = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

// Blinking cursor animation
const blink = keyframes`
  from, to { border-color: transparent; }
  50% { border-color: white; }
`;

const LoaderPage = ({content}) => {
  return (
    <Box
      sx={{
        height: '100vh',
        width: '100%',
        bgcolor: 'linear-gradient(135deg, #1e1e1e, #3e3e3e)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Pulsing Logo */}
      <Box
        component="img"
        src={logo}
        alt="Logo"
        sx={{
          width: { xs: 100, sm: 150 },
          height: 'auto',
          mb: 4,
          animation: `${pulse} 2s infinite`,
        }}
      />

      {/* Animated Typing Text */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          width: '15ch',
          animation: `${typing} 3s steps(15) infinite alternate, ${blink} 0.75s step-end infinite`,
          borderRight: '2px solid',
          fontSize: { xs: '1.2rem', sm: '1.5rem' },
        }}
      >
        Loading {content} ...
      </Typography>

      {/* Circular Progress Spinner */}
      <CircularProgress
        size={60}
        thickness={4}
        sx={{
          color: 'gray',
          mt: 4,
        }}
      />
    </Box>
  );
};

export default LoaderPage;
