import React, { useEffect, useState } from 'react';
import { fetchCourses, deleteCourse } from '../services/api';
import { Container, Typography, Button, Card, CardContent, CardActions, IconButton, Grid } from '@mui/material';
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
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Manage Courses
      </Typography>
      <Grid container spacing={4}>
        {courses.map(course => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={course._id}>
            <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <CardContent>
                <Typography variant="h5">{course.code}</Typography>
                <Typography variant="body2">{course.title}</Typography>
              </CardContent>
              <CardActions>
                <IconButton onClick={() => handleDeleteCourse(course._id)} color="error">
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ManageCourses;
