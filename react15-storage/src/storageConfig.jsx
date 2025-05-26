import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig={
  apiKey: import.meta.env.VITE_apikey,
  authDomain: import.meta.env.VITE_authDomain,
  projectId: import.meta.env.VITE_projectId,
  storageBucket:import.meta.env.VITE_storageBucket,
  messagingSenderId: import.meta.env.VITE_messagingSenderId,
  appId: import.meta.env.VITE_appId,
};


const app = initializeApp(firebaseConfig);
//storage 객체 생성(본인의 스토리지 gs 주소 사용)
const storage = getStorage(app,"gs://myreactapp-220c9.firebasestorage.app");
export {storage};