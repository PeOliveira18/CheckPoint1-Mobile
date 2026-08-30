import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { ChatUser } from '@/types/user';

const PROVIDER_LABEL: Record<string, string> = {
  password: 'E-mail/Senha',
  google: 'Google',
  apple: 'Apple',
};

type Props = {
  user: ChatUser;
  onPress: (user: ChatUser) => void;
};

export function UserItem({ user, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(user)}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.provider}>{PROVIDER_LABEL[user.provider] ?? user.provider}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2328',
  },
  provider: {
    fontSize: 13,
    color: '#57606a',
    marginTop: 2,
  },
});
