import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { getUsersByProvider } from '@/services/userService';
import { getCompatibleProviders } from '@/utils/chatRules';
import { UserItem } from '@/components/UserItem';
import { Loading } from '@/components/Loading';
import { ErrorMessage } from '@/components/ErrorMessage';
import type { ChatUser } from '@/types/user';

type Props = {
  onSelectUser: (user: ChatUser) => void;
};

export default function UsersScreen({ onSelectUser }: Props) {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const [contacts, setContacts] = useState<ChatUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const compatibleProviders = useMemo(
    () => (user ? getCompatibleProviders(user.provider) : []),
    [user],
  );

  const loadUsers = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.all(
        compatibleProviders.map((p) => getUsersByProvider(p)),
      );
      const all = results.flat().filter((u) => u.uid !== user.uid);
      setContacts(all);
    } catch {
      setError('Não foi possível carregar os contatos.');
    } finally {
      setLoading(false);
    }
  }, [user, compatibleProviders]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  if (!user) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View>
          <Text style={styles.headerTitle}>Contatos</Text>
          <Text style={styles.headerSub}>Olá, {user.name}</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <Loading />
      ) : contacts.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Nenhum contato disponível.</Text>
          <Text style={styles.emptyHint}>
            Aguarde outro usuário se cadastrar com um provedor compatível.
          </Text>
          <TouchableOpacity style={styles.retryBtn} onPress={loadUsers}>
            <Text style={styles.retryText}>Atualizar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={contacts}
          keyExtractor={(item) => item.uid}
          renderItem={({ item }) => (
            <UserItem user={item} onPress={onSelectUser} />
          )}
          contentContainerStyle={styles.list}
        />
      )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#2563eb',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSub: {
    fontSize: 13,
    color: '#bfdbfe',
    marginTop: 2,
  },
  logoutBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    paddingTop: 8,
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
  retryBtn: {
    marginTop: 16,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  retryText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
