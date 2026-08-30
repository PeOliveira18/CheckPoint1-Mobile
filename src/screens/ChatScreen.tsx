import React, { useRef, useEffect } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/hooks/useChat';
import { ChatMessageItem } from '@/components/ChatMessageItem';
import { ChatInput } from '@/components/ChatInput';
import { Loading } from '@/components/Loading';
import { ErrorMessage } from '@/components/ErrorMessage';
import type { ChatUser } from '@/types/user';
import type { ChatMessage } from '@/types/chat';

type Props = {
  conversationId: string;
  otherUser: ChatUser;
  onBack: () => void;
};

export default function ChatScreen({ conversationId, otherUser, onBack }: Props) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const flatListRef = useRef<FlatList<ChatMessage>>(null);

  const { messages, loading, error, sendMessage } = useChat(
    conversationId,
    user?.uid ?? '',
    otherUser.uid,
  );

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  if (!user) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{otherUser.name}</Text>
          <Text style={styles.headerProvider}>{otherUser.provider}</Text>
        </View>
      </View>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <Loading />
      ) : messages.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Nenhuma mensagem ainda.</Text>
          <Text style={styles.emptyHint}>Diga olá para começar a conversa! 👋</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatMessageItem message={item} isMine={item.senderId === user.uid} />
          )}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />
      )}

      <ChatInput onSend={sendMessage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 10,
    backgroundColor: '#2563eb',
  },
  backBtn: {
    paddingRight: 12,
  },
  backText: {
    color: '#ffffff',
    fontSize: 15,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerProvider: {
    fontSize: 12,
    color: '#bfdbfe',
    marginTop: 1,
  },
  messageList: {
    paddingVertical: 12,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2328',
    textAlign: 'center',
  },
  emptyHint: {
    fontSize: 14,
    color: '#57606a',
    textAlign: 'center',
    marginTop: 8,
  },
});
