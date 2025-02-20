import React, { useContext, useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem, IconButton, Tooltip
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Rating } from '@mui/material';
import AuthContext from '../contexts/AuthContext';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import logo from '../assets/logo.png'

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [ratingAnchorEl,setRatingAnchorEl] = useState(null);
  const [averageRating, setAverageRating] = useState(4.8); // State for the average rating
  const [myRating, setMyRating] = useState(null);

  // Fetch the average rating when the component loads
  // useEffect(() => {
  //   const loadRating = async () => {
  //     try{
  //       const response = await fetchRating();
  //       setAverageRating(response);
  //     }catch(error){
  //       console.error('Error fetching ratings:', error);
  //     }
  //   }
  //   loadRating();
  // }, []);

  // Submit a user's rating
  // Handlers for rating menu
  const handleRatingMenuOpen = (event) => {
    setRatingAnchorEl(event.currentTarget);
  };

  const handleRatingMenuClose = () => {
    setRatingAnchorEl(null);
  };

  const handleRatingSubmit = (rating) => {
    //write the api for submitting
    setMyRating(rating);
    setAverageRating((prevRating) => (prevRating + rating) / 2); // Simulate average rating update
    handleRatingMenuClose();
    console.log(`Rating submitted: ${rating}`);
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

  const isActive = (path) => location.pathname === path
  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#1e1e1e' }}>
      <Toolbar>
        {/* Logo Section */}
        <Box
          component={Link}
          to='/'
          sx={{
            height: 40, // Set logo height
            width: 'auto', // Maintain aspect ratio
            mr: 'auto', // Add spacing between the logo and the rating
          }}
        >
          <img
            src={logo} // Replace with your logo path
            alt="Logo"
            style={{
              height: '100%', // Ensures the image fits within the container
              width: 'auto',  // Maintain aspect ratio
            }}
          />
        </Box>
  
        {/* Star Rating Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection:'column',
            alignItems: 'center',
            color: '#fff',
            mr: 2,
          }}
        >
          <Tooltip title="Rate this portal!">
            <IconButton onClick={handleRatingMenuOpen} sx={{padding:0}}>
              <Rating
                value={averageRating}
                max={1} // Display only one star
                precision={0.1}
                readOnly
                sx={{
                  color: '#ffb400',
                }}
              />
            </IconButton>
          </Tooltip>
          <Typography variant="body2">
            {averageRating.toFixed(1)}
          </Typography>

          {/* Rating Menu */}
          <Menu
            anchorEl={ratingAnchorEl}
            open={Boolean(ratingAnchorEl)}
            onClose={handleRatingMenuClose}
            sx={{ mt: 2 }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 2,
              }}
            >
              <Typography variant="body2" sx={{ mb: 1 }}>
                Submit your rating:
              </Typography>
              <Rating
                value={myRating}
                precision={1}
                onChange={(event, newValue) => handleRatingSubmit(newValue)}
                sx={{
                  color: '#ffb400',
                }}
              />
            </Box>
          </Menu>
        </Box>
  
        {/* Navigation Links */}
        <Button
          color="inherit"
          component={Link}
          to="/courses"
          sx={{
            backgroundColor: isActive('/courses') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            color: isActive('/courses') ? 'primary.main' : 'inherit',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'primary.main',
            },
            transition: 'all 0.3s ease',
            mr: 2, // Adds gap between buttons
          }}
        >
          All Courses
        </Button>
        <Button
          color="inherit"
          component={Link}
          to="/books"
          sx={{
            backgroundColor: isActive('/books') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            color: isActive('/books') ? 'primary.main' : 'inherit',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'primary.main',
            },
            transition: 'all 0.3s ease',
            mr: 2, // Adds gap between buttons
          }}
        >
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
            <Button variant="contained" color="success" component={Link} to="/login" sx={{mr:2}}>
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
