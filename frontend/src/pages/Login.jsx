import React, { useContext, useState ,useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, TextField, Container, Typography, Box } from '@mui/material';
import AuthContext from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/'; // Last accessed URL or home
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate]);
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
          <TextField required label="Username" fullWidth margin="normal" value={username} onChange={(e) => setUsername(e.target.value)} />
          <TextField required label="Password" type="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>Login</Button>  
        </form>
        <Link to='/register'><Button variant="outlined" fullWidth sx={{ mt: 2 }}>Create Account</Button></Link>
      </Box>
    </Container>
  );
};

export default Login;
