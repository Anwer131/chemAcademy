import React, { useState, useEffect, useContext } from 'react';
import {
  Container, Typography, Grid, Card, Avatar, Box, Button, Dialog, DialogActions,
  DialogContent, DialogTitle, TextField, Chip
} from '@mui/material';
import AuthContext from '../contexts/AuthContext';
import { updateProfile, unenrollCourse } from '../services/api';

const Profile = () => {
  const { user, setUser, enrolledCourses, setEnrolledCourses } = useContext(AuthContext);
  const [openDialog, setOpenDialog] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [profilePic, setProfilePic] = useState(null);

  const handleUnenrollCourse = async (courseId) => {
    try {
      await unenrollCourse(courseId);
      setEnrolledCourses(enrolledCourses.filter(course => course._id !== courseId));
      setUser({ ...user, courses: user.courses.filter(id => id !== courseId) });
    } catch (error) {
      console.error('Error unenrolling from course:', error);
    }
  };
  const handleProfileUpdate = async () => {
    try {
      const profileData = { firstName, lastName, profilePic };
      const updatedUser = await updateProfile(profileData);
      setUser(updatedUser.user);
      setOpenDialog(false);
    } catch (error) {
      console.error('Profile Update Error:', error);
    }
  };

  const handleFileChange = (event) => {
    setProfilePic(event.target.files[0]);
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 5, textAlign: 'center' }}>
        <Typography variant="h5">Please log in to view your profile.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Card sx={{ p: 4, backgroundColor: '#2e2e2e', color: '#fff', position: 'relative' }}>
        {/* Update Profile Button */}
        <Button
          variant="contained"
          sx={{ position: 'absolute', top: 16, right: 16 }}
          onClick={() => setOpenDialog(true)}
        >
          Update Profile
        </Button>

        {/* Profile Information */}
        <Grid container direction="column" alignItems="center" spacing={3}>
          <Avatar src={user?.profilePic} alt={user?.username} sx={{ width: 120, height: 120 }} />
          <Typography variant="h6" sx={{ mt: 2 }}>{user?.username}</Typography>
          <Typography color='red' variant="h5">{`${user?.firstName || ''} ${user?.lastName || ''}`}</Typography>
          <Typography variant="body1">Department: {user?.department || 'N/A'}</Typography>
          <Typography variant="body1">Year: {user?.year || 'N/A'}</Typography>
          <Typography variant="body1">Semester: {user?.semester || 'N/A'}</Typography>
        </Grid>

        {/* Enrolled Courses Section */}
        <Box mt={4}>
          <Typography variant="h6">Enrolled Courses</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
            {enrolledCourses.length > 0 ? (
              enrolledCourses.map((course) => (
                <Chip
                  key={course._id}
                  label={course.code}
                  onDelete={() => handleUnenrollCourse(course._id)}
                  color="success"
                  sx={{ cursor: 'default' }}
                />
              ))
            ) : (
              <Typography variant="body2">You are not enrolled in any courses.</Typography>
            )}
          </Box>
        </Box>
      </Card>

      {/* Update Profile Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Update Profile</DialogTitle>
        <DialogContent>
          <TextField
            label="First Name"
            fullWidth
            margin="normal"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            label="Last Name"
            fullWidth
            margin="normal"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <Button variant="contained" component="label" sx={{ mt: 2 }}>
            Upload Profile Picture
            <input type="file" hidden onChange={handleFileChange} accept="image/*" />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">Cancel</Button>
          <Button onClick={handleProfileUpdate} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
