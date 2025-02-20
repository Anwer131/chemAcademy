import React, { useContext, useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem, IconButton, Tooltip, Drawer, List, ListItem, ListItemText, Divider
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Rating } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AuthContext from '../contexts/AuthContext';
import logo from '../assets/logo.png';
import { useTheme, useMediaQuery } from '@mui/material';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [ratingAnchorEl, setRatingAnchorEl] = useState(null);
  const [averageRating, setAverageRating] = useState(4.8);
  const [myRating, setMyRating] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleRatingMenuOpen = (event) => setRatingAnchorEl(event.currentTarget);
  const handleRatingMenuClose = () => setRatingAnchorEl(null);
  
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
  const handleRatingSubmit = (rating) => {
    setMyRating(rating);
    setAverageRating((prevRating) => (prevRating + rating) / 2);
    handleRatingMenuClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setDrawerOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { label: 'All Courses', path: '/courses' },
    { label: 'All Books', path: '/books' },
  ];

  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={() => setDrawerOpen(false)}
      onKeyDown={() => setDrawerOpen(false)}
    >
      <List>
        {navLinks.map((link) => (
          <ListItem
            button
            key={link.label}
            component={Link}
            to={link.path}
            sx={{
              color:'white',
              backgroundColor: isActive(link.path) ? 'rgba(0,0,0,0.1)' : 'transparent',
            }}
          >
            <ListItemText primary={link.label} />
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* User-specific Options */}
      {user ? (
        <>
          <ListItem>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', ml: 1 }}>
              {user.username}
            </Typography>
          </ListItem>
          <ListItem button component={Link} to="/profile">
            <ListItemText sx={{color:'white'}} primary="Profile" />
          </ListItem>
          {user.admin && (
            <ListItem button component={Link} to="/admin">
              <ListItemText sx={{color:'white'}} primary="Admin Panel" />
            </ListItem>
          )}
          <ListItem button onClick={handleLogout}>
            <ListItemText sx={{color:'white'}} primary="Logout" />
          </ListItem>
        </>
      ) : (
        <>
          <ListItem button component={Link} to="/login">
            <ListItemText sx={{color:'white'}} primary="Login" />
          </ListItem>
          <ListItem button component={Link} to="/register">
            <ListItemText sx={{color:'white'}} primary="Register" />
          </ListItem>
        </>
      )}
    </Box>
  );

  return (
    <AppBar position="sticky" sx={{ backgroundColor: 'rgba(0,0,0,1)' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        {/* Logo */}
        <Box component={Link} to='/' sx={{ height: 40, width: 'auto', mr: 'auto' }}>
          <img src={logo} alt="Logo" style={{ height: '100%', width: 'auto' }} />
        </Box>

        {/* Star Rating (Visible on all screen sizes) */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#fff', mx: 2 }}>
          <Tooltip title="Rate this portal!">
            <IconButton onClick={handleRatingMenuOpen} sx={{ padding: 0 }}>
              <Rating value={averageRating} max={1} precision={0.1} readOnly sx={{ color: '#ffb400' }} />
            </IconButton>
          </Tooltip>
          <Typography variant="body2">{averageRating.toFixed(1)}</Typography>
        </Box>

        {/* Desktop Navigation (Unchanged) */}
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
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)', color: 'primary.main' },
                  transition: 'all 0.3s ease',
                  mr: 2,
                }}
              >
                {link.label}
              </Button>
            ))}
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
                <Button variant="contained" color="success" component={Link} to="/login" sx={{ mr: 2 }}>
                  Login
                </Button>
                <Button color="inherit" component={Link} to="/register">
                  Register
                </Button>
              </>
            )}
          </>
        )}

        {/* Mobile Hamburger Menu (Right-aligned) */}
        {isMobile && (
          <IconButton edge="end" color="inherit" onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
        )}

        {/* Rating Submission Menu */}
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
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {drawerContent}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
