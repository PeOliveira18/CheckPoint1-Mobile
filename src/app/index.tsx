import React, { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/contexts/AuthContext';
import LoginScreen from '@/screens/LoginScreen';
import UsersScreen from '@/screens/UsersScreen';
import ChatScreen from '@/screens/ChatScreen';
import { Loading } from '@/components/Loading';
import { getOrCreateConversation } from '@/services/chatService';
import type { ChatUser } from '@/types/user';

type Screen =
  | { name: 'users' }
  | { name: 'chat'; conversationId: string; otherUser: ChatUser };

function AppContent() {
  const { user, loading } = useAuth();
  const [screen, setScreen] = useState<Screen>({ name: 'users' });
  const [chatLoading, setChatLoading] = useState(false);

  const handleSelectUser = useCallback(
    async (otherUser: ChatUser) => {
      if (!user) return;
      setChatLoading(true);
      try {
        const conversation = await getOrCreateConversation(user.uid, otherUser.uid);
        setScreen({ name: 'chat', conversationId: conversation.id, otherUser });
      } catch (err) {
        const msg = (err as { message?: string }).message ?? 'Erro ao abrir conversa.';
        Alert.alert('Erro', msg);
      } finally {
        setChatLoading(false);
      }
    },
    [user],
  );

  const handleBack = useCallback(() => {
    setScreen({ name: 'users' });
  }, []);

  if (loading || chatLoading) return <Loading />;
  if (!user) return <LoginScreen />;
  if (screen.name === 'chat') {
    return (
      <ChatScreen
        conversationId={screen.conversationId}
        otherUser={screen.otherUser}
        onBack={handleBack}
      />
    );
  }
  return <UsersScreen onSelectUser={handleSelectUser} />;
}

export default function HomeScreen() {
  return (
    <>
      <StatusBar style="light" />
      <AppContent />
    </>
  );
}
