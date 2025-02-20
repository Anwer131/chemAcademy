import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const register = async (userData) => {
    try {
      await axios.post(`${API_URL}/auth/signup`, userData);
    } catch (err) {
      console.error('Registration Error:', err.response ? err.response.data : err.message);
      throw err;
    }
  };
  
  const login = async (username, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { username, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      console.log("Login successful, token saved in local storage");
    } catch (err) {
      console.error('Login Error:', err.response ? err.response.data : err.message);
      throw err;
    }
  };
  
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    setEnrolledCourses([]); // Optionally clear enrolled courses when logging out
  };

  const checkAuth = useCallback(async () => {
    if (token) {
      try {
        const res = await axios.get(`${API_URL}/auth/checkJWTToken`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        logout();
      }
    }
  }, [token]);

  const loadEnrolledCourses = useCallback(async () => {
    if (token) {
      try {
        const res = await axios.get(`${API_URL}/users/enrolled-courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEnrolledCourses(res.data);
      } catch (error) {
        console.error('Error loading enrolled courses:', error);
      }
    }
  }, [token]);

  // ✅ useEffect for checking authentication with dependencies
  useEffect(() => {
    checkAuth(); // Runs when token or checkAuth reference changes
  }, [checkAuth]);

  // ✅ useEffect for loading enrolled courses with dependencies
  useEffect(() => {
    loadEnrolledCourses(); // Runs when token or loadEnrolledCourses reference changes
  }, [loadEnrolledCourses]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        enrolledCourses,
        setEnrolledCourses,
        token,
        login,
        register,
        logout,
        loadEnrolledCourses
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
