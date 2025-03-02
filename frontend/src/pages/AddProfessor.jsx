import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Card, CardContent } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
// import { addProfessor } from '../services/api';
const API_URL = "https://chemixlib-api.up.railway.app"
const AddProfessor = () => {
  const {courseCode} = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [coursePolicy, setCoursePolicy] = useState({
    minor: '',
    major: '',
    project: '',
    assignments: '',
    quiz: '',
    tutorials: '',
    miscelleneous: '',
    attendancePolicy: '',
    other: ''
  });
  const [lectures, setLectures] = useState({
    label:'Lectures',
    link:''
  });
  const [tutorials, setTutorials] = useState({
    label:'Tutorials',
    link:''
  });
  const [pyq,setPyq] = useState({
    label:'PYQs',
    link:''
  });
  const [loading, setLoading] = useState(false);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCoursePolicy({ ...coursePolicy, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newProfessor = {
        name,
        policy: coursePolicy, 
        lectures,
        tutorials,
        pyq
      };

      // Assuming the backend endpoint for adding a professor is '/api/professors'
      await axios.post(`${API_URL}/courses/${courseCode}/professors`, newProfessor, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      navigate(`/courses/${courseCode}`);
    } catch (error) {
      console.error('Error adding professor:', error);
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, backgroundColor: '#121212', borderRadius: '8px', padding: 3, color: '#f5f5f5' }}>
      <Typography variant="h4" align="center" sx={{ mb: 3, color: '#90caf9' }}>Add Professor</Typography>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              required
              label="Name"
              variant="outlined"
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* Course Policy Fields */}
            <Typography variant="h6" sx={{ color: '#bdbdbd', mt: 2 }}>Course Policy</Typography>
            <Box sx={{display:'flex', gap:2, flexWrap:'wrap'}}>
              {Object.keys(coursePolicy).map((key) => (
                <TextField
                  key={key}
                  sx={{width:'40%'}}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  variant="outlined"
                  margin="normal"
                  name={key}
                  value={coursePolicy[key]}
                  onChange={handleInputChange}
                />
              ))}
            </Box>
            <Typography variant="h6" sx={{ color: '#bdbdbd', mt: 2 }}>Course Content</Typography>
            <Box sx={{display:'flex', flexWrap:'wrap', gap:2}}>
              <TextField
                sx={{width:'40%'}}
                label="Lectures folder Name"
                variant="outlined"
                margin="normal"
                name={lectures.label}
                value={lectures.label}
                onChange={(e) => setLectures({...lectures, label: e.target.value})}
              />
              <TextField
                sx={{width:'40%'}}
                label="Lectures folder link"
                variant="outlined"
                margin="normal"
                name={lectures.link}
                value={lectures.link}
                onChange={(e) => setLectures({...lectures, link: e.target.value})}
              />
              <TextField
                sx={{width:'40%'}}
                label="Tutorials folder Name"
                variant="outlined"
                margin="normal"
                name={tutorials.label}
                value={tutorials.label}
                onChange={(e) => setTutorials({...tutorials, label: e.target.value})}
              />
              <TextField
                sx={{width:'40%'}}
                label="Tutorials folder link"
                variant="outlined"
                margin="normal"
                name={tutorials.link}
                value={tutorials.link}
                onChange={(e) => setTutorials({...tutorials, link: e.target.value})}
              />
              <TextField
                sx={{width:'40%'}}
                label="PYQ folder Name"
                variant="outlined"
                margin="normal"
                name={pyq.label}
                value={pyq.label}
                onChange={(e) => setPyq({...pyq, label: e.target.value})}
              />
              <TextField
                sx={{width:'40%'}}
                label="PYQ folder link"
                variant="outlined"
                margin="normal"
                name={pyq.link}
                value={pyq.link}
                onChange={(e) => setPyq({...pyq, link: e.target.value})}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button loading={loading} type="submit" variant="contained" sx={{ bgcolor: '#90caf9' }} onClick={() => setLoading(true)}>Add Professor</Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AddProfessor;
