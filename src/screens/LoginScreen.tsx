import React, { useState, useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import Constants from 'expo-constants';
import {
  loginWithEmail,
  loginWithApple,
  registerWithEmail,
} from '@/services/authService';
import { GOOGLE_WEB_CLIENT_ID, GOOGLE_IOS_CLIENT_ID } from '@/services/firebase';
import { ErrorMessage } from '@/components/ErrorMessage';

WebBrowser.maybeCompleteAuthSession();

const IS_EXPO_GO = Constants.appOwnership === 'expo';

function translateError(code: string): string {
  const map: Record<string, string> = {
    'auth/invalid-email': 'E-mail inválido.',
    'auth/user-not-found': 'Usuário não encontrado.',
    'auth/wrong-password': 'Senha incorreta.',
    'auth/invalid-credential': 'E-mail ou senha incorretos.',
    'auth/email-already-in-use': 'E-mail já cadastrado.',
    'auth/weak-password': 'Senha muito fraca (mínimo 6 caracteres).',
    'auth/network-request-failed': 'Sem conexão. Verifique sua internet.',
  };
  return map[code] ?? 'Ocorreu um erro. Tente novamente.';
}

export default function LoginScreen() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailAuth = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      if (mode === 'register') {
        if (!name.trim()) {
          setError('Informe seu nome.');
          return;
        }
        await registerWithEmail(email, password, name);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err) {
      const code = (err as { code?: string }).code ?? '';
      setError(translateError(code));
    } finally {
      setLoading(false);
    }
  }, [mode, name, email, password]);

  const handleGoogle = useCallback(async () => {
    if (IS_EXPO_GO) {
      setError('Login com Google não está disponível no Expo Go. Use um build de desenvolvimento.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const { GoogleSignin, isSuccessResponse } = await import(
        '@react-native-google-signin/google-signin'
      );
      GoogleSignin.configure({
        webClientId: GOOGLE_WEB_CLIENT_ID,
        iosClientId: GOOGLE_IOS_CLIENT_ID,
      });
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (!isSuccessResponse(response) || !response.data.idToken) {
        return;
      }
      const { loginWithGoogle } = await import('@/services/authService');
      await loginWithGoogle(response.data.idToken);
    } catch (err) {
      const code = (err as { code?: string }).code ?? '';
      const message = (err as { message?: string }).message ?? '';
      setError(message || translateError(code) || 'Falha no login com Google.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleApple = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const nonce = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        Math.random().toString(),
      );
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce,
      });
      if (!credential.identityToken) {
        setError('Apple não retornou um token. Tente novamente.');
        return;
      }
      const { loginWithApple: appleLogin } = await import('@/services/authService');
      await appleLogin(credential.identityToken, nonce);
    } catch (err) {
      const code = (err as { code?: string }).code ?? '';
      if (code !== 'ERR_REQUEST_CANCELED') {
        setError('Falha no login com Apple. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Checkpoint</Text>
        <Text style={styles.subtitle}>
          {mode === 'login' ? 'Entrar na sua conta' : 'Criar nova conta'}
        </Text>

        {error && <ErrorMessage message={error} />}

        {mode === 'register' && (
          <TextInput
            style={styles.input}
            placeholder="Nome"
            placeholderTextColor="#94a3b8"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#94a3b8"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#94a3b8"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleEmailAuth}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryButtonText}>
              {mode === 'login' ? 'Entrar' : 'Cadastrar'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setMode(mode === 'login' ? 'register' : 'login');
            setError(null);
          }}
        >
          <Text style={styles.switchText}>
            {mode === 'login'
              ? 'Não tem conta? Cadastre-se'
              : 'Já tem conta? Entrar'}
          </Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>ou</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogle}
          disabled={loading}
        >
          <Text style={styles.googleButtonText}>Entrar com Google</Text>
        </TouchableOpacity>

        {Platform.OS === 'ios' && !IS_EXPO_GO && (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={8}
            style={styles.appleButton}
            onPress={handleApple}
          />
        )}
        {Platform.OS === 'ios' && IS_EXPO_GO && (
          <TouchableOpacity style={styles.appleButtonFallback} onPress={handleApple}>
            <Text style={styles.appleButtonFallbackText}>Entrar com Apple</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#f7f8fa' },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1f2328',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#57606a',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: '#ffffff',
    marginBottom: 12,
    color: '#1f2328',
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  switchText: {
    textAlign: 'center',
    color: '#2563eb',
    marginTop: 16,
    fontSize: 14,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#57606a',
    fontSize: 14,
  },
  googleButton: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginBottom: 12,
  },
  googleButtonText: {
    fontSize: 15,
    color: '#1f2328',
    fontWeight: '500',
  },
  appleButton: {
    height: 48,
    borderRadius: 8,
  },
  appleButtonFallback: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  appleButtonFallbackText: {
    fontSize: 15,
    color: '#ffffff',
    fontWeight: '500',
  },
});
