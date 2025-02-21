import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from './scrollToTop';

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <ScrollToTop />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
