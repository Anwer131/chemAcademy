import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const register = async (userData) => {
    try {
      await axios.post('http://localhost:5000/auth/signup', userData);
    } catch (err) {
      console.error('Registration Error:', err.response ? err.response.data : err.message);
      throw err;
    }
  };
  
  const login = async (username, password) => {
    try {
      const res = await axios.post('http://localhost:5000/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
    } catch (err) {
      console.error('Login Error:', err.response ? err.response.data : err.message);
      throw err;
    }
  };
  
  

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const checkAuth = async () => {
    if (token) {
      try {
        const res = await axios.get('http://localhost:5000/auth/checkJWTToken', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        logout();
      }
    }
  };
  const updateProfile = async (formData) => {
    try {
      const res = await axios.put('http://localhost:5000/profile/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUser(res.data.user);
    } catch (err) {
      console.error('Profile Update Error:', err);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout,updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
