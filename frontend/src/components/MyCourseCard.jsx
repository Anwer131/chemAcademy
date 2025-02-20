import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MyCourseCard = ({ course}) => {
  const navigate = useNavigate();

  // Function to handle navigation to the SingleCourse page
  const handleCourseClick = () => {
    navigate(`/courses/${course.code}`);
  };
  return (
    <Card onClick={handleCourseClick} sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        cursor:'pointer',
        boxShadow: 'none', // No initial shadow
        transition: 'box-shadow 0.3s ease', // Smooth transition for shadow
        '&:hover': {
          boxShadow: '0px 4px 10px rgba(255, 255, 255, 0.79)', // Shadow on hover
        }, 
        }}
        >
      <CardContent>
        {/* Course Title: Clickable to navigate to the course details page */}
        <Box>
          <Typography variant="h6" gutterBottom>
            {course?.title.toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')}
          </Typography>
        </Box>
        <Typography color='grey' variant="subtitle1" gutterBottom>
          {course?.code.toUpperCase()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MyCourseCard;
