import { Route, Routes } from 'react-router-dom';
import Dashboard from '../pages/student/Dashboard';
import Advising from '../pages/student/Advising';
import AdvisingRequest from '../pages/student/AdvisingRequest';
import AcademicsPage from '../pages/student/AcademicsPage';
import Recommendations from '../pages/student/Recommendations';
import Profile from '../pages/student/Profile';
import RoleProtectedRoute from '../components/ProtectedRoute/RoleProtectedRoute';
import { Role } from '../types/user';

export default function StudentRoutes() {
  return (
    <Routes>
      <Route element={<RoleProtectedRoute allowedRoles={[Role.STUDENT]} />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="advising" element={<Advising />} />
        <Route path="request-advising" element={<AdvisingRequest />} />
        <Route path="academics" element={<AcademicsPage />} />
        <Route path="recommendations" element={<Recommendations />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}