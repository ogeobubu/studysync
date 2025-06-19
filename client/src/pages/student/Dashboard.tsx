import WelcomeHeader from '../../components/student/WelcomeHeader';
import QuickLinks from '../../components/student/QuickLinks';
import UpcomingAppointments from '../../components/student/UpcomingAppointments';
import { useAuth } from '../../context/AuthContext';

export default function StudentDashboard() {
  const { user } = useAuth();

  return (
      <div className="space-y-8">
        <WelcomeHeader name={user?.name} />
        <QuickLinks />
        <UpcomingAppointments />
      </div>
  );
}