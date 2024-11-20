import React, { useContext, useState } from 'react';
import { Button, TextField, Container, Typography, Box } from '@mui/material';
import AuthContext from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(username, password);
    navigate('/');
  };
  

  return (
    <Container maxWidth="xs">
      <Box mt={5} textAlign="center">
        <Typography variant="h4">Login</Typography>
        <form onSubmit={handleLogin}>
          <TextField label="Username" fullWidth margin="normal" value={username} onChange={(e) => setUsername(e.target.value)} />
          <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>Login</Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
