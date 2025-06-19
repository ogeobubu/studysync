import { Route, Routes } from 'react-router-dom';
import SystemAdminPage from '../pages/admin/SystemAdminPage';
import RoleProtectedRoute from '../components/ProtectedRoute/RoleProtectedRoute';
import { Role } from '../types/user';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<RoleProtectedRoute allowedRoles={[Role.ADMIN]} />}>
        <Route path="system" element={<SystemAdminPage />} />
      </Route>
    </Routes>
  );
}