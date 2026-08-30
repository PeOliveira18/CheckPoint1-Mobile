import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ChatMessage as ChatMessageType } from '@/types/chat';

type Props = {
  message: ChatMessageType;
  isMine: boolean;
};

export function ChatMessageItem({ message, isMine }: Props) {
  return (
    <View style={[styles.wrapper, isMine ? styles.wrapperRight : styles.wrapperLeft]}>
      <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleOther]}>
        <Text style={[styles.text, isMine ? styles.textMine : styles.textOther]}>
          {message.text}
        </Text>
        <Text style={styles.time}>
          {new Date(message.createdAt).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  wrapperRight: {
    alignItems: 'flex-end',
  },
  wrapperLeft: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: 16,
    padding: 10,
  },
  bubbleMine: {
    backgroundColor: '#2563eb',
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: '#e5e7eb',
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 15,
  },
  textMine: {
    color: '#ffffff',
  },
  textOther: {
    color: '#1f2328',
  },
  time: {
    fontSize: 10,
    marginTop: 4,
    color: '#94a3b8',
    alignSelf: 'flex-end',
  },
});
