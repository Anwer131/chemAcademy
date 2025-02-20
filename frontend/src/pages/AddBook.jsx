import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';

const AddBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [driveLink, setDriveLink] = useState('');
  const [courseIds, setCourseIds] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/courses')
      .then((res) => setCourses(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/books', { title, author, description, driveLink, courseIds }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Book added successfully');
    } catch (err) {
      alert('Failed to add book');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>Add Book</Typography>
      <form onSubmit={handleAddBook}>
        <TextField label="Title" fullWidth margin="normal" value={title} onChange={(e) => setTitle(e.target.value)} />
        <TextField label="Author" fullWidth margin="normal" value={author} onChange={(e) => setAuthor(e.target.value)} />
        <TextField label="Description" fullWidth margin="normal" multiline rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
        <TextField label="Drive Link" fullWidth margin="normal" value={driveLink} onChange={(e) => setDriveLink(e.target.value)} />

        <FormControl fullWidth margin="normal">
          <InputLabel>Associate Courses</InputLabel>
          <Select multiple value={courseIds} onChange={(e) => setCourseIds(e.target.value)}>
            {courses.map((course) => (
              <MenuItem key={course._id} value={course._id}>{course.title}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Button type="submit" variant="contained" color="secondary" fullWidth sx={{ mt: 3 }}>Add Book</Button>
      </form>
    </Container>
  );
};

export default AddBook;
