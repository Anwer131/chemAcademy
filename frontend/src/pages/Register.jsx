import React, { useContext, useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import AuthContext from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register({ username, password, firstName, lastName, department });
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box mt={5} textAlign="center">
        <Typography variant="h4" gutterBottom>Register</Typography>
        <form onSubmit={handleRegister}>
          <TextField label="Username" fullWidth margin="normal" value={username} onChange={(e) => setUsername(e.target.value)} />
          <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
          <TextField label="First Name" fullWidth margin="normal" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <TextField label="Last Name" fullWidth margin="normal" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          <TextField label="Department" fullWidth margin="normal" value={department} onChange={(e) => setDepartment(e.target.value)} />

          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Register</Button>
        </form>
      </Box>
    </Container>
  );
};

export default Register;
