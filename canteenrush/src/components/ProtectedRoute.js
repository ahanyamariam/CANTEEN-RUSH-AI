import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner message="SYNCING_USER_DATA" />;
  if (!user) return <Navigate to="/login" replace />;
  
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'vendor' ? '/vendor/dashboard' : '/student/dashboard'} replace />;
  }

  // Uses the theme background instead of the dark gray
  return <div className="min-h-screen bg-ferro-offwhite">{children}</div>;
}