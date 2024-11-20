import React, { useEffect, useState } from 'react';
import {
  Container, Grid, Typography, Card, Tabs, Tab, Box, RadioGroup,
  FormControlLabel, Radio, List, ListItem, ListItemText, Avatar,
  CardContent, Divider
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { fetchCourseDetails } from '../services/api';
import BookIcon from '@mui/icons-material/Book';
import PolicyIcon from '@mui/icons-material/Policy';
import SchoolIcon from '@mui/icons-material/School';
import ForumIcon from '@mui/icons-material/Forum';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FeedbackIcon from '@mui/icons-material/Feedback';
import LectureIcon from '@mui/icons-material/PlayLesson';

const SingleCourse = () => {
  const { courseCode } = useParams();
  const [course, setCourse] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedProfessor, setSelectedProfessor] = useState('');

  useEffect(() => {
    const loadCourseDetails = async () => {
      try {
        const data = await fetchCourseDetails(courseCode);
        setCourse(data);
        if (data.professors && data.professors.length > 0) {
          setSelectedProfessor(data.professors[0].name);
        }
      } catch (error) {
        console.error('Error loading course details:', error);
      }
    };
    loadCourseDetails();
  }, [courseCode]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleProfessorChange = (event) => {
    setSelectedProfessor(event.target.value);
  };

  if (!course) {
    return <Typography variant="h5" align="center">Loading...</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 5, color: '#f5f5f5', backgroundColor: '#121212', borderRadius: '8px', p: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#90caf9' }}>{course.title}</Typography>
        <Typography variant="h6" sx={{ color: '#b0bec5', mt: 1 }}>Code: {course.code}</Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Books Section */}
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2, backgroundColor: '#1e1e1e', height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', color: '#90caf9' }}>Books</Typography>
            <Divider sx={{ mb: 2, backgroundColor: '#424242' }} />
            {course.books.length > 0 ? (
              course.books.map((book) => (
                <Card key={book._id} sx={{ mb: 2, backgroundColor: '#2e2e2e', color: '#f5f5f5' }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom><BookIcon /> {book.title}</Typography>
                    <Typography variant="body2" sx={{ color: '#bdbdbd' }}>Author: {book.author}</Typography>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography variant="body2" align="center" sx={{ color: '#bdbdbd' }}>No books available</Typography>
            )}
          </Card>
        </Grid>

        {/* Course Content */}
        <Grid item xs={12} md={9}>
          {/* Professor Selection */}
          <Card sx={{ mb: 4, p: 3, backgroundColor: '#1e1e1e', color: '#f5f5f5' }}>
            <Typography variant="h6" sx={{ color: '#90caf9' }}>Select Professor</Typography>
            <RadioGroup value={selectedProfessor} onChange={handleProfessorChange} sx={{ mt: 2 }}>
              {course.professors.map((prof) => (
                <FormControlLabel
                  key={prof.name}
                  value={prof.name}
                  control={<Radio />}
                  label={
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ width: 30, height: 30, mr: 2, bgcolor: '#90caf9', color: '#121212' }}>
                        {prof.name[0]}
                      </Avatar>
                      {prof.name}
                    </Box>
                  }
                  sx={{ color: '#bdbdbd' }}
                />
              ))}
            </RadioGroup>
          </Card>

          {/* Tabs for Course Content */}
          <Box sx={{ borderBottom: 1, borderColor: '#424242', mb: 3 }}>
            <Tabs value={selectedTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
              <Tab icon={<PolicyIcon />} label="Policy" sx={{ color: '#f5f5f5' }} />
              <Tab icon={<LectureIcon />} label="Lectures" sx={{ color: '#f5f5f5' }} />
              <Tab icon={<AssignmentIcon />} label="Tutorials" sx={{ color: '#f5f5f5' }} />
              <Tab icon={<SchoolIcon />} label="PYQs" sx={{ color: '#f5f5f5' }} />
              <Tab icon={<FeedbackIcon />} label="Feedbacks" sx={{ color: '#f5f5f5' }} />
              <Tab icon={<ForumIcon />} label="Q&A Forum" sx={{ color: '#f5f5f5' }} />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box sx={{ mt: 3 }}>
            {selectedTab === 0 && <Typography variant="body1" sx={{ color: '#bdbdbd' }}>{course.policy || 'No policy available'}</Typography>}
            {selectedTab === 1 && <Typography variant="body1" sx={{ color: '#bdbdbd' }}>Lectures content goes here...</Typography>}
            {selectedTab === 2 && <Typography variant="body1" sx={{ color: '#bdbdbd' }}>Tutorials content goes here...</Typography>}
            {selectedTab === 3 && <Typography variant="body1" sx={{ color: '#bdbdbd' }}>Previous Year Questions (PYQs) content goes here...</Typography>}
            {selectedTab === 4 && <Typography variant="body1" sx={{ color: '#bdbdbd' }}>Feedbacks content goes here...</Typography>}
            {selectedTab === 5 && <Typography variant="body1" sx={{ color: '#bdbdbd' }}>Q&A Forum content goes here...</Typography>}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SingleCourse;
