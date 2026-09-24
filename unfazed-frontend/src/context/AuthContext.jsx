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
          // If we have a role in localStorage, we can use it to determine which endpoint to hit
          const role = localStorage.getItem('unfazed_role') || 'therapist';
          
          if (role === 'client') {
            const res = await api.get('/auth/client/me');
            if (res.data.success) {
              setUser({ ...res.data.client, role: 'client' });
              localStorage.setItem('unfazed_user', JSON.stringify({ ...res.data.client, role: 'client' }));
            }
          } else {
            const res = await api.get('/auth/me');
            if (res.data.success) {
              setUser({ ...res.data.therapist, role: 'therapist' });
              localStorage.setItem('unfazed_user', JSON.stringify({ ...res.data.therapist, role: 'therapist' }));
            }
          }
        } catch (err) {
          console.error('Token validation failed:', err);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser({ ...res.data.therapist, role: 'therapist' });
      localStorage.setItem('unfazed_token', res.data.token);
      localStorage.setItem('unfazed_role', 'therapist');
      localStorage.setItem('unfazed_user', JSON.stringify({ ...res.data.therapist, role: 'therapist' }));
    }
    return res.data;
  };

  const loginClient = async (email, password) => {
    const res = await api.post('/auth/client/login', { email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser({ ...res.data.client, role: 'client' });
      localStorage.setItem('unfazed_token', res.data.token);
      localStorage.setItem('unfazed_role', 'client');
      localStorage.setItem('unfazed_user', JSON.stringify({ ...res.data.client, role: 'client' }));
    }
    return res.data;
  };

  const register = async (data) => {
    const res = await api.post('/auth/register', data);
    if (res.data.success) {
      setToken(res.data.token);
      setUser({ ...res.data.therapist, role: 'therapist' });
      localStorage.setItem('unfazed_token', res.data.token);
      localStorage.setItem('unfazed_role', 'therapist');
      localStorage.setItem('unfazed_user', JSON.stringify({ ...res.data.therapist, role: 'therapist' }));
    }
    return res.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('unfazed_token');
    localStorage.removeItem('unfazed_user');
    localStorage.removeItem('unfazed_role');
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
    <AuthContext.Provider value={{ user, token, loading, login, loginClient, register, logout, updateProfile }}>
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
