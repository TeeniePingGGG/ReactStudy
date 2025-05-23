//파이어베이스 서비스에 연결하기 위한 임포트
import { initializeApp } from "firebase/app";
//파이어스토어 데이터 베이스 사용을 위한 임포트     
import { getFirestore } from "firebase/firestore";

//.env 파일 생성 전
//파이어베이스 콘솔에서 발급받은 API정보(SDK 정보)
// const firebaseConfig = {
//   apiKey: "AIzaSyBjwAYicYH_a5j-HqBPtCmueV0LC4XuJPg",
//   authDomain: "myreactapp-220c9.firebaseapp.com",
//   projectId: "myreactapp-220c9",
//   storageBucket: "myreactapp-220c9.firebasestorage.app",
//   messagingSenderId: "723550894259",
//   appId: "1:723550894259:web:903a07dc566cd5bb0ad8c6",
//   measurementId: "G-MZRWKWRW00"
// };

//.env 파일 생성 후
const firebaseConfig={
  apiKey: import.meta.env.VITE_apikey,
  authDomain: import.meta.env.VITE_authDomain,
  projectId: import.meta.env.VITE_projectId,
  storageBucket:import.meta.env.VITE_storageBucket,
  messagingSenderId: import.meta.env.VITE_messagingSenderId,
  appId: import.meta.env.VITE_appId,
};

//firebase에 연결 후 앱 초기화              
const app = initializeApp(firebaseConfig);
//firestore 사용을 위한 객체 생성
const firestore = getFirestore(app);
//익스포트(내보내기)
export {firestore};