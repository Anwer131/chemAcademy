import React from 'react';
import { Card, CardContent, CardActions, Button, Typography, IconButton, Box } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const CourseCard = ({ course, isAdmin, isEnrolled, onEnroll, onDelete, isLoading }) => {
  const navigate = useNavigate();

  // Function to handle navigation to the SingleCourse page
  const handleCourseClick = () => {
    navigate(`/courses/${course.code}`);
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <CardContent>
        {/* Course Title: Clickable to navigate to the course details page */}
        <Box
          sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'bold' } }}
          onClick={handleCourseClick}
        >
          <Typography variant="h6" gutterBottom>
            {course.title.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </Typography>
        </Box>
        <Typography variant="subtitle1" gutterBottom>
          {course.code.toUpperCase()}
        </Typography>
      </CardContent>

      <CardActions>
        {/* Enroll Button: Updates dynamically based on enrollment status */}
        <Button
          variant="contained"
          color="primary"
          onClick={onEnroll}
          disabled={isEnrolled || isLoading}
        >
          {isEnrolled ? 'Enrolled' : isLoading ? 'Enrolling...' : 'Enroll'}
        </Button>

        {/* Delete Button: Only visible for admins */}
        {isAdmin && (
          <IconButton color="error" onClick={onDelete}>
            <Delete />
          </IconButton>
        )}
      </CardActions>
    </Card>
  );
};

export default CourseCard;
