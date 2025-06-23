import { Outlet, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from "../context/AuthContext"

export default function ChatLayout() {
const { user } = useAuth()
  const navigate = useNavigate();
  const isChatList = location.pathname === '/chats';

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header with back button */}
      <header className="border-b p-4 flex items-center gap-4">
        {!isChatList ? (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/chats')}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        ) : <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(user?.role === "admin" ? "/admin/dashboard" : user?.role === "advisor" ? "/advisor/dashboard" : '/student/dashboard')}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>}
        <h1 className="text-xl font-semibold">
          {isChatList ? 'Messages' : 'Chat'}
        </h1>
      </header>

      {/* Main content area */}
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}