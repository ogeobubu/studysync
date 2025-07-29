import WelcomeHeader from '../../components/student/WelcomeHeader';
import {DashboardContent} from '../../components/advisor/Dashboard';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
      <div className="space-y-8">
        <WelcomeHeader name={user?.name} />
        <DashboardContent />
      </div>
  );
}