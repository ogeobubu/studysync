import { Students } from "../../components/admin/Students";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <Students />
    </div>
  );
}
