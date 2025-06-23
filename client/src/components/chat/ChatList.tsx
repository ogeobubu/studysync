import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar';
import { Skeleton } from '../../components/ui/skeleton';
import { MessageSquare, Plus } from 'lucide-react';
import { useHttp } from '../../api/useHttp';
import noImage from "../../assets/noImage.jpg"

export const ChatList = () => {
  const navigate = useNavigate();
  
  // Fetch chats using useHttp GET
  const { 
    data: chatsData, 
    isLoading: chatsLoading, 
    error: chatsError 
  } = useHttp<{ data: Chat[] }>({
    url: '/chats',  // Direct endpoint as per your backend
  });

  // Fetch advisors using useHttp GET
  const { 
    data: advisorsData, 
    isLoading: advisorsLoading, 
    error: advisorsError 
  } = useHttp<{ data: User[] }>({
    url: '/users?role=advisor',
  });

  // Start new chat mutation - note the separate config
  const { mutate: startChat, isPending: isStartingChat } = useHttp<
    { data: Chat }, 
    { advisorId: string }
  >({
    url: '/chats/start',  // Base URL without the ID
    method: 'POST',
  });

  const handleStartChat = (advisorId: string) => {
    startChat(
      { advisorId },  // This will be sent as the request body
      {
        onSuccess: (data) => {
          navigate(`/chats/${data.data._id}`);
        }
      }
    );
  };

  if (chatsLoading || advisorsLoading) {
    return (
      <div className="space-y-6">
        <ChatListSkeleton />
        <AdvisorsListSkeleton />
      </div>
    );
  }

  if (chatsError || advisorsError) {
    // Errors are already handled by useHttp's global error handler
    return <div className="text-center py-4 text-destructive">Error loading data</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            My Chats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {chatsData?.data?.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No active chats</p>
          ) : (
            chatsData?.data?.map((chat) => (
              <ChatListItem 
                key={chat._id} 
                chat={chat} 
                onClick={() => navigate(`/chats/${chat._id}`)}
              />
            ))
          )}
        </CardContent>
      </Card>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Start New Chat
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {advisorsData?.data?.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No advisors available</p>
          ) : (
            advisorsData?.data?.map((advisor) => (
              <AdvisorListItem
                key={advisor._id}
                advisor={advisor}
                onClick={() => handleStartChat(advisor._id)}
                disabled={isStartingChat}
              />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Sub-components for better organization
const ChatListItem = ({ chat, onClick }: { chat: Chat; onClick: () => void }) => (
  <Button variant="ghost" className="w-full justify-start h-auto p-3" onClick={onClick}>
    <div className="flex items-center space-x-3">
      <Avatar>
        <AvatarImage src={chat.advisor.profilePhoto !== "default.jpg" ? chat.advisor.profilePhoto : noImage} />
        <AvatarFallback>{chat.advisor.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="text-left">
        <p className="font-medium">{chat.advisor.name}</p>
        <p className="text-sm text-muted-foreground">
          {chat.appointment ? 'Appointment chat' : 'General chat'}
        </p>
      </div>
    </div>
  </Button>
);

const AdvisorListItem = ({ 
  advisor, 
  onClick, 
  disabled 
}: { 
  advisor: User; 
  onClick: () => void;
  disabled: boolean;
}) => (
  <Button 
    variant="ghost" 
    className="w-full justify-start h-auto p-3"
    onClick={onClick}
    disabled={disabled}
  >
    <div className="flex items-center space-x-3">
      <Avatar>
        <AvatarImage src={advisor.profilePhoto !== "default.jpg" ? advisor.profilePhoto : noImage} />
        <AvatarFallback>{advisor.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="text-left">
        <p className="font-medium">{advisor.name}</p>
        <p className="text-sm text-muted-foreground">Advisor</p>
      </div>
    </div>
  </Button>
);

const ChatListSkeleton = () => (
  <Card className="w-full max-w-md">
    <CardHeader>
      <CardTitle>My Chats</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </div>
      ))}
    </CardContent>
  </Card>
);

const AdvisorsListSkeleton = () => (
  <Card className="w-full max-w-md">
    <CardHeader>
      <CardTitle>Start New Chat</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </div>
      ))}
    </CardContent>
  </Card>
);