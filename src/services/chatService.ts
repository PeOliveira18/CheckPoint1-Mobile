import {
  ref,
  push,
  set,
  get,
  query,
  orderByChild,
  onValue,
  off,
} from 'firebase/database';
import { database } from './firebase';
import type { Conversation, ChatMessage } from '@/types/chat';

function buildConversationId(uid1: string, uid2: string): string {
  return [uid1, uid2].sort().join('_');
}

export async function getOrCreateConversation(
  uid1: string,
  uid2: string,
): Promise<Conversation> {
  const id = buildConversationId(uid1, uid2);
  const convRef = ref(database, `conversations/${id}`);
  const snapshot = await get(convRef);

  if (snapshot.exists()) {
    return snapshot.val() as Conversation;
  }

  const newConversation: Conversation = {
    id,
    participants: [uid1, uid2],
    createdAt: Date.now(),
  };
  await set(convRef, newConversation);
  return newConversation;
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  receiverId: string,
  text: string,
): Promise<void> {
  const messagesRef = ref(database, `messages/${conversationId}`);
  const newMsgRef = push(messagesRef);
  const id = newMsgRef.key ?? Date.now().toString();

  const message: ChatMessage = {
    id,
    conversationId,
    senderId,
    receiverId,
    text,
    createdAt: Date.now(),
  };
  await set(newMsgRef, message);
}

export function listenMessages(
  conversationId: string,
  callback: (messages: ChatMessage[]) => void,
): () => void {
  const messagesRef = query(
    ref(database, `messages/${conversationId}`),
    orderByChild('createdAt'),
  );

  onValue(messagesRef, (snapshot) => {
    const result: ChatMessage[] = [];
    snapshot.forEach((child) => {
      result.push(child.val() as ChatMessage);
    });
    callback(result);
  });

  return () => off(messagesRef);
}
