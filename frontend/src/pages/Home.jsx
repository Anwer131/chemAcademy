import React, { useContext, useEffect} from 'react';
import { Grid, Container } from '@mui/material';
import AuthContext from '../contexts/AuthContext';
import MyCourseCard from '../components/MyCourseCard';
import LoaderPage from '../components/Loader';
// import { fetchEnrolledCourses } from '../services/api';

const Home = () => {
  const { user, enrolledCourses } = useContext(AuthContext);
  const [loading, setLoading] = React.useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000); // Simulate loading
    return () => clearTimeout(timer);
  }, []);
  return (
    loading ? <LoaderPage/> :
    <Container maxWidth="lg" mb={5}>
      <h2>Hey {user ? user.firstName !== "" ? user.firstName : user.username : 'there!'}</h2>
      {user ? (

      <>
        <h3 style={{textAlign:'center'}}>My Courses</h3>
        <Grid container spacing={4}>
          
          {enrolledCourses.length === 0 ? (<h4>Your course Bucket is empty!!  Please Add Courses</h4>) : enrolledCourses?.map(course => (
            // Ensure the key is unique, using course._id
            <Grid item xs={12} sm={6} md={4} key={course._id || course.code}>
              <MyCourseCard course={course} />
            </Grid>
          ))}
        </Grid>
      </>) : (
        <p>Please log in to view your courses and recommendations.</p>
      )}
      
    </Container>
    
  );
};

export default Home;
