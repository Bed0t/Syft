import React, { Suspense } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../lib/admin/auth';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ 
  children, 
  fallback = <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
  </div>
}) => {
  const { adminUser, loading, error } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return fallback;
  }

  if (error) {
    return <Navigate to="/admin/login" state={{ error: error.message }} replace />;
  }

  if (!adminUser) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Suspense fallback={fallback}>{children}</Suspense>;
};