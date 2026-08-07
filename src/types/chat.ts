// features/chat/types.ts
export interface ChatUser {
  id: string;
  username: string;
  avatarUrl?: string | null;
}

export interface Message {
  id: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender: ChatUser;
  conversation?: {
    id: string;
    participantOne: ChatUser;
    participantTwo: ChatUser;
  };
}

export interface ConversationSummary {
  id: string;
  otherParticipant: ChatUser;
  lastMessage: Message | null;
  unreadCount: number;
  updatedAt: string;
}

export interface MessagesPage {
  messages: Message[];
  hasMore: boolean;
}

export const chatKeys = {
  all: ["chat"] as const,
  conversations: () => [...chatKeys.all, "conversations"] as const,
  messages: (conversationId: string) =>
    [...chatKeys.all, "messages", conversationId] as const,
};
