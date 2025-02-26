import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, TextField, Container, Typography, Box, Alert, CircularProgress } from '@mui/material';
import AuthContext from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/'; // Redirect after login
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null); // Error state for login
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(null); // Clear previous errors
    setLoading(true);
    try {
      await login(username, password); // Now this throws with a clear message if it fails
      navigate(from, { replace: true });
    } catch (err) {
      setLoginError(err.message); // Directly use the thrown error message
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Container maxWidth="xs">
      <Box mt={5} textAlign="center">
        <Typography variant="h4" gutterBottom>Login</Typography>

        {loginError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {loginError}
          </Alert>
        )}

        <form onSubmit={handleLogin}>
          <TextField
            required
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            required
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            {loading ? <CircularProgress size="25px" color='inherent'/> : "Login"}
          </Button>
        </form>

        <Link to="/register" style={{ textDecoration: 'none' }}>
          <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
            Create Account
          </Button>
        </Link>
      </Box>
    </Container>
  );
};

export default Login;
