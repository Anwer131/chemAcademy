import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import Courses from './pages/Courses';
import Books from './pages/Books';
import SingleCourse from './pages/SingleCourse';
import AddBook from './pages/AddBook';
import AddCourse from './pages/AddCourse';
import ManageCourses from './pages/ManageCourses';
import ManageUsers from './pages/ManageUsers';
import { AuthProvider } from './contexts/AuthContext';
import darkTheme from './theme';

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/books" element={<Books />} />
            <Route path="/courses/:courseCode" element={<SingleCourse />} />
            <Route path="/admin/add-course" element={<AddCourse />} />
            <Route path="/admin/add-book" element={<AddBook />} />
            <Route path="/admin/manage-users" element={<ManageUsers />} />
            <Route path="/admin/manage-courses" element={<ManageCourses />} />  
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
