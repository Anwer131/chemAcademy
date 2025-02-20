import React, { useEffect, useState, useContext } from 'react';
import { fetchCourses, enrollCourse, deleteCourse } from '../services/api';
import { Container, Grid, Typography, TextField, Button, Box } from '@mui/material';
import AuthContext from '../contexts/AuthContext';
import CourseCard from '../components/CourseCard';

const Courses = () => {
  const { user, setUser, loadEnrolledCourses } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [enrollingCourseId, setEnrollingCourseId] = useState(null);

  // Fetch courses when the component mounts
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await fetchCourses();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    loadCourses();
  }, []);

  const handleEnrollCourse = async (courseId) => {
    if (!user) {
      alert('Please log in to enroll in a course.');
      return;
    }

    if (user?.courses?.includes(courseId)) {
      alert('You are already enrolled in this course.');
      return;
    }

    setEnrollingCourseId(courseId);

    try {
      const response = await enrollCourse(courseId);
      if (response.success) {
        alert('Successfully enrolled in the course.');
        const updatedCourses = [...(user.courses || []), courseId];
        setUser({ ...user, courses: updatedCourses });
        loadEnrolledCourses();
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
    } finally {
      setEnrollingCourseId(null);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!user?.admin) return;

    const confirmDelete = window.confirm('Are you sure you want to delete this course?');
    if (confirmDelete) {
      try {
        await deleteCourse(courseId);
        setCourses(courses.filter(course => course._id !== courseId));
        alert('Course deleted successfully.');
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredCourses = courses.filter(course =>
    course.code.toLowerCase().includes(searchQuery) ||
    course.title.toLowerCase().includes(searchQuery)
  );

  return (
    <Container maxWidth="lg">
      <Box display="flex" alignItems="center" justifyContent="space-between" mt={1}>
        <Typography fontWeight={500} variant="h4">All Courses</Typography>
        <TextField
          label="Search courses"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearch}
          style={{ maxWidth: '300px' }} // Optional: To limit the size of the input
        />
      </Box>
      <Grid container spacing={4} mt={0.5}>
        {filteredCourses?.map(course => (
          <Grid item xs={12} sm={6} md={4} key={course._id}>
            <CourseCard
              course={course}
              isAdmin={user?.admin}
              isEnrolled={user?.courses?.includes(course._id) || false}
              isLoading={enrollingCourseId === course._id}
              onEnroll={() => handleEnrollCourse(course._id)}
              onDelete={() => handleDeleteCourse(course._id)}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Courses;
