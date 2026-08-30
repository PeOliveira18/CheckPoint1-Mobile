import { ref, set, get, query, orderByChild, equalTo } from 'firebase/database';
import { database } from './firebase';
import type { ChatUser, AuthProvider } from '@/types/user';

export async function saveUser(user: ChatUser): Promise<void> {
  const userRef = ref(database, `users/${user.uid}`);
  await set(userRef, {
    uid: user.uid,
    name: user.name,
    email: user.email,
    provider: user.provider,
  });
}

export async function getUsersByProvider(provider: AuthProvider): Promise<ChatUser[]> {
  const usersRef = query(
    ref(database, 'users'),
    orderByChild('provider'),
    equalTo(provider),
  );
  const snapshot = await get(usersRef);
  if (!snapshot.exists()) return [];

  const result: ChatUser[] = [];
  snapshot.forEach((child) => {
    const data = child.val() as ChatUser;
    result.push(data);
  });
  return result;
}
