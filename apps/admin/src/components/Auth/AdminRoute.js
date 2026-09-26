import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

const AdminRoute = ({ children, requireSuperAdmin = false }) => {
  const location = useLocation();
  const { user, isAdmin, isSuperAdmin, loading } = useAdminAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#f5f7f6',
        color: '#2c5530',
        fontWeight: 600,
        fontSize: 15
      }}>
        Chargement de l'espace administrateur...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  if (requireSuperAdmin && !isSuperAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
