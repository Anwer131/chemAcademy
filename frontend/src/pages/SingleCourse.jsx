import React, { useContext, useEffect, useState } from 'react';
import {
  Container, Grid, Typography, Card, Tabs, Tab, Box, Button, Divider, CardContent, List, ListItem, ListItemText, IconButton, TextField,
  Dialog, DialogContent, DialogActions, Rating
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCourseDetails, updateCoursePolicy, submitFeedback } from '../services/api'; // API calls
import {formatDistanceToNow} from 'date-fns'
import AuthContext from '../contexts/AuthContext';
import BookIcon from '@mui/icons-material/Book';
import PolicyIcon from '@mui/icons-material/Policy';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FeedbackIcon from '@mui/icons-material/Feedback';
import LectureIcon from '@mui/icons-material/PlayLesson';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
// import FolderIcon from '@mui/icons-material/Folder';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import LoaderPage from '../components/Loader';

const SingleCourse = () => {
  const { user } = useContext(AuthContext);
  const { courseCode } = useParams();
  const [course, setCourse] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedProfessor, setSelectedProfessor] = useState('');
  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState(5);
  const [policyData, setPolicyData] = useState({});
  const navigate = useNavigate();
  if(!user) navigate('/login');
  const isAdmin = user?.admin;

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

  const handleProfessorChange = (profName) => {
    setSelectedProfessor(profName);
  };

  const openEditPolicyModal = () => {
    setPolicyData(selectedProf.policy || {});
    setPolicyModalOpen(true);
  };

  const handlePolicyChange = (event) => {
    setPolicyData({ ...policyData, [event.target.name]: event.target.value });
  };

  const savePolicyChanges = async () => {
    const professorIndex = course.professors.findIndex((prof) => prof.name === selectedProfessor);
    try {
      await updateCoursePolicy(courseCode, professorIndex, policyData);
      setPolicyModalOpen(false);
      const updatedCourse = await fetchCourseDetails(courseCode);
      setCourse(updatedCourse);
    } catch (error) {
      console.error('Error updating policy:', error);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim()) {
      alert("Feedback cannot be empty.");
      return;
    }
  
    try {
      const professorIndex = course.professors.findIndex((prof) => prof.name === selectedProfessor);
      await submitFeedback(courseCode, professorIndex, { rating, comment: feedbackText });
      setFeedbackText('');
      setRating(5);
  
      // Refresh course details to display updated feedback
      const updatedCourse = await fetchCourseDetails(courseCode);
      setCourse(updatedCourse);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    }
  };
  

  if (!course) {
    return <LoaderPage content={courseCode}/>
  }

  const selectedProf = course.professors.find((prof) => prof.name === selectedProfessor);

  return (
    <Container maxWidth="100%" sx={{ mt: 3 }}>
      {/* Course Header */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h4">{course.title.toUpperCase()}</Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>{course.code.toUpperCase()}</Typography>
      </Box>

      <Grid container spacing={2}>
        {/* Books Section */}
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ textAlign: 'center' }}>Books</Typography>
            <Divider sx={{ mb: 2 }} />
            {course.books.length > 0 ? (
              course.books.map((book) => (
                <Card key={book._id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1"><BookIcon /> {book.title}</Typography>
                    <Typography variant="body2">Author: {book.author}</Typography>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography variant="body2" align="center">No books available</Typography>
            )}
          </Card>
        </Grid>

        {/* Course Content */}
        <Grid item xs={12} md={9}>
          {/* Professor Selection */}
          <Card sx={{ mb: 2, p: 2, display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Typography variant="h6">Select Professor: </Typography>
            <Box display="flex" gap={2}>
              {course.professors.map((prof) => (
                <Button
                  key={prof.name}
                  onClick={() => handleProfessorChange(prof.name)}
                  variant={selectedProfessor === prof.name ? "contained" : "outlined"}
                >
                  {prof.name}
                </Button>
                
              ))}
              <IconButton color="primary" onClick={() => navigate(`/admin/addProfessor/${courseCode}`)}>
                <AddIcon />
              </IconButton>
            </Box>
          </Card>

          {/* Tabs */}
          <Tabs value={selectedTab} onChange={handleTabChange} sx={{ mb: 2 }}>
            <Tab icon={<PolicyIcon />} label="Policy" />
            <Tab icon={<LectureIcon />} label="Lectures" />
            <Tab icon={<AssignmentIcon />} label="Tutorials" />
            <Tab icon={<SchoolIcon />} label="PYQs" />
            <Tab icon={<FeedbackIcon />} label="Feedback" />
          </Tabs>

          {/* Course Policy */}
          {selectedTab === 0 && selectedProf?.policy && (
            <Card sx={{ p: 2 }}>
              <Typography variant="h6">Course Policy</Typography>
              <Divider/>
              <List>
                {Object.entries(selectedProf.policy).slice(0,-1).map(([key, value]) => (
                  <ListItem key={key}>
                    <DoubleArrowIcon sx={{mr:2}} fontSize="small" />
                    <ListItemText primary={`${key}: ${value || 'N/A'}`} />
                  </ListItem>
                ))}
              </List>
              {isAdmin && (
                <Button startIcon={<EditIcon />} onClick={openEditPolicyModal} variant="outlined">Edit Policy</Button>
              )}
            </Card>
          )}
          {/* Lectures */}
          {selectedTab === 1 && selectedProf?.policy && (
            <Card sx={{ p: 2 }}>
              <Typography variant="h6">Lecture Notes</Typography>
              <Divider sx={{ mb: 2 }} />
              {/* <Link href={selectedProf?.lectures?.link} underline="none" color="inherit">
              <Stack direction="column" alignItems="center" spacing={1}>
                <IconButton size="large" sx={{ p: 0 }}>
                  <FolderIcon fontSize="150px" color="primary.main" />
                </IconButton>
                <Typography variant="body">{selectedProf?.lectures?.label}</Typography>
              </Stack>
              </Link> */}
              <iframe
                title='lectures' 
                src={`https://drive.google.com/embeddedfolderview?id=${selectedProf?.lectures?.link}#grid`} 
                width="100%" 
                height="600" 
              ></iframe>
            </Card>
          )}
          {/* Tutorials */}
          {selectedTab === 2 && selectedProf?.tutorials && (
            <Card sx={{ p: 2 }}>
              <Typography variant="h6">Tutorials</Typography>
              <Divider sx={{ mb: 2 }} />
              {/* <Link href={selectedProf?.tutorials?.link} underline="none" color="inherit">
              <Stack direction="column" alignItems="center" spacing={1}>
                <IconButton size="large" sx={{ p: 0 }}>
                  <FolderIcon fontSize="150px" color="primary.main" />
                </IconButton>
                <Typography variant="body">{selectedProf?.tutorials?.label}</Typography>
              </Stack>
              </Link> */}
              <iframe 
                title='tutorials'
                src={`https://drive.google.com/embeddedfolderview?id=${selectedProf?.tutorials?.link}#grid`} 
                width="100%" 
                height="600" 
              ></iframe>
            </Card>
          )}
          {/* PYQ */}
          {selectedTab === 3 && selectedProf?.pyq && (
            <Card sx={{ p: 2 }}>
              <Typography variant="h6">Previous Year Questions</Typography>
              <Divider sx={{ mb: 2 }} />
              {/* <Link href={selectedProf?.pyq?.link} underline="none" color="inherit">
              <Stack direction="column" alignItems="center" spacing={1}>
                <IconButton size="large" sx={{ p: 0 }}>
                  <FolderIcon fontSize="150px" color="primary.main" />
                </IconButton>
                <Typography variant="body">{selectedProf?.pyq?.label}</Typography>
              </Stack>
              </Link> */}
              <iframe 
                title='pyq'
                src={`https://drive.google.com/embeddedfolderview?id=${selectedProf?.pyq?.link}#grid`} 
                width="100%" 
                height="600" 
              ></iframe>
            </Card>
          )}
          {/* Feedback Form */}
          {selectedTab === 4 && (
            <Card sx={{ p: 2 }}>
              <Typography variant="h6">Professor Feedback</Typography>
              <Divider sx={{ my: 2, borderBottomWidth:'3px' }} />

              {/* Existing Feedback */}
              {selectedProf.feedback.length > 0 ? (
                selectedProf.feedback.map((fb, index) => (
                  <>
                  <Box key={index} sx={{ display:'flex', flexWrap:'wrap', gap:1, mb: 1, p: 1}}>
                    <Typography sx={{width: {sm: '20%' }}} variant="subtitle2">{fb.author?.username || 'Anonymous'}</Typography>
                    <Rating sx={{width: {sm: '20%' }, fontSize:'15px', mt:0.5}} value={fb.rating} readOnly />
                    <Typography variant="caption" color="text.secondary">
                      {formatDistanceToNow(new Date(fb.createdAt), { addSuffix: true })} {/* 👈 Shows "2 hours ago" */}
                    </Typography>
                    <Typography sx={{width:'100%'}} variant="body2">{fb.comment}</Typography>
                    
                  </Box>
                  <Divider variant='fullwidth' />
                  </>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">No feedback yet.</Typography>
              )}

              {/* Feedback Form */}
              <Typography variant="h6" sx={{ mb: 1, mt:2 }}>Add Your Feedback</Typography>
              <TextField
                required
                fullWidth
                multiline
                rows={3}
                label="Your Feedback"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Rating
                required
                name="rating"
                value={rating}
                onChange={(event, newValue) => setRating(newValue)}
                sx={{ mb: 2, mr:2 }}
              />
              <Button variant="contained" onClick={handleSubmitFeedback}>Submit Feedback</Button>
            </Card>
          )}

        </Grid>
      </Grid>

      {/* Edit Policy Modal */}
      <Dialog open={policyModalOpen} onClose={() => setPolicyModalOpen(false)}>
        <Typography padding={2} variant="h6">Edit Course Policy</Typography>
        <DialogContent sx={{ display:'flex', flexWrap:'wrap', gap:2, scrollbarWidth:'none' }}>  
          {Object.keys(policyData).slice(0,-1).map((key) => (
            <TextField key={key} sx={{width:'40%', fontSize:'16px', my:1}} label={key} name={key} value={policyData[key]} onChange={handlePolicyChange} />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPolicyModalOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={savePolicyChanges} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SingleCourse;
