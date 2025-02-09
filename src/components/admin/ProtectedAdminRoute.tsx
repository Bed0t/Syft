import React, { Suspense } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../lib/admin/auth';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireSuperAdmin?: boolean;
}

const DefaultFallback = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-b-2 border-indigo-600"></div>
  </div>
);

export const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ 
  children, 
  fallback = <DefaultFallback />,
  requireSuperAdmin = false,
}) => {
  const { adminUser, loading, error } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return <>{fallback}</>;
  }

  if (error || !adminUser) {
    return (
      <Navigate 
        to="/admin/login" 
        state={{ 
          from: location,
          error: error?.message || 'Please log in to access this page'
        }} 
        replace 
      />
    );
  }

  if (requireSuperAdmin && adminUser.role !== 'super_admin') {
    return (
      <Navigate 
        to="/admin/dashboard" 
        state={{ 
          error: 'Super admin access required'
        }} 
        replace 
      />
    );
  }

  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};

export default ProtectedAdminRoute;