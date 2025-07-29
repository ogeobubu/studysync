// client/src/components/ProtectedRoute/RoleProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';

export default function RoleProtectedRoute({ allowedRoles }: { allowedRoles: Role[] }) {
  const { user, loading } = useAuth();

  // Show loading while auth is being initialized
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated but not authorized for this role, redirect to unauthorized
  if (!allowedRoles.includes(user.role as Role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If authenticated and authorized, render the protected content
  return <Outlet />;
}