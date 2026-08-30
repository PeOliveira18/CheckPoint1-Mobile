import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithCredential,
  updateProfile,
} from 'firebase/auth';
import { auth } from './firebase';

export async function registerWithEmail(
  email: string,
  password: string,
  name: string,
): Promise<void> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName: name });
}

export async function loginWithEmail(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(auth, email, password);
}

export async function loginWithGoogle(idToken: string): Promise<void> {
  const credential = GoogleAuthProvider.credential(idToken);
  await signInWithCredential(auth, credential);
}

export async function loginWithApple(
  identityToken: string,
  nonce: string,
): Promise<void> {
  const provider = new OAuthProvider('apple.com');
  const credential = provider.credential({ idToken: identityToken, rawNonce: nonce });
  await signInWithCredential(auth, credential);
}

export async function logout(): Promise<void> {
  await signOut(auth);
}
