import { Advising } from "../../components/admin/Advising";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <Advising />
    </div>
  );
}
