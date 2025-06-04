import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database'; 
import { getStorage } from 'firebase/storage';  
const firebaseConfig = {
  apiKey: import.meta.env.VITE_apikey,
  authDomain: import.meta.env.VITE_authDomain,
  projectId: import.meta.env.VITE_projectId,
  storageBucket: import.meta.env.VITE_storageBucket,
  messagingSenderId: import.meta.env.VITE_messagingSenderId,
  appId: import.meta.env.VITE_appId,
  // 데이터베이스가 위치한 지역의 databaseURL을 추가합니다.
  databaseURL: "https://myreactapp-220c9-default-rtdb.asia-southeast1.firebasedatabase.app",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const realtime = getDatabase(app); // Realtime Database 인스턴스 내보내기
export const storage = getStorage(app);   // Storage 인스턴스 내보내기

export default app;