import type { AuthProvider } from '@/types/user';

export function getCompatibleProviders(myProvider: AuthProvider): AuthProvider[] {
  if (myProvider === 'password') {
    return ['google', 'apple'];
  }
  return ['password'];
}

export function canChat(myProvider: AuthProvider, otherProvider: AuthProvider): boolean {
  return getCompatibleProviders(myProvider).includes(otherProvider);
}
