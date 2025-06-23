import { useHttp } from '../../api/useHttp';
import { ChatList } from '../../components/chat/ChatList';

export default function ChatListPage() {
  const { data } = useHttp<{ data: Chat[] }>({
    url: '/chats',
  });

  return (
    <div className="h-full overflow-y-auto">
      <ChatList chats={data?.data || []} />
    </div>
  );
}