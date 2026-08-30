import type { AuthProvider } from '@/types/user';

export function getCompatibleProviders(myProvider: AuthProvider): AuthProvider[] {
  if (myProvider === 'password') {
    return ['google', 'apple'];
  }
  return ['password'];
}
