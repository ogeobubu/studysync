import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import AcademicConnectLogo from '../components/AcademicConnectLogo';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-md p-8 sm:p-10">
          <div className="flex flex-col items-center mb-8">
            <AcademicConnectLogo className="h-12 w-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 text-center">
              Academic Connect
            </h1>
            <p className="text-gray-500 text-center mt-2">
              Connecting students with academic success
            </p>
          </div>
          
          <Outlet /> {/* This renders the child routes (Login, Register, etc.) */}
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <Link 
              to="/login" 
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Back to login
            </Link>
          </div>
        </div>
        
        <div className="mt-8 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Academic Connect. All rights reserved.
        </div>
      </div>
    </div>
  );
}