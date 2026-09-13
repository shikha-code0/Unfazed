import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('unfazed_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('unfazed_token') || null);
  const [loading, setLoading] = useState(true);

  // Validate token on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.therapist);
            localStorage.setItem('unfazed_user', JSON.stringify(res.data.therapist));
          }
        } catch (err) {
          console.error('Token validation failed:', err);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.therapist);
      localStorage.setItem('unfazed_token', res.data.token);
      localStorage.setItem('unfazed_user', JSON.stringify(res.data.therapist));
    }
    return res.data;
  };

  const register = async (data) => {
    const res = await api.post('/auth/register', data);
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.therapist);
      localStorage.setItem('unfazed_token', res.data.token);
      localStorage.setItem('unfazed_user', JSON.stringify(res.data.therapist));
    }
    return res.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('unfazed_token');
    localStorage.removeItem('unfazed_user');
  };

  const updateProfile = async (updates) => {
    const res = await api.put('/therapists/me', updates);
    if (res.data.success) {
      setUser(res.data.therapist);
      localStorage.setItem('unfazed_user', JSON.stringify(res.data.therapist));
    }
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
