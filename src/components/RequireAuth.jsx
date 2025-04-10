import React from 'react';
import { useAuth } from '../auth';
import { Navigate } from 'react-router-dom';

export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-6">Checking authentication...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}