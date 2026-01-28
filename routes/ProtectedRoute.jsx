import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';


/**
 * A wrapper component that handles conditional redirection.
 * Useful for guarding routes based on authentication or other conditions.
 */
const ProtectedRoute = ({ 
  isAllowed, 
  redirectTo, 
  children 
}) => {
  if (!isAllowed) {
    return <Navigate to={redirectTo} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
