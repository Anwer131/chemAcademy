import React, { useEffect, useState } from 'react';
import { fetchCourses, deleteCourse } from '../services/api';
import { Container, Typography, Button, Card, CardContent, CardActions, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const loadCourses = async () => {
      const data = await fetchCourses();
      setCourses(data);
    };
    loadCourses();
  }, []);

  const handleDeleteCourse = async (courseId) => {
    await deleteCourse(courseId);
    setCourses(courses.filter(course => course._id !== courseId));
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4">Manage Courses</Typography>
      {courses.map(course => (
        <Card key={course._id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h5">{course.title}</Typography>
            <Typography variant="body2">{course.description}</Typography>
          </CardContent>
          <CardActions>
            <IconButton onClick={() => handleDeleteCourse(course._id)} color="error">
              <Delete />
            </IconButton>
          </CardActions>
        </Card>
      ))}
    </Container>
  );
};

export default ManageCourses;
