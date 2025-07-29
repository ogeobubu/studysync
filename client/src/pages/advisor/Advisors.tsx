import { Advisors } from "../../components/admin/Advisors";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <Advisors />
    </div>
  );
}
