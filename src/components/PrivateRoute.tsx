
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

type PrivateRouteProps = {
  allowedRoles?: UserRole[];
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles = [] }) => {
  const { state } = useAuth();
  const { isAuthenticated, user, loading } = state;

  // Show loading state if authentication is still being checked
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-job-blue-200 border-t-job-blue-600 mx-auto"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // If allowed roles are specified, check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
