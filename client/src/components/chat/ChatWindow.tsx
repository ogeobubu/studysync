import { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHttp } from '../../api/useHttp';
import { format } from 'date-fns';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/card';
import { Skeleton } from '../../components/ui/skeleton';
import { ArrowLeft, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';
import noImage from "../../assets/noImage.jpg";

export const ChatWindow = () => {
    const { chatId } = useParams<{ chatId: string }>();
    const navigate = useNavigate();
    const [message, setMessage] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    
    const { 
        data: chatData, 
        isLoading: chatLoading, 
        error: chatError,
        refetch: refetchChat
    } = useHttp<{ chat: Chat; messages: Message[] }>({
        url: chatId ? `/chats/${chatId}` : '',
        enabled: !!chatId,
    });

    const { mutate: sendMessage, isPending: isSending } = useHttp<void, { content: string }>({
        url: chatId ? `/chats/${chatId}/messages` : '',
        method: 'POST',
    });

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatData?.data?.messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();

        if (!message.trim()) {
            toast.error('Cannot send empty message');
            return;
        }

        sendMessage(
            { content: message },
            {
                onSuccess: () => {
                    setMessage('');
                    refetchChat();
                    toast.success('Message sent successfully');
                },
                onError: (error: any) => {
                    toast.error(error.message || 'Failed to send message. Please try again later');
                }
            }
        );
    };

    // Redirect if chatId is undefined
    useEffect(() => {
        if (!chatId) {
            toast.error('Chat ID is missing');
            navigate('/chats');
        }
    }, [chatId, navigate]);

    if (!chatId) {
        return null; // or a loading spinner while redirect happens
    }

    if (chatLoading) {
        return <ChatWindowSkeleton />;
    }

    if (chatError || !chatData?.data) {
        return (
            <Card className="flex flex-col h-[600px] w-full max-w-3xl">
                <CardHeader>
                    <Button variant="ghost" size="icon" onClick={() => navigate('/chats')} className="mr-2">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <CardTitle>Chat</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex items-center justify-center">
                    <p className="text-destructive">{chatError?.message || 'Chat not found'}</p>
                </CardContent>
            </Card>
        );
    }

    const { chat, messages } = chatData?.data;
const currentUserIsStudent = messages?.length > 0 ? messages[0]?.sender?._id === chat.student?._id : false;
let otherUser = currentUserIsStudent ? chat.student : chat.advisor;

if (messages.length === 0) {
    otherUser = chat.advisor;
}

    return (
        <Card className="flex flex-col h-[600px] w-full max-w-3xl">
            <CardHeader className="border-b">
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/chats')}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <Avatar>
                        <AvatarImage 
                            src={otherUser?.profilePhoto && otherUser?.profilePhoto !== "default.jpg" ? otherUser.profilePhoto : noImage} 
                        />
                        <AvatarFallback>{otherUser?.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle>{otherUser?.name || 'Unknown User'}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            {chat.appointment ? 'Appointment chat' : 'General chat'}
                            {!chat.isActive && ' (Closed)'}
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground">No messages yet</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <MessageBubble 
                            key={msg?._id} 
                            message={msg} 
                            isCurrentUser={msg.sender?._id === chat.student?._id} 
                        />
                    ))
                )}
                <div ref={messagesEndRef} />
            </CardContent>

            <CardFooter className="border-t p-4">
                <form onSubmit={handleSendMessage} className="flex w-full space-x-2">
                    <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1"
                        disabled={isSending || !chat.isActive}
                    />
                    <Button 
                        type="submit" 
                        disabled={!message.trim() || isSending || !chat.isActive}
                        size="icon"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </CardFooter>
        </Card>
    );
};

const MessageBubble = ({ 
    message, 
    isCurrentUser 
}: { 
    message: Message; 
    isCurrentUser: boolean;
}) => (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-2`}>
        <div
            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                isCurrentUser
                    ? 'bg-blue-500 text-white' // Current user message style
                    : 'bg-gray-200 text-black'  // Other user message style
            }`}
        >
            <div className="flex items-center space-x-2 mb-1">
                <Avatar className="h-6 w-6">
                    <AvatarImage 
                        src={message.sender?.profilePhoto && message.sender?.profilePhoto !== "default.jpg" ? message.sender?.profilePhoto : noImage} 
                    />
                    <AvatarFallback>
                        {message.sender?.name?.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <span className="font-medium">{message.sender?.name}</span>
            </div>
            <p>{message.content}</p>
            <p className={`text-xs mt-1 ${isCurrentUser ? 'text-white/80' : 'text-gray-500'}`}>
                {format(new Date(message.timestamp), 'MMM d, h:mm a')}
            </p>
        </div>
    </div>
);

const ChatWindowSkeleton = () => (
    <Card className="flex flex-col h-[600px] w-full max-w-3xl">
        <CardHeader className="border-b">
            <div className="flex items-center space-x-4">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[120px]" />
                    <Skeleton className="h-3 w-[80px]" />
                </div>
            </div>
        </CardHeader>
        <CardContent className="flex-1 space-y-4 p-4">
            {[...Array(5)].map((_, i) => (
                <div 
                    key={i} 
                    className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}
                >
                    <Skeleton className="h-20 w-48 rounded-lg" />
                </div>
            ))}
        </CardContent>
        <CardFooter className="border-t p-4">
            <div className="flex w-full space-x-2">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-10" />
            </div>
        </CardFooter>
    </Card>
);

// Define interfaces for Message and Chat
interface Message {
    _id: string;
    content: string;
    sender: {
        _id: string;
        name: string;
        profilePhoto?: string;
    };
    timestamp: string;
}

interface Chat {
    _id: string;
    student: {
        _id: string;
        name: string;
        profilePhoto?: string;
    };
    advisor: {
        _id: string;
        name: string;
        profilePhoto?: string;
    };
    isActive: boolean;
    appointment?: {
        _id: string;
        date: string;
        time: string;
    };
    messages: Message[];
}