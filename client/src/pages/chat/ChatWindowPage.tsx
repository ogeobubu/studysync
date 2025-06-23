import { useParams } from 'react-router-dom';
import { useHttp } from '../../api/useHttp';
import { ChatWindow } from '../../components/chat/ChatWindow';

export default function ChatWindowPage() {
  const { chatId } = useParams();
  const { data } = useHttp<{ data: Chat }>({
    url: `/chats/${chatId}`,
  });

  return (
    <div className="h-full">
      {data?.data && <ChatWindow chat={data.data} />}
    </div>
  );
}