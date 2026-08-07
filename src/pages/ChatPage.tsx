import { useParams } from "react-router-dom";
import { PiChatsCircleLight } from "react-icons/pi";
import { ConversationList } from "../components/chat/ConversationList";
import { MessageThread } from "../components/chat/MessageThread";
import { useConversations } from "../lib/use-conversations";

export default function ChatPage() {
  const { conversationId } = useParams();
  const { data: conversations } = useConversations();

  const activeConversation = conversations?.find(
    (c) => c.id === conversationId,
  );

  return (
    <div className="w-full flex flex-col lg:flex-row gap-3 text-white">
      <ConversationList activeId={conversationId} />

      {conversationId ? (
        <MessageThread
          key={conversationId}
          conversationId={conversationId}
          otherParticipant={activeConversation?.otherParticipant}
        />
      ) : (
        <div className="flex-1 hidden lg:flex flex-col items-center justify-center gap-3 bg-black/60 rounded-2xl border border-white/15 h-150 text-center">
          <div className="p-4 bg-gray-700/50 w-fit rounded-2xl">
            <PiChatsCircleLight size="30" />
          </div>
          <div className="font-bold text-gray-200/80">
            Izaberi razgovor da počneš
          </div>
        </div>
      )}
    </div>
  );
}
