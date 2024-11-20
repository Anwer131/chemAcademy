import React, { useEffect, useState, useContext } from 'react';
import { fetchCourses, enrollCourse, deleteCourse } from '../services/api';
import { Container, Grid, Typography } from '@mui/material';
import AuthContext from '../contexts/AuthContext';
import CourseCard from '../components/CourseCard';

const Courses = () => {
  const { user, setUser } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [enrollingCourseId, setEnrollingCourseId] = useState(null); // Track which course is being enrolled

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
    // Check if user is logged in
    if (!user) {
      alert('Please log in to enroll in a course.');
      return;
    }

    // Check if user.courses is defined and if the user is already enrolled
    if (user?.courses?.includes(courseId)) {
      alert('You are already enrolled in this course.');
      return;
    }

    setEnrollingCourseId(courseId); // Set the loading state for this course

    try {
      const response = await enrollCourse(courseId);
      if (response.success) {
        alert('Successfully enrolled in the course.');
        // Update the user's courses list
        setUser({ ...user, courses: [...(user.courses || []), courseId] });
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
    } finally {
      setEnrollingCourseId(null); // Reset the loading state
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

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" mt={5}>All Courses</Typography>
      <Grid container spacing={4} mt={3}>
        {courses?.map(course => (
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
