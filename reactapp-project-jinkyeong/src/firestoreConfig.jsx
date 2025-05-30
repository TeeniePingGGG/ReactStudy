import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_apikey,
  authDomain: import.meta.env.VITE_authDomain,
  projectId: import.meta.env.VITE_projectId,
  storageBucket: import.meta.env.VITE_storageBucket,
  messagingSenderId: import.meta.env.VITE_messagingSenderId,
  appId: import.meta.env.VITE_appId,
};

// 이미 초기화된 Firebase 앱이 없으면 초기화, 있으면 기존 앱 사용
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const firestore = getFirestore(app);

export default app;