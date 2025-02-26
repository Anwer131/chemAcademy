import React, { useState, useEffect } from 'react';
import { Fab } from '@mui/material'; // Material UI Floating Action Button
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {

  const {pathname} = useLocation();
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'auto', // Use 'smooth' if you want animation on route change too
    });
  }, [pathname]);

  return (
    visible && (
      <Fab 
        color="primary" 
        onClick={scrollToTop} 
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <KeyboardArrowUpIcon />
      </Fab>
    )
  );
};

export default ScrollToTop;
