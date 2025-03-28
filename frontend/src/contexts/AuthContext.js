import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = "https://chemacademy.onrender.com"

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
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
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Invalid credentials. Please try again.';
      throw new Error(errorMessage); // Throw error with message
    }
  };
  
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    setEnrolledCourses([]); // Optionally clear enrolled courses when logging out
  };

  const checkAuth = useCallback(async () => {
    setLoading(true);
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
    setLoading(false);
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
        loadEnrolledCourses,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
