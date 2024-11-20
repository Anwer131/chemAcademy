import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';

const AddCourse = () => {
  const [title, setTitle] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [description, setDescription] = useState('');

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/courses', { title, courseCode, description }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Course added successfully');
      setTitle('');
      setCourseCode('');
      setDescription('');
    } catch (err) {
      alert('Failed to add course');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>Add Course</Typography>
      <form onSubmit={handleAddCourse}>
        <TextField label="Course Title" fullWidth margin="normal" value={title} onChange={(e) => setTitle(e.target.value)} />
        <TextField label="Course Code" fullWidth margin="normal" value={courseCode} onChange={(e) => setCourseCode(e.target.value)} />
        <TextField label="Description" fullWidth multiline rows={4} margin="normal" value={description} onChange={(e) => setDescription(e.target.value)} />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>Add Course</Button>
      </form>
    </Container>
  );
};

export default AddCourse;
