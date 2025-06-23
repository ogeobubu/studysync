import { Link } from 'react-router-dom';
import { MessageSquareText, FileText } from 'lucide-react';

export default function QuickLinks() {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
      <div className="flex gap-4">
        <QuickLink 
          to="/student/request-advising" 
          icon={<MessageSquareText className="h-5 w-5" />}
        >
          Request Advising
        </QuickLink>
        <QuickLink 
          to="/student/academics" 
          icon={<FileText className="h-5 w-5" />}
        >
          View Academic Records
        </QuickLink>
      </div>
    </div>
  );
}

function QuickLink({ 
  to, 
  icon,
  children 
}: { 
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link 
      to={to}
      className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all w-full max-w-xs border border-gray-100 hover:border-blue-100"
    >
      <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
        {icon}
      </div>
      <span className="font-medium text-gray-800">{children}</span>
    </Link>
  );
}