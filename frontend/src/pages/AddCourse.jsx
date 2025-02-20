import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddCourse = () => {
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  // Function to validate and format course code
  const validateCode = (code) => {
    const regex = /^[A-Za-z]{3}\d{3}$/; // Code must start with 3 letters followed by 3 digits
    return regex.test(code);
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();

    if (!validateCode(code)) {
      alert('Invalid course code. It must be 3 letters followed by 3 digits.');
      return;
    }
    try {
      const response = await axios.post(
        'http://localhost:5000/courses',
        { title, code },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      // Check if course already exists
      if (response.data.message === 'Course already exists') {
        alert('Course already exists');
      } else {
        navigate(`/courses/${code}`); // Redirect to the course page
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        alert(`Error: ${err.response.data.message}`);
        navigate(`/courses/${code}`);
      } else {
        alert('Failed to add course');
      }
    }

    // Reset form
    setTitle('');
    setCode('');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>Add Course</Typography>
      <form onSubmit={handleAddCourse}>
        <TextField label="Course Title" fullWidth margin="normal" value={title} onChange={(e) => setTitle(e.target.value)} />
        <TextField label="Course Code" fullWidth margin="normal" value={code} onChange={(e) => setCode(e.target.value)} error={!validateCode(code)} helperText={!validateCode(code) ? 'Invalid code format' : ''} />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>Add Course</Button>
      </form>
    </Container>
  );
};

export default AddCourse;
