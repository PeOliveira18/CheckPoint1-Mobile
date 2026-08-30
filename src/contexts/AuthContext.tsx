import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/services/firebase';
import { saveUser } from '@/services/userService';
import { logout as authLogout } from '@/services/authService';
import type { ChatUser, AuthProvider } from '@/types/user';

type AuthContextType = {
  user: ChatUser | null;
  loading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

function resolveProvider(firebaseUser: FirebaseUser): AuthProvider {
  const providerId = firebaseUser.providerData[0]?.providerId ?? 'password';
  if (providerId === 'google.com') return 'google';
  if (providerId === 'apple.com') return 'apple';
  return 'password';
}

function toChatUser(firebaseUser: FirebaseUser): ChatUser {
  return {
    uid: firebaseUser.uid,
    name: firebaseUser.displayName ?? firebaseUser.email ?? 'Usuário',
    email: firebaseUser.email,
    provider: resolveProvider(firebaseUser),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ChatUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const chatUser = toChatUser(firebaseUser);
        try {
          await saveUser(chatUser);
        } catch {
        }
        setUser(chatUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = useCallback(async () => {
    await authLogout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
