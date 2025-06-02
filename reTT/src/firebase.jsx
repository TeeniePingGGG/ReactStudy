import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";

//Firebase 프로젝트 설정 객체
const firebaseConfig = {
  apiKey: "AIzaSyAxAqRwZvV2pE4lKclu0Rexv55zB8dvhOE",
  authDomain: "myreact-2a3e2.firebaseapp.com",
  projectId: "myreact-2a3e2",
  storageBucket: "myreact-2a3e2.firebasestorage.app",
  messagingSenderId: "878803113660",
  appId: "1:878803113660:web:0ffacf1076af70067622b9",
  measurementId: "G-3XM80937B5"
};

//Firebase 앱 초기화
const app = initializeApp(firebaseConfig);
//Firebase 인증 객체 가져오기
export const auth = getAuth(app);