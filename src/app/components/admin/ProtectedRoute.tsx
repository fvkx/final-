import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authApi } from '../../lib/adminApi';

export function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authData = localStorage.getItem('balingasag_admin_auth');
        if (!authData) throw new Error('No token');
        
        await authApi.verifyToken();
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
}
