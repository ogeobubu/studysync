import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Home,
  MessageSquareText,
  BookOpenText,
  LibraryBig,
  User,
} from "lucide-react";

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div className="w-72 bg-white p-4">
      <div className="mb-8 p-4">
        <h2 className="text-xl font-bold">{user?.name || "Student"}</h2>
      </div>
      <nav className="space-y-1">
        <NavLink
          to="/student/dashboard"
          currentPath={location.pathname}
          icon={<Home className="h-5 w-5" />}
        >
          Home
        </NavLink>
        <NavLink
          to="/student/advising"
          currentPath={location.pathname}
          icon={<MessageSquareText className="h-5 w-5" />}
        >
          Advising
        </NavLink>
        <NavLink
          to="/student/academics"
          currentPath={location.pathname}
          icon={<BookOpenText className="h-5 w-5" />}
        >
          Academics
        </NavLink>
        <NavLink
          to="/student/recommendations"
          currentPath={location.pathname}
          icon={<LibraryBig className="h-5 w-5" />}
        >
          Recommendations
        </NavLink>
        <NavLink
          to="/student/profile"
          currentPath={location.pathname}
          icon={<User className="h-5 w-5" />}
        >
          Profile
        </NavLink>
      </nav>
    </div>
  );
}

function NavLink({
  to,
  currentPath,
  icon,
  children,
}: {
  to: string;
  currentPath: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const isActive = currentPath.startsWith(to);

  return (
    <Link
      to={to}
      className={`flex items-center p-3 rounded-lg font-medium transition-colors ${
        isActive
          ? "bg-gray-100 text-gray-600"
          : "hover:bg-gray-100 text-gray-700"
      }`}
    >
      <span className="mr-3">{icon}</span>
      {children}
    </Link>
  );
}
