import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';

const ProtectedRoute = ({ allowedRole = 'therapist' }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <div className="flex flex-col items-center gap-3">
          <Loader size="lg" color="primary" />
          <p className="text-xs text-slate font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={allowedRole === 'client' ? '/client/login' : '/login'} replace />;
  }

  if (user.role !== allowedRole) {
    return <Navigate to={user.role === 'client' ? '/portal' : '/dashboard'} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
