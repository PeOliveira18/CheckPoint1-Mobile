import { initializeApp } from 'firebase/app';
import { initializeAuth, inMemoryPersistence } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBa4QmHQXE2WQWBTznC1xRf7HfT6HWHUBY",
  authDomain: "cp-mobile-e8360.firebaseapp.com",
  databaseURL: "https://cp-mobile-e8360-default-rtdb.firebaseio.com",
  projectId: "cp-mobile-e8360",
  storageBucket: "cp-mobile-e8360.firebasestorage.app",
  messagingSenderId: "74520121131",
  appId: "1:74520121131:web:6430c2c8e654f4b7dc3f6e"
};

export const GOOGLE_WEB_CLIENT_ID =
  '74520121131-cfipvcf0vdu11vbrlbq3f5plp9k44ftc.apps.googleusercontent.com';

export const GOOGLE_IOS_CLIENT_ID =
  '74520121131-rk7h5g5ai52ig920qpq2c5pttbthupt2.apps.googleusercontent.com';

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: inMemoryPersistence,
});

export const database = getDatabase(app);
