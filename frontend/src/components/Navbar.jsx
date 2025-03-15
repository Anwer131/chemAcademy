import React, { useContext, useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem, IconButton, Tooltip, Drawer, List, ListItem, ListItemText, Divider, Rating
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AuthContext from '../contexts/AuthContext';
import logo from '../assets/logo.png';
import axios from 'axios';
import { useTheme, useMediaQuery } from '@mui/material';

const API_URL = "https://chemixlib-api.up.railway.app"; // Change to your server URL

const Navbar = () => {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState(null);
  const [ratingAnchorEl, setRatingAnchorEl] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [myRating, setMyRating] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 📝 Fetch the average rating on component mount
  const fetchRating = async () => {
    try {
      const res = await axios.get(`${API_URL}/ratings`);
      setAverageRating(parseFloat(res.data.averageRating));
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  // ⭐ Submit rating (Requires authentication)
  const submitRating = async (rating) => {
    if (!user) {
      alert("Please login to submit a rating.");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/ratings`,
        { rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMyRating(rating); // Update local rating
      fetchRating(); // Refresh average rating
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert("Error submitting rating. Please try again.");
    }
  };

  useEffect(() => {
    fetchRating(); // Fetch rating when component mounts
  }, []);

  const handleRatingMenuOpen = (event) => setRatingAnchorEl(event.currentTarget);
  const handleRatingMenuClose = () => setRatingAnchorEl(null);

  const handleRatingSubmit = (rating) => {
    submitRating(rating);
    handleRatingMenuClose();
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleProfile = () => { handleMenuClose(); navigate('/profile'); };
  const handleAdminPanel = () => { handleMenuClose(); navigate('/admin'); };
  const handleLogout = () => { logout(); navigate('/'); setDrawerOpen(false); };
  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { label: 'All Courses', path: '/courses' },
    { label: 'All Books', path: '/books' },
    { label: 'Community', path: '/community'}
  ];

  const drawerContent = (
    <Box sx={{ width: 250 }} role="presentation" onClick={() => setDrawerOpen(false)} onKeyDown={() => setDrawerOpen(false)}>
      <List>
        {navLinks.map((link) => (
          <ListItem
            key={link.label}
            component={Link}
            to={link.path}
            sx={{
              color: 'white',
              backgroundColor: isActive(link.path) ? 'rgba(0,0,0,0.1)' : 'transparent',
            }}
          >
            <ListItemText primary={link.label} />
          </ListItem>
        ))}
      </List>
      <Divider />
      {user ? (
        <>
          <ListItem><Typography variant="subtitle1" sx={{ fontWeight: 'bold', ml: 1 }}>{user.username}</Typography></ListItem>
          <ListItem component={Link} to="/profile"><ListItemText sx={{ color: 'white' }} primary="Profile" /></ListItem>
          {user.admin && <ListItem component={Link} to="/admin"><ListItemText sx={{ color: 'white' }} primary="Admin Panel" /></ListItem>}
          <ListItem onClick={handleLogout}><ListItemText sx={{ color: 'white' }} primary="Logout" /></ListItem>
        </>
      ) : (
        <>
          <ListItem component={Link} to="/login"><ListItemText sx={{ color: 'white' }} primary="Login" /></ListItem>
          <ListItem component={Link} to="/register"><ListItemText sx={{ color: 'white' }} primary="Register" /></ListItem>
        </>
      )}
    </Box>
  );

  return (
    <AppBar position="sticky" sx={{ backgroundColor: 'rgba(0,0,0,1)' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Box component={Link} to='/' sx={{ height: 40, width: 'auto', mr: 'auto' }}>
          <img src={logo} alt="Logo" style={{ height: '100%', width: 'auto' }} />
        </Box>

        {/* ⭐ Average Rating */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#fff', mx: 2 }}>
          <Tooltip title="Rate this portal!">
            <IconButton onClick={handleRatingMenuOpen} sx={{ padding: 0 }}>
              <Rating value={averageRating} max={1} precision={0.1} readOnly sx={{ color: '#ffb400' }} />
            </IconButton>
          </Tooltip>
          <Typography variant="body2">{averageRating.toFixed(1)}</Typography>
        </Box>

        {/* Desktop Navigation */}
        {!isMobile && (
          <>
            {navLinks.map((link) => (
              <Button
                key={link.label}
                color="inherit"
                component={Link}
                to={link.path}
                sx={{
                  backgroundColor: isActive(link.path) ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: isActive(link.path) ? 'primary.main' : 'inherit',
                  mr: 2,
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)', color: 'primary.main' },
                  transition: 'all 0.3s ease',
                }}
              >
                {link.label}
              </Button>
            ))}
            {user ? (
              <>
                <Button onClick={handleMenuOpen} variant="contained" endIcon={<AccountCircleIcon />} sx={{ backgroundColor: '#000', color: '#fff', ml: 2 }}>
                  {user.username}
                </Button>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} sx={{ mt: 2 }}>
                  <MenuItem onClick={handleProfile}>Profile</MenuItem>
                  {user.admin && <MenuItem onClick={handleAdminPanel}>Admin Panel</MenuItem>}
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button variant="contained" color="success" component={Link} to="/login" sx={{ mr: 2 }}>Login</Button>
                <Button color="inherit" component={Link} to="/register">Register</Button>
              </>
            )}
          </>
        )}

        {/* Mobile Hamburger Menu */}
        {isMobile && <IconButton edge="end" color="inherit" onClick={() => setDrawerOpen(true)}><MenuIcon /></IconButton>}
      </Toolbar>

      {/* ⭐ Rating Submission Popup */}
      <Menu anchorEl={ratingAnchorEl} open={Boolean(ratingAnchorEl)} onClose={handleRatingMenuClose} sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>Submit your rating:</Typography>
          <Rating
            value={myRating}
            precision={1}
            onChange={(event, newValue) => handleRatingSubmit(newValue)}
            sx={{ color: '#ffb400' }}
          />
        </Box>
      </Menu>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {drawerContent}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
