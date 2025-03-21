import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import './App.css';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import Courses from './pages/Courses';
import Books from './pages/Books';
import ComingSoon from './pages/ComingSoon';
import SingleCourse from './pages/SingleCourse';
import AddBook from './pages/AddBook';
import AddCourse from './pages/AddCourse';
import ManageCourses from './pages/ManageCourses';
import ManageUsers from './pages/ManageUsers';
import AddProfessor from './pages/AddProfessor';
import { AuthProvider } from './contexts/AuthContext';
import darkTheme from './theme';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
// import Community from './pages/Community';

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes with Layout */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout>
                    <Home />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <Layout>
                    <AdminDashboard />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/courses"
              element={
                <PrivateRoute>
                  <Layout>
                    <Courses />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/books"
              element={
                <PrivateRoute>
                  <Layout>
                    <Books />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/courses/:courseCode"
              element={
                <PrivateRoute>
                  <Layout>
                    <SingleCourse />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/add-course"
              element={
                <PrivateRoute>
                  <Layout>
                    <AddCourse />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/add-book"
              element={
                <PrivateRoute>
                  <Layout>
                    <AddBook />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/manage-users"
              element={
                <PrivateRoute>
                  <Layout>
                    <ManageUsers />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/manage-courses"
              element={
                <PrivateRoute>
                  <Layout>
                    <ManageCourses />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/addProfessor/:courseCode"
              element={
                <PrivateRoute>
                  <Layout>
                    <AddProfessor />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/community"
              element={
                <PrivateRoute>
                  <Layout>
                    <ComingSoon />
                  </Layout>
                </PrivateRoute>
              }
            />
            {/* Redirect any unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
