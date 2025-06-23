import { Route, Routes } from 'react-router-dom';
import DashboardPage from '../pages/admin/Dashboard';
import Advising from '../pages/admin/Advising';
import Advisors from '../pages/admin/Advisors';
import Students from '../pages/admin/Students';
import Settings from '../pages/admin/SettingsPage';
import RoleProtectedRoute from '../components/ProtectedRoute/RoleProtectedRoute';
import { Role } from '../types/user';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<RoleProtectedRoute allowedRoles={[Role.ADMIN]} />}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="advising-requests" element={<Advising />} />
        <Route path="advisors" element={<Advisors />} />
        <Route path="students" element={<Students />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}