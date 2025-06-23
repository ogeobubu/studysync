import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Home,
  MessageSquareText,
  BookOpenText,
  LibraryBig,
  User,
  LogOut,
  GraduationCap,
  BarChart2,
  Settings,
  MessagesSquare,
  ClipboardList,
  Server,
  AlertCircle,
  Users
} from "lucide-react";
import { Button } from "../components/ui/button";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const renderStudentMenu = () => (
    <>
      <NavLink
        to="/student/dashboard"
        currentPath={location.pathname}
        icon={<Home className="h-5 w-5" />}
      >
        Dashboard
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
        to="/chats"
        currentPath={location.pathname}
        icon={<MessagesSquare className="h-5 w-5" />}
      >
        Chat with Advisor
      </NavLink>
      <NavLink
        to="/student/profile"
        currentPath={location.pathname}
        icon={<User className="h-5 w-5" />}
      >
        Profile
      </NavLink>
      <NavLink
        to="/student/settings"
        currentPath={location.pathname}
        icon={<Settings className="h-5 w-5" />}
      >
        Settings
      </NavLink>
    </>
  );

  const renderAdminMenu = () => (
    <>
      <div className="px-3 pt-4 pb-1">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Distributed</h3>
      </div>
      
      <NavLink
        to="/admin/advising-requests"
        currentPath={location.pathname}
        icon={<ClipboardList className="h-5 w-5" />}
      >
        Advising Requests
      </NavLink>
      <NavLink
        to="/admin/advisors"
        currentPath={location.pathname}
        icon={<Users className="h-5 w-5" />}
      >
        Advisors
      </NavLink>
      <NavLink
        to="/admin/students"
        currentPath={location.pathname}
        icon={<GraduationCap className="h-5 w-5" />}
      >
        Students
      </NavLink>
      
      <div className="px-3 pt-4 pb-1">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Management</h3>
      </div>
      
      <NavLink
        to="/admin/dashboard"
        currentPath={location.pathname}
        icon={<Home className="h-5 w-5" />}
      >
        Dashboard
      </NavLink>
      <NavLink
        to="/chats"
        currentPath={location.pathname}
        icon={<MessagesSquare className="h-5 w-5" />}
      >
        Messages
      </NavLink>
      <NavLink
        to="/admin/settings"
        currentPath={location.pathname}
        icon={<Settings className="h-5 w-5" />}
      >
        System Settings
      </NavLink>
    </>
  );

  return (
    <div className="w-72 bg-white p-4 flex flex-col h-full">
      <div className="mb-8 p-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          <span>{user?.name || (user?.role === "admin" ? "System Admin" : "Student")}</span>
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {user?.role === "admin" ? "System Administrator" : user?.matricNumber || ""}
        </p>
      </div>
      
      <nav className="space-y-1 flex-1">
        {user?.role === "admin" ? renderAdminMenu() : renderStudentMenu()}
      </nav>

      <div className="mt-auto p-4">
        <Button 
          onClick={handleLogout}
          variant="outline"
          className="w-full flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
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
          ? "bg-primary/10 text-primary"
          : "hover:bg-gray-100 text-gray-700"
      }`}
    >
      <span className="mr-3">{icon}</span>
      {children}
    </Link>
  );
}