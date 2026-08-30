# CP Chat

Aplicativo de chat em tempo real desenvolvido com **React Native**, **Expo** e **Firebase**.

---

## Descrição

Chat 1 para 1 com autenticação via e-mail/senha, Google e Apple. As mensagens são armazenadas e sincronizadas em tempo real usando o **Firebase Realtime Database**.

A comunicação segue uma regra de provedores:

| Usuário A        | Pode conversar com |
|------------------|--------------------|
| E-mail / Senha   | Google, Apple      |
| Google           | E-mail / Senha     |
| Apple            | E-mail / Senha     |

---

## Tecnologias

- React Native
- Expo SDK **57**
- TypeScript
- Firebase Authentication
- Firebase Realtime Database
- `@react-native-google-signin/google-signin`
- `expo-apple-authentication`

---

## Serviços Firebase

- **Firebase Authentication** — cadastro, login e identificação dos usuários
- **Firebase Realtime Database** — armazenamento e sincronização de mensagens em tempo real

---

## Como executar

### Pré-requisitos

- Node.js >= 20
- Expo CLI (`npm install -g expo-cli`)
- Conta no [Firebase Console](https://console.firebase.google.com/)

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd cp1
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com/) e crie um projeto.
2. Ative no console:
   - **Authentication** → Sign-in method → habilite E-mail/Senha, Google e Apple
   - **Realtime Database** → crie o banco e configure as regras de segurança (veja abaixo)
3. Abra `src/services/firebase.ts` e substitua os valores de `firebaseConfig` com os do seu projeto.
4. Para Google Sign-In, abra `src/screens/LoginScreen.tsx` e substitua `YOUR_WEB_CLIENT_ID` pelo Client ID OAuth do seu projeto.

### 4. Regras de segurança do Realtime Database

Cole o conteúdo do arquivo `database.rules.json` nas **Rules** do seu Realtime Database no Firebase Console.

### 5. Inicie o projeto

```bash
npx expo start
```

---

## Configuração do Firebase

### `src/services/firebase.ts`

```ts
const firebaseConfig = {
  apiKey: 'SUA_API_KEY',
  authDomain: 'SEU_AUTH_DOMAIN',
  databaseURL: 'SUA_DATABASE_URL',
  projectId: 'SEU_PROJECT_ID',
  storageBucket: 'SEU_STORAGE_BUCKET',
  messagingSenderId: 'SEU_SENDER_ID',
  appId: 'SEU_APP_ID',
};
```

---

## Estrutura do projeto

```
cp1/
  src/
    app/
      _layout.tsx       - Layout raiz (Expo Router)
      index.tsx         - Ponto de entrada, navegacao por estado
    components/
      Loading.tsx
      ErrorMessage.tsx
      ChatMessageItem.tsx
      ChatInput.tsx
      UserItem.tsx
    contexts/
      AuthContext.tsx   - Contexto de autenticacao + useAuth
    hooks/
      useChat.ts        - Hook para mensagens em tempo real
    screens/
      LoginScreen.tsx
      UsersScreen.tsx
      ChatScreen.tsx
    services/
      firebase.ts       - Inicializacao do Firebase
      authService.ts    - Login / Cadastro / Logout
      userService.ts    - Salvar/buscar usuarios no DB
      chatService.ts    - Conversas e mensagens
    types/
      user.ts
      chat.ts
    utils/
      chatRules.ts      - Regra de compatibilidade entre provedores
  database.rules.json   - Regras de seguranca do Realtime Database
```

---

## Prints da aplicacao

> Adicione aqui capturas de tela do aplicativo em execucao.

---

## Integrantes

- RM99943 - Pedro Oliveira
- RM557817 - Diego Cabral
- RM555694 - Debora Ivanowski
