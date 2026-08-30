import { useState, useEffect, useCallback, useMemo } from 'react';
import { listenMessages, sendMessage as sendMsg } from '@/services/chatService';
import type { ChatMessage } from '@/types/chat';

type UseChatResult = {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  sendMessage: (text: string) => Promise<void>;
};

export function useChat(
  conversationId: string,
  senderId: string,
  receiverId: string,
): UseChatResult {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = listenMessages(conversationId, (msgs) => {
      setMessages(msgs);
      setLoading(false);
    });
    return unsubscribe;
  }, [conversationId]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      try {
        await sendMsg(conversationId, senderId, receiverId, trimmed);
      } catch {
        setError('Não foi possível enviar a mensagem. Tente novamente.');
      }
    },
    [conversationId, senderId, receiverId],
  );

  const sortedMessages = useMemo(
    () => [...messages].sort((a, b) => a.createdAt - b.createdAt),
    [messages],
  );

  return { messages: sortedMessages, loading, error, sendMessage };
}
