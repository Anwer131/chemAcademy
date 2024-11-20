import React, { useContext, useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem, IconButton, Tooltip
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Rating } from '@mui/material';
import AuthContext from '../contexts/AuthContext';
import { fetchRating, giveRating } from '../services/api';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from 'axios';
import logo from '../assets/logo.png'

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [averageRating, setAverageRating] = useState(4.8); // State for the average rating
  const [userRating, setUserRating] = useState(null); // State for the user's rating
  const [hoverRating, setHoverRating] = useState(null); // Hover effect

  // Fetch the average rating when the component loads
  useEffect(() => {
    const loadRating = async () => {
      try{
        const response = await fetchRating();
        setAverageRating(response);
      }catch(error){
        console.error('Error fetching ratings:', error);
      }
    }
    loadRating();
  }, []);

  // Submit a user's rating
  const handleRatingChange = async (newRating) => {
    if (!user) {
      alert('You need to log in to rate.');
      return;
    }
    try {
      const response = await giveRating(newRating);
      setUserRating(response);
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  // Handlers for opening and closing the dropdown menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate('/profile');
  };

  const handleAdminPanel = () => {
    handleMenuClose();
    navigate('/admin');
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1e1e1e' }}>
      <Toolbar>
        {/* Logo Section */}
        <Box
          component="img"
          src={logo} // Replace with your logo path
          alt="Logo"
          sx={{
            height: 40, // Set logo height
            width: 'auto', // Maintain aspect ratio
            mr: 'auto', // Add spacing between the logo and the rating
          }}
        />
  
        {/* Star Rating Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column', // Ensures the rating value is below the stars
            alignItems: 'center', // Center-aligns the stars and text
            color: '#fff',
            mr: 2, // Adds spacing to the right of the box
          }}
        >
          <Tooltip title="Rate this portal!">
            <Rating
              value={hoverRating || userRating || averageRating} // Display the average rating or user's rating
              precision={0.5}
              onChange={(event, newValue) => handleRatingChange(newValue)} // Submit rating on change
              onChangeActive={(event, newHover) => setHoverRating(newHover)} // Hover effect
              sx={{
                color: '#ffb400', // Gold color for stars
              }}
            />
          </Tooltip>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {averageRating} / 5
          </Typography>
        </Box>
  
        {/* Navigation Links */}
        <Button color="inherit" component={Link} to="/courses">
          All Courses
        </Button>
        <Button color="inherit" component={Link} to="/books">
          All Books
        </Button>
  
        {/* Username with Dropdown Menu */}
        {user ? (
          <>
            <Button
              onClick={handleMenuOpen}
              variant="contained"
              sx={{
                textTransform: 'none',
                backgroundColor: '#000',
                color: '#fff',
                '&:hover': { backgroundColor: 'gray' },
                ml: 2,
              }}
              endIcon={<AccountCircleIcon />}
            >
              {user.username}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              sx={{ mt: 2 }}
            >
              <MenuItem onClick={handleProfile}>Profile</MenuItem>
  
              {/* Admin Panel Option (only for admins) */}
              {user.admin && (
                <MenuItem onClick={handleAdminPanel}>Admin Panel</MenuItem>
              )}
  
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Button variant="contained" color="success" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
