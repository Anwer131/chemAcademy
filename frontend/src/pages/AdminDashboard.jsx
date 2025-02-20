import React from 'react';
import { Container, Typography, Grid, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid container spacing={4} justifyContent="center" sx={{ mt: 3 }}>
        <Grid item>
          <Button component={Link} to="/admin/add-course" variant="contained" color="primary">
            Add Course
          </Button>
        </Grid>
        <Grid item>
          <Button component={Link} to="/admin/add-book" variant="contained" color="secondary">
            Add Book
          </Button>
        </Grid>
        <Grid item>
          <Button component={Link} to="/admin/manage-courses" variant="contained" color="info">
            Manage Courses
          </Button>
        </Grid>
        <Grid item>
          <Button component={Link} to="/admin/manage-books" variant="contained" color="success">
            Manage Books
          </Button>
        </Grid>
        <Grid item>
          <Button component={Link} to="/admin/manage-users" variant="contained" color="warning">
            Manage Users
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
